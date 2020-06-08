import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import { Button, FormGroup, TextContent, Text } from '@patternfly/react-core';
import ReactFormRender from '@data-driven-forms/react-form-renderer/dist/cjs/form-renderer';
import validatorMapper from '@data-driven-forms/react-form-renderer/dist/cjs/validator-mapper';
import FormTemplate from '@data-driven-forms/pf4-component-mapper/dist/cjs/form-template';
import TextField from '@data-driven-forms/pf4-component-mapper/dist/cjs/text-field';
import Textarea from '@data-driven-forms/pf4-component-mapper/dist/cjs/textarea';
import SubForm from '@data-driven-forms/pf4-component-mapper/dist/cjs/sub-form';
import PlainText from '@data-driven-forms/pf4-component-mapper/dist/cjs/plain-text';
import Checkbox from '@data-driven-forms/pf4-component-mapper/dist/cjs/checkbox';
import Radio from '@data-driven-forms/pf4-component-mapper/dist/cjs/radio';
import Switch from '@data-driven-forms/pf4-component-mapper/dist/cjs/switch';
import Pf4SelectWrapper from '../../presentational-components/shared/pf4-select-wrapper';
import ShareGroupSelect from '../../forms/form-fields/share-group-select';
import ShareGroupEdit from '../../forms/form-fields/share-group-edit';
import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/dist/cjs/validator-types';

const FormContext = createContext({});

const FormButton = ({ label, variant, ...props }) => {
  const { formContainer } = useContext(FormContext);
  return (
    <Button
      {...props}
      variant={
        formContainer === 'modal' && variant === undefined ? 'link' : variant
      }
    >
      {label}
    </Button>
  );
};

FormButton.propTypes = {
  label: PropTypes.string.isRequired,
  variant: PropTypes.string
};

const ValueOnly = ({ name, label, value }) => (
  <FormGroup label={label} fieldId={name}>
    <TextContent>
      <Text component="h6">{value}</Text>
    </TextContent>
  </FormGroup>
);

ValueOnly.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
};

const catalogComponentMapper = {
  [componentTypes.TEXT_FIELD]: TextField,
  [componentTypes.TEXTAREA]: Textarea,
  [componentTypes.PLAIN_TEXT]: PlainText,
  [componentTypes.SELECT]: Pf4SelectWrapper,
  [componentTypes.CHECKBOX]: Checkbox,
  [componentTypes.RADIO]: Radio,
  [componentTypes.SWITCH]: Switch,
  [componentTypes.SUB_FORM]: SubForm,
  'share-group-select': ShareGroupSelect,
  'share-group-edit': ShareGroupEdit,
  'value-only': ValueOnly,
  'textarea-field': Textarea,
  'select-field': Pf4SelectWrapper
};

const catalogValidatorMapper = {
  ...validatorMapper,
  'exact-length-validator': validatorMapper[validatorTypes.EXACT_LENGTH],
  'max-length-validator': validatorMapper[validatorTypes.MAX_LENGTH],
  'min-items-validator': validatorMapper[validatorTypes.MIN_ITEMS],
  'min-length-validator': validatorMapper[validatorTypes.MIN_LENGTH],
  'pattern-validator': validatorMapper[validatorTypes.PATTERN],
  'required-validator': validatorMapper[validatorTypes.REQUIRED],
  'url-validator': validatorMapper[validatorTypes.URL]
};

export const catalogValidatorAlias = {
  'exact-length-validator': validatorTypes.EXACT_LENGTH,
  'max-length-validator': validatorTypes.MAX_LENGTH,
  'min-items-validator': validatorTypes.MIN_ITEMS,
  'min-length-validator': validatorTypes.MIN_LENGTH,
  'pattern-validator': validatorTypes.PATTERN,
  'required-validator': validatorTypes.REQUIRED,
  'url-validator': validatorTypes.URL
};

const FormRenderer = ({ formContainer, ...rest }) => {
  return (
    <div>
      <FormContext.Provider value={{ formContainer }}>
        <ReactFormRender
          componentMapper={catalogComponentMapper}
          FormTemplate={FormTemplate}
          validatorMapper={catalogValidatorMapper}
          {...rest}
        />
      </FormContext.Provider>
    </div>
  );
};

FormRenderer.propTypes = {
  formContainer: PropTypes.oneOf(['default', 'modal'])
};

FormRenderer.defaultProps = {
  formContainer: 'default'
};

export default FormRenderer;
