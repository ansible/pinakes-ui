import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  FormGroup,
  Modal,
  TextContent,
  Text,
  TextVariants
} from '@patternfly/react-core';
import { componentTypes } from '@data-driven-forms/react-form-renderer';

import FormRenderer from '../../common/form-renderer';
import { getPortfolioItemApi } from '../../../helpers/shared/user-login';
import {
  copyPortfolioItem,
  fetchPortfolioItemsWithPortfolio
} from '../../../redux/actions/portfolio-actions';
import asyncFormValidator from '../../../utilities/async-form-validator';
import {
  listPortfolios,
  getPortfolio
} from '../../../helpers/portfolio/portfolio-helper';
import { PORTFOLIO_ITEM_ROUTE } from '../../../constants/routes';

const loadPortfolios = (filter) =>
  listPortfolios(filter, { limit: 100, offset: 0 }).then(({ data }) =>
    data.map(({ name, id }) => ({ value: id, label: name }))
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

const ValueOnly = ({ name, label, value }) => (
  <FormGroup label={label} fieldId={name}>
    <TextContent>
      <Text component={TextVariants.h6}>{value}</Text>
    </TextContent>
  </FormGroup>
);

ValueOnly.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
};

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
    const portfolio = await getPortfolio(values.portfolio_id);
    dispatch(copyPortfolioItem(portfolioItemId, values, portfolio))
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
      isSmall
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
        componentMapper={{ 'value-only': ValueOnly }}
        buttonsLabels={{ submitLabel: 'Save' }}
        disableSubmit={submitting ? ['pristine', 'diry'] : []}
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
