/* eslint-disable react/prop-types */
import React, { ReactNode, ComponentType } from 'react';
import { Chip } from '@patternfly/react-core';
import { ChipGroup, FormGroup } from '@patternfly/react-core';
import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';

export interface InitialChipsProps {
  name: string;
  label: ReactNode;
}

export interface InitialChipsValue {
  id: string;
  name: ReactNode;
}

const InitialChips: ComponentType<InitialChipsProps> = ({ name, label }) => {
  const {
    input: { value, onChange }
  } = useFieldApi<InitialChipsValue[]>({ name });
  const handleRemove = (id: string) =>
    onChange(value.filter((item) => item.id !== id));
  if (value?.length === 0) {
    return null;
  }

  return (
    <FormGroup key={name} fieldId={name} label={label}>
      <ChipGroup key={name}>
        {value.map(({ name, id }) => (
          <Chip key={id} onClick={() => handleRemove(id)}>
            {name}
          </Chip>
        ))}
      </ChipGroup>
    </FormGroup>
  );
};

export default InitialChips;
