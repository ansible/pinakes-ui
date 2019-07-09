import React from 'react';
import PropTypes from 'prop-types';
import { FormSelect, FormSelectOption, FormGroup, TextContent, Text, TextVariants } from '@patternfly/react-core';

const createOptions = (options, inputValue, isRequired) => {
  if (inputValue && isRequired) {
    return options;
  }

  let selectOptions = [ ...options ];
  return selectOptions.find(({ value }) => value === undefined)
    ? [ ...selectOptions ]
    : [{ label: isRequired ? 'Please choose' : 'None' }, ...selectOptions ];
};

const Select = ({
  input,
  options,
  isReadOnly,
  isDisabled,
  FieldProvider,
  isRequired,
  formOptions: { change },
  ...rest
}) => (
  <FormSelect { ...input } { ...rest }
    onChange={ (value, ...args) => {
      if (rest.onChange) {
        rest.onChange(value);
        change(input.name, value);
      } else {
        input.onChange(value, ...args);
      }
    } } isDisabled={ isDisabled || isReadOnly }>
    { createOptions(options, input.value, isRequired).map((props) => (
      <FormSelectOption
        key={ props.value || props.label } // eslint-disable-line react/prop-types
        { ...props }
        label={ props.label.toString() }
      />
    )) }
  </FormSelect>
);

Select.propTypes = {
  input: PropTypes.object.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.any,
    label: PropTypes.string.isRequired
  })).isRequired,
  isReadOnly: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isRequired: PropTypes.bool,
  FieldProvider: PropTypes.any,
  formOptions: PropTypes.shape({
    change: PropTypes.func
  })
};

Select.defaultProps = {
  formOptions: {}
};

const Pf4SelectWrapper = ({
  componentType,
  label,
  isRequired,
  helperText,
  meta,
  description,
  hideLabel,
  formOptions,
  dataType,
  initialKey,
  id,
  ...rest
}) => {
  const { error, touched } = meta;
  const showError = touched && error;
  const { name } = rest.input;

  return (
    <FormGroup
      isRequired={ isRequired }
      label={ !hideLabel && label }
      fieldId={ id || name }
      isValid={ !showError }
      helperText={ helperText }
      helperTextInvalid={ meta.error }
    >
      { description && <TextContent><Text component={ TextVariants.small }>{ description }</Text></TextContent> }
      <Select formOptions={ formOptions } id={ id || name } label={ label } isValid={ !showError } isRequired={ isRequired } { ...rest }/>
    </FormGroup>
  );
};

Pf4SelectWrapper.propTypes = {
  componentType: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
  isRequired: PropTypes.bool,
  helperText: PropTypes.string,
  meta: PropTypes.object,
  description: PropTypes.string,
  hideLabel: PropTypes.bool,
  formOptions: PropTypes.object,
  dataType: PropTypes.string,
  initialKey: PropTypes.any
};

export default Pf4SelectWrapper;
