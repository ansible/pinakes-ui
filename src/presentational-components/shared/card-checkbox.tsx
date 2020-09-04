/* eslint-disable react/prop-types */
import React from 'react';
import { Checkbox } from '@patternfly/react-core';

export interface CardCheckboxProps {
  handleCheck: (value: any) => void;
  isChecked?: boolean;
  id: string;
}
const CardCheckbox: React.ComponentType<CardCheckboxProps> = ({
  handleCheck,
  isChecked,
  id
}) => (
  <Checkbox
    onClick={(event) => event.stopPropagation()}
    isChecked={isChecked}
    onChange={handleCheck}
    aria-label="card checkbox"
    id={id}
  />
);

export default CardCheckbox;
