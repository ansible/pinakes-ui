import React from 'react';
import PropTypes from 'prop-types';
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
import asyncFormValidator from '../../../utilities/async-form-validator';
import { listPortfolios } from '../../../helpers/portfolio/portfolio-helper';
import { PORTFOLIO_ITEM_ROUTE } from '../../../constants/routes';
import actionMessages from '../../../messages/actions.messages';
import labelMessages from '../../../messages/labels.messages';
import portfolioMessages from '../../../messages/portfolio.messages';
import useFormatMessage from '../../../utilities/use-format-message';

const loadPortfolios = (name) =>
  listPortfolios({ name }, { limit: 100, offset: 0 }).then(({ data }) =>
    data
      .filter(
        ({
          metadata: {
            user_capabilities: { update }
          }
        }) => update
      )
      .map(({ name, id }) => ({ value: id, label: name }))
  );

const copySchema = (getName, formatMessage, initialOptions) => ({
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

const CopyPortfolioItemModal = ({
  portfolioId,
  portfolioItemId,
  closeUrl,
  search,
  portfolioName
}) => {
  const formatMessage = useFormatMessage();
  const dispatch = useDispatch();
  const { push } = useHistory();

  const onSubmit = async (values) => {
    /**
     * dispatch redux action to set selected portfolio in store
     * this will ensure that correct portfolio data will be loaded after the redirect occurs
     */
    const { value: portfolio } = await dispatch(
      fetchSelectedPortfolio(values.portfolio_id)
    );
    return dispatch(copyPortfolioItem(portfolioItemId, values, portfolio))
      .then(({ id, service_offering_source_ref }) =>
        push({
          pathname: PORTFOLIO_ITEM_ROUTE,
          search: `?portfolio=${values.portfolio_id}&portfolio-item=${id}&source=${service_offering_source_ref}`
        })
      )
      .then(
        () =>
          values.portfolio_id === portfolioId &&
          dispatch(fetchPortfolioItemsWithPortfolio(portfolioId))
      );
  };

  const portfolioChange = (portfolioId) =>
    getPortfolioItemApi()
      .getPortfolioItemNextName(portfolioItemId, portfolioId)
      .then(({ next_name }) => next_name);

  return (
    <Modal
      isOpen
      title={formatMessage(portfolioMessages.copyItemTitle)}
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
        formContainer="modal"
        templateProps={{
          submitLabel: formatMessage(actionMessages.save),
          disableSubmit: ['validating', 'submitting']
        }}
      />
    </Modal>
  );
};

CopyPortfolioItemModal.propTypes = {
  closeUrl: PropTypes.string.isRequired,
  portfolioId: PropTypes.string,
  portfolioItemId: PropTypes.string.isRequired,
  search: PropTypes.string.isRequired,
  portfolioName: PropTypes.string.isRequired
};
export default CopyPortfolioItemModal;
