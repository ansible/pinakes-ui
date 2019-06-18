import React, { useState } from 'react';
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
import { copyPortfolioItem } from '../../../redux/actions/portfolio-actions';

const copySchema = (portfolios, portfolioName) => ({
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
    options: portfolios.map(({ id, display_name, name }) => ({ label: display_name || name, value: id }))
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
  copyName,
  portfolioId,
  portfolioItemId,
  closeUrl,
  history: { push }
}) => {
  const [ submitting, setSubmitting ] = useState(false);
  const onSubmit = values => {
    setSubmitting(true);
    copyPortfolioItem(portfolioItemId, values, portfolios.find(({ id }) => id === values.portfolio_id))
    .then(({ id }) => push(`/portfolios/detail/${values.portfolio_id}/product/${id}`))
    .catch(() => setSubmitting(false));
  };

  return (
    <Modal
      isOpen
      title="Copy product"
      onClose={ () => push(closeUrl) }
      isSmall
    >
      <FormRenderer
        initialValues={ { portfolio_id: portfolioId, portfolio_item_name: copyName } }
        schema={ copySchema(portfolios, copyName) }
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
  copyName: PropTypes.string.isRequired,
  portfolios: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  copyPortfolioItem: PropTypes.func.isRequired,
  portfolioItemId: PropTypes.string.isRequired
};

const mapStateToProps = ({
  portfolioReducer: { portfolios, portfolioItem: { display_name }}
}) => ({
  copyName: `Copy of ${display_name}`,
  portfolios
});

const mapDispatchToProps = dispatch => bindActionCreators({
  copyPortfolioItem
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CopyPortfolioItemModal));
