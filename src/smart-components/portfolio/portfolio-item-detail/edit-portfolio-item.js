import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';

import FormRenderer from '../../common/form-renderer';
import editPortfolioItemSchema from '../../../forms/edit-portfolio-item-form.schema';
import { updatePortfolioItem } from '../../../redux/actions/portfolio-actions';
import { loadWorkflowOptions } from '../../../helpers/approval/approval-helper';

const EditPortfolioItem = ({ history: { push }, cancelUrl, product: { owner, created_at, updated_at, ...product }}) => {
  const dispatch = useDispatch();
  return (
    <FormRenderer
      initialValues={ { ...product } }
      onSubmit={ values => {
        push(cancelUrl);
        return dispatch(updatePortfolioItem(values));
      } }
      canReset
      onCancel={ () => push(cancelUrl) }
      schema={ editPortfolioItemSchema(loadWorkflowOptions) }
      buttonsLabels={ { submitLabel: 'Save' } }
    />
  );
};

EditPortfolioItem.propTypes = {
  workflows: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.node.isRequired
  })).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  cancelUrl: PropTypes.string.isRequired,
  product: PropTypes.object.isRequired
};

export default withRouter(EditPortfolioItem);
