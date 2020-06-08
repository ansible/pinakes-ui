import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Modal } from '@patternfly/react-core';
import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';

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

const loadPortfolios = (filter) =>
  listPortfolios(filter, { limit: 100, offset: 0 }).then(({ data }) =>
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

const copySchema = (portfolioName, portfolioChange, nameFetching) => ({
  fields: [
    {
      component: 'value-only',
      name: 'portfolio_item_name',
      label: 'Name',
      value: portfolioName
    },
    {
      component: componentTypes.SELECT,
      name: 'portfolio_id',
      label: 'Portfolio',
      isRequired: true,
      loadOptions: asyncFormValidator(loadPortfolios),
      onChange: portfolioChange,
      isDisabled: nameFetching,
      isSearchable: true
    }
  ]
});

const CopyPortfolioItemModal = ({
  portfolioId,
  portfolioItemId,
  closeUrl,
  search
}) => {
  const dispatch = useDispatch();
  const { push } = useHistory();
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState();
  const [nameFetching, setNameFetching] = useState(false);

  useEffect(() => {
    getPortfolioItemApi()
      .getPortfolioItemNextName(portfolioItemId, portfolioId)
      .then(({ next_name }) => setName(next_name));
  }, []);
  const onSubmit = async (values) => {
    setSubmitting(true);
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
      )
      .catch(() => setSubmitting(false));
  };

  const portfolioChange = (portfolioId) => {
    setNameFetching(true);
    return getPortfolioItemApi()
      .getPortfolioItemNextName(portfolioItemId, portfolioId)
      .then(({ next_name }) => {
        setName(next_name);
      })
      .then(() => setNameFetching(false));
  };

  return (
    <Modal
      isOpen
      title="Copy product"
      onClose={() =>
        push({
          pathname: closeUrl,
          search
        })
      }
      variant="small"
    >
      <FormRenderer
        initialValues={{ portfolio_id: portfolioId, portfolio_item_name: name }}
        schema={copySchema(name, portfolioChange, nameFetching)}
        onSubmit={onSubmit}
        onCancel={() =>
          push({
            pathname: closeUrl,
            search
          })
        }
        formContainer="modal"
        buttonsLabels={{ submitLabel: 'Save' }}
        disableSubmit={submitting ? ['pristine', 'dirty'] : []}
      />
    </Modal>
  );
};

CopyPortfolioItemModal.propTypes = {
  closeUrl: PropTypes.string.isRequired,
  portfolioId: PropTypes.string,
  portfolioItemId: PropTypes.string.isRequired,
  search: PropTypes.string.isRequired
};
export default CopyPortfolioItemModal;
