import React, { useState } from 'react';
import PropTypes from 'prop-types';
import useFieldApi from '@data-driven-forms/react-form-renderer/dist/cjs/use-field-api';
import { InternalSelect } from '@data-driven-forms/pf4-component-mapper/dist/cjs/select';
import {
  FormGroup,
  TextContent,
  Text,
  TextVariants
} from '@patternfly/react-core';
import useFormApi from '@data-driven-forms/react-form-renderer/dist/cjs/use-form-api';

const createOptions = (options, inputValue, isRequired) => {
  if (inputValue && isRequired) {
    return options;
  }

  let selectOptions = [...options];
  return selectOptions.find(({ value }) => value === undefined)
    ? [...selectOptions]
    : [{ label: isRequired ? 'Please choose' : 'None' }, ...selectOptions];
};

const Select = ({
  input,
  options,
  isReadOnly,
  isDisabled,
  FieldProvider,
  isRequired,
  multi,
  loadOptions,
  meta,
  ...rest
}) => {
  const [initialFetch, setInitialFetch] = useState(true);
  const formOptions = useFormApi();
  let loadOptionsOverride = loadOptions;
  if (loadOptions && meta.initial) {
    const lookupArguments = Array.isArray(meta.initial)
      ? meta.initial.map((option) =>
          typeof option === 'object' ? option.value : option
        )
      : [meta.initial];
    loadOptionsOverride = (filterValue) => {
      return initialFetch
        ? loadOptions(filterValue, lookupArguments).then((initialOptions) => {
            return loadOptions(filterValue).then((options) => {
              setInitialFetch(false);
              return [
                ...initialOptions,
                ...options.filter(
                  ({ value }) =>
                    !initialOptions.find((option) => option.value === value)
                )
              ];
            });
          })
        : loadOptions(filterValue);
    };
  }

  return (
    <InternalSelect
      hideSelectedOptions={false}
      menuIsPortal
      {...input}
      {...rest}
      loadOptions={loadOptionsOverride}
      onChange={(value, ...args) => {
        if (rest.onChange) {
          rest.onChange(value);
          formOptions.change(input.name, value);
        } else {
          input.onChange(value, ...args);
        }
      }}
      isMulti={multi}
      options={
        !loadOptions
          ? createOptions(options, input.value, isRequired)
          : undefined
      }
      isDisabled={isDisabled}
      closeMenuOnSelect={!multi}
    />
  );
};

Select.propTypes = {
  input: PropTypes.object.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any,
      label: PropTypes.string.isRequired
    })
  ),
  isReadOnly: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isRequired: PropTypes.bool,
  isSearchable: PropTypes.bool,
  FieldProvider: PropTypes.any,
  multi: PropTypes.bool,
  loadOptions: PropTypes.func,
  meta: PropTypes.shape({
    initial: PropTypes.any
  }).isRequired
};

Select.defaultProps = {
  isSearchable: false,
  multi: false,
  options: []
};

const Pf4SelectWrapper = (props) => {
  const {
    componentType,
    label,
    isRequired,
    helperText,
    meta,
    description,
    hideLabel,
    dataType,
    initialKey,
    id,
    initialValue,
    ...rest
  } = useFieldApi(props);
  const { error, touched } = meta;
  const showError = touched && error;
  const { name } = rest.input;

  return (
    <FormGroup
      isRequired={isRequired}
      label={!hideLabel && label}
      fieldId={id || name}
      validated={showError ? 'error' : 'default'}
      helperText={helperText}
      helperTextInvalid={meta.error}
    >
      {description && (
        <TextContent>
          <Text component={TextVariants.small}>{description}</Text>
        </TextContent>
      )}
      <Select
        id={id || name}
        meta={meta}
        label={label}
        validated={showError ? 'error' : 'default'}
        isRequired={isRequired}
        {...rest}
      />
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
  dataType: PropTypes.string,
  initialKey: PropTypes.any,
  initialValue: PropTypes.any
};

export default Pf4SelectWrapper;
