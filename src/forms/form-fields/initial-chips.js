import React from 'react';
import PropTypes from 'prop-types';
import { Chip, ChipGroup, FormGroup } from '@patternfly/react-core';
import useFieldApi from '@data-driven-forms/react-form-renderer/dist/cjs/use-field-api';

const InitialChips = ({ name, label }) => {
  const {
    input: { value, onChange }
  } = useFieldApi({ name });
  const handleRemove = (id) => onChange(value.filter((item) => item.id !== id));
  if (value?.length === 0) {
    return null;
  }

  return (
    <FormGroup label={label}>
      <ChipGroup>
        {value.map(({ name, id }) => (
          <Chip key={id} onClick={() => handleRemove(id)}>
            {name}
          </Chip>
        ))}
      </ChipGroup>
    </FormGroup>
  );
};

InitialChips.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired
};

export default InitialChips;
