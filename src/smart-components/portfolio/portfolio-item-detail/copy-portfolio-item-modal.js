import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
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
import { copyPortfolioItem, fetchPortfolioItemsWithPortfolio } from '../../../redux/actions/portfolio-actions';

const copySchema = (portfolios, portfolioName, portfolioChange, nameFetching) => ({
  fields: [{
    component: 'value-only',
    name: 'portfolio_item_name',
    label: 'Name',
    value: portfolioName
  }, {
    component: componentTypes.SELECT,
    name: 'portfolio_id',
    label: 'Portfolio',
    isRequired: true,
    options: portfolios.map(({ id, name }) => ({ label: name, value: id })),
    onChange: portfolioChange,
    isDisabled: nameFetching
  }]
});

const ValueOnly = ({ name, label, value }) => (
  <FormGroup label={ label } fieldId={ name }>
    <TextContent><Text component={ TextVariants.h6 }>{ value }</Text></TextContent>
  </FormGroup>
);

ValueOnly.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
};

const CopyPortfolioItemModal = ({
  copyPortfolioItem,
  portfolios,
  portfolioId,
  portfolioItemId,
  closeUrl,
  history: { push },
  fetchPortfolioItemsWithPortfolio
}) => {
  const [ submitting, setSubmitting ] = useState(false);
  const [ name, setName ] = useState();
  const [ nameFetching, setNameFetching ] = useState(false);

  useEffect(() => {
    getPortfolioItemApi().getPortfolioItemNextName(portfolioItemId, portfolioId).then(({ next_name }) => setName(next_name));
  }, []);
  const onSubmit = values => {
    setSubmitting(true);
    copyPortfolioItem(portfolioItemId, values, portfolios.find(({ id }) => id === values.portfolio_id))
    .then(({ id }) => push(`/portfolios/detail/${values.portfolio_id}/product/${id}`))
    .then(() => values.portfolio_id === portfolioId && fetchPortfolioItemsWithPortfolio(portfolioId))
    .catch(() => setSubmitting(false));
  };

  const portfolioChange = portfolioId => {
    setNameFetching(true);
    return getPortfolioItemApi().getPortfolioItemNextName(portfolioItemId, portfolioId)
    .then(({ next_name }) => {
      setName(next_name);
    }).then(() => setNameFetching(false));
  };

  return (
    <Modal
      isOpen
      title="Copy product"
      onClose={ () => push(closeUrl) }
      isSmall
    >
      <FormRenderer
        initialValues={ { portfolio_id: portfolioId, portfolio_item_name: name } }
        schema={ copySchema(portfolios, name, portfolioChange, nameFetching) }
        onSubmit={ onSubmit }
        onCancel={ () => push(closeUrl) }
        componentMapper={ { 'value-only': ValueOnly } }
        buttonsLabels={ { submitLabel: 'Save' } }
        disableSubmit={ submitting ? [ 'pristine', 'diry' ] : [] }
      />
    </Modal>
  );};

CopyPortfolioItemModal.propTypes = {
  closeUrl: PropTypes.string.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  portfolioId: PropTypes.string.isRequired,
  portfolios: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  copyPortfolioItem: PropTypes.func.isRequired,
  portfolioItemId: PropTypes.string.isRequired,
  fetchPortfolioItemsWithPortfolio: PropTypes.func.isRequired
};

const mapStateToProps = ({ portfolioReducer: { portfolios }}) => ({
  portfolios: portfolios.data
});

const mapDispatchToProps = dispatch => bindActionCreators({
  copyPortfolioItem,
  fetchPortfolioItemsWithPortfolio
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CopyPortfolioItemModal));
