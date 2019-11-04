import React from 'react';
import PropTypes from 'prop-types';
import ReactFormRender, { componentTypes } from '@data-driven-forms/react-form-renderer';
import { layoutMapper, formFieldsMapper } from '@data-driven-forms/pf4-component-mapper';
import Pf4SelectWrapper from '../../presentational-components/shared/pf4-select-wrapper';
import ShareGroupSelect from '../../forms/form-fields/share-group-select';
import ShareGroupEdit from '../../forms/form-fields/shage-group-edit';

const buttonPositioning = {
  default: {},
  modal: {
    buttonOrder: [ 'save', 'cancel', 'reset' ],
    buttonClassName: 'modal-form-right-align'
  }
};

const FormRenderer = ({ componentMapper, formContainer, ...rest }) => (
  <div className={ buttonPositioning[formContainer].buttonClassName }>
    <ReactFormRender
      formFieldsMapper={ {
        ...formFieldsMapper,
        ...componentMapper,
        [componentTypes.SELECT]: Pf4SelectWrapper,
        'share-group-select': ShareGroupSelect,
        'share-group-edit': ShareGroupEdit
      } }
      layoutMapper={ layoutMapper }
      { ...buttonPositioning[formContainer] }
      { ...rest }
    />
  </div>
);

FormRenderer.propTypes = {
  componentMapper: PropTypes.object,
  formContainer: PropTypes.oneOf([ 'default', 'modal' ])
};

FormRenderer.defaultProps = {
  componentMapper: {},
  formContainer: 'default'
};

export default FormRenderer;
