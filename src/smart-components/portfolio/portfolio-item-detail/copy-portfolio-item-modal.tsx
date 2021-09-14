/* eslint-disable react/prop-types */
import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Modal } from '@patternfly/react-core';

import FormRenderer from '../../common/form-renderer';
import { getPortfolioItemApi } from '../../../helpers/shared/user-login';
import {
  copyPortfolioItem,
  fetchPortfolioItemsWithPortfolio,
  fetchSelectedPortfolio
} from '../../../redux/actions/portfolio-actions';
import {
  copyPortfolioItem as copyPortfolioItemS,
  fetchPortfolioItemsWithPortfolio as fetchPortfolioItemsWithPortfolioS,
  fetchSelectedPortfolio as fetchSelectedPortfolioS
} from '../../../redux/actions/portfolio-actions-s';

import asyncFormValidator from '../../../utilities/async-form-validator';
import { listPortfolios } from '../../../helpers/portfolio/portfolio-helper';
import { listPortfolios as listPortfoliosS } from '../../../helpers/portfolio/portfolio-helper-s';
import { PORTFOLIO_ITEM_ROUTE } from '../../../constants/routes';
import actionMessages from '../../../messages/actions.messages';
import labelMessages from '../../../messages/labels.messages';
import portfolioMessages from '../../../messages/portfolio.messages';
import useFormatMessage from '../../../utilities/use-format-message';
import {
  FormatMessage,
  Full,
  SelectOptions
} from '../../../types/common-types';
import {
  Portfolio,
  PortfolioItem,
  PortfolioItemNextName
} from '@redhat-cloud-services/catalog-client';

const loadPortfolios = (name: string) =>
  listPortfolios({ name }, { limit: 100, offset: 0 }).then((portfolio) =>
    portfolio.data
      ? portfolio.data
          .filter(
            ({
              metadata: {
                user_capabilities: { update }
              }
            }) => update
          )
          .map(({ name, id }) => ({ value: id, label: name }))
      : []
  );

const loadPortfoliosS = (name: string) =>
  listPortfoliosS({ name }, { limit: 100, offset: 0 }).then((portfolio) =>
    portfolio.results
      ? portfolio.results
          .filter(
            ({
              metadata: {
                user_capabilities: { update }
              }
            }) => update
          )
          .map(({ name, id }) => ({ value: id, label: name }))
      : []
  );
const copySchema = (
  getName: (value: string) => Promise<string | undefined>,
  formatMessage: FormatMessage,
  initialOptions: SelectOptions
) => ({
  fields: [
    {
      component: 'copy-name-display',
      name: 'portfolio_item_name',
      label: formatMessage(labelMessages.name),
      getName,
      fieldSpy: 'portfolio_id'
    },
    {
      component: 'initial-select',
      name: 'portfolio_id',
      label: formatMessage(labelMessages.portfolio),
      isRequired: true,
      loadOptions: asyncFormValidator(loadPortfolios),
      isSearchable: true,
      options: initialOptions,
      menuIsPortal: true
    }
  ]
});

export interface CopyPortfolioItemModalProps {
  closeUrl: string;
  portfolioId?: string;
  portfolioItemId: string;
  search?: string;
  portfolioName?: string;
}

const CopyPortfolioItemModal: React.ComponentType<CopyPortfolioItemModalProps> = ({
  portfolioId,
  portfolioItemId,
  closeUrl,
  search,
  portfolioName
}) => {
  const formatMessage = useFormatMessage();
  const dispatch = useDispatch();
  const { push } = useHistory();

  const onSubmit = async (values: Full<PortfolioItem>) => {
    /**
     * dispatch redux action to set selected portfolio in store
     * this will ensure that correct portfolio data will be loaded after the redirect occurs
     */
    const { value: portfolio } = await dispatch(
      (window.catalog?.standalone
        ? fetchSelectedPortfolioS(values.portfolio_id)
        : fetchSelectedPortfolio(values.portfolio_id)) as Promise<{
        value: Full<Portfolio>;
      }>
    );
    return dispatch(
      window.catalog.standalone
        ? ((copyPortfolioItemS(
            portfolioItemId,
            values,
            portfolio
          ) as unknown) as Promise<PortfolioItem>)
        : ((copyPortfolioItem(
            portfolioItemId,
            values,
            portfolio
          ) as unknown) as Promise<PortfolioItem>)
    )
      .then(({ id, service_offering_source_ref }) =>
        push({
          pathname: PORTFOLIO_ITEM_ROUTE,
          search: `?portfolio=${values.portfolio_id}&portfolio-item=${id}&source=${service_offering_source_ref}`
        })
      )
      .then(
        () =>
          values.portfolio_id === portfolioId &&
          dispatch(
            window.catalog?.standalone
              ? fetchPortfolioItemsWithPortfolioS(portfolioId)
              : fetchPortfolioItemsWithPortfolio(portfolioId)
          )
      );
  };

  const portfolioChange = (portfolioId: string) =>
    (getPortfolioItemApi().getPortfolioItemNextName(
      portfolioItemId,
      portfolioId
    ) as Promise<PortfolioItemNextName>).then(({ next_name }) => next_name);

  return (
    <Modal
      isOpen
      title={formatMessage(portfolioMessages.copyItemTitle) as string}
      onClose={() =>
        push({
          pathname: closeUrl,
          search
        })
      }
      variant="small"
    >
      <FormRenderer
        initialValues={{ portfolio_id: portfolioId }}
        schema={copySchema(portfolioChange, formatMessage, [
          { value: portfolioId, label: portfolioName }
        ])}
        onSubmit={onSubmit}
        onCancel={() =>
          push({
            pathname: closeUrl,
            search
          })
        }
        templateProps={{
          submitLabel: formatMessage(actionMessages.save),
          disableSubmit: ['validating', 'submitting']
        }}
      />
    </Modal>
  );
};

export default CopyPortfolioItemModal;
