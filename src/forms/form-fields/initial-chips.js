import React from 'react';
import { Chip, ChipGroup } from '@patternfly/react-core';
import useFieldApi from '@data-driven-forms/react-form-renderer/dist/cjs/use-field-api';

const InitialChips = ({ name }) => {
  const {
    input: { value }
  } = useFieldApi({ name });
  return (
    <ChipGroup>
      {value.map(({ name, id }) => (
        <Chip key={id}>{name}</Chip>
      ))}
    </ChipGroup>
  );
};

export default InitialChips;
