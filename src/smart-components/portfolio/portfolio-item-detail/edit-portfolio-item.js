import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';

import FormRenderer from '../../common/form-renderer';
import editPortfolioItemSchema from '../../../forms/edit-portfolio-item-form.schema';
import { updatePortfolioItem } from '../../../redux/actions/portfolio-actions';

const EditPortfolioItem = ({ workflows, history: { push }, cancelUrl, product }) => {
  const dispatch = useDispatch();
  return (
    <FormRenderer
      initialValues={ { ...product } }
      onSubmit={ values => {
        push(cancelUrl);
        return dispatch(updatePortfolioItem(values));
      } }
      onCancel={ () => push(cancelUrl) }
      schema={ editPortfolioItemSchema(workflows) }
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
