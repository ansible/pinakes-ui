import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';

import FormRenderer from '../../common/form-renderer';
import editPortfolioItemSchema from '../../../forms/edit-portfolio-item-form.schema';
import { updatePortfolioItem } from '../../../redux/actions/portfolio-actions';

const EditPortfolioItem = ({ cancelUrl, product: { owner, created_at, updated_at, ...product }}) => {
  const dispatch = useDispatch();
  const { push } = useHistory();
  const { search } = useLocation();
  return (
    <FormRenderer
      initialValues={ { ...product } }
      onSubmit={ values => {
        push({
          pathname: cancelUrl,
          search
        });
        return dispatch(updatePortfolioItem(values));
      } }
      canReset
      onCancel={ () => push({
        pathname: cancelUrl,
        search
      }) }
      schema={ editPortfolioItemSchema }
      buttonsLabels={ { submitLabel: 'Save' } }
    />
  );
};

EditPortfolioItem.propTypes = {
  cancelUrl: PropTypes.string.isRequired,
  product: PropTypes.object.isRequired
};

export default EditPortfolioItem;
