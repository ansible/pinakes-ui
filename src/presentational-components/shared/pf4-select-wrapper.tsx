/* eslint-disable react/prop-types */
import React, { useState, useRef, ReactNode } from 'react';
import useFieldApi, {
  ValidatorType
} from '@data-driven-forms/react-form-renderer/dist/cjs/use-field-api';
import {
  InternalSelect,
  SelectOption
} from '@data-driven-forms/pf4-component-mapper/dist/cjs/select';
import {
  FormGroup,
  TextContent,
  Text,
  TextVariants
} from '@patternfly/react-core';
import useFormApi from '@data-driven-forms/react-form-renderer/dist/cjs/use-form-api';
import { defineMessage } from 'react-intl';
import useFormatMessage from '../../utilities/use-format-message';
import { SelectOptions } from '../../types/common-types';

const createOptions = (
  options: SelectOptions,
  inputValue: string,
  isRequired: boolean,
  optionsMessages: { choose: ReactNode; none: ReactNode }
): SelectOption[] => {
  if (inputValue && isRequired) {
    return options as SelectOption[];
  }

  const selectOptions = [...options];
  return selectOptions.find(({ value }) => value === undefined)
    ? ([...selectOptions] as SelectOption[])
    : ([
        { label: isRequired ? optionsMessages.choose : optionsMessages.none },
        ...selectOptions
      ] as SelectOption[]);
};

interface SelectProps {
  input: {
    name: string;
    onChange: (value: any) => void;
    value: any;
  };
  id?: string;
  label?: ReactNode;
  options?: SelectOptions;
  isReadOnly?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
  validated?: 'default' | 'success' | 'error';
  multi?: boolean;
  loadOptions?: (
    search?: string,
    lookupArguments?: any[]
  ) => Promise<SelectOption[]>;
  meta: { initial?: any };
  onChange?: (...args: any[]) => unknown;
}
const Select: React.ComponentType<SelectProps> = ({
  input,
  options = [],
  isDisabled = false,
  isRequired = false,
  multi = false,
  loadOptions,
  meta,
  ...rest
}) => {
  const formatMessage = useFormatMessage();
  const optionsMessages = useRef<{
    none: ReactNode;
    choose: ReactNode;
  }>({
    none: formatMessage(
      defineMessage({
        id: 'forms.select.options.none',
        defaultMessage: 'None'
      })
    ),
    choose: formatMessage(
      defineMessage({
        id: 'forms.select.options.choose',
        defaultMessage: 'Please choose'
      })
    )
  });
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
          ? createOptions(
              options,
              input.value,
              isRequired,
              optionsMessages.current
            )
          : undefined
      }
      isDisabled={isDisabled}
    />
  );
};

export interface Pf4SelectWrapperProps
  extends Omit<Omit<SelectProps, 'input'>, 'meta'> {
  name: string;
  label?: ReactNode;
  isRequired?: boolean;
  helperText?: ReactNode;
  description?: ReactNode;
  hideLabel?: boolean;
  id?: string;
  initialValue?: any;
  validate?: ValidatorType[];
}
const Pf4SelectWrapper: React.ComponentType<Pf4SelectWrapperProps> = (
  props
) => {
  const {
    label,
    isRequired,
    helperText,
    meta,
    description,
    hideLabel,
    id,
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

export default Pf4SelectWrapper;
