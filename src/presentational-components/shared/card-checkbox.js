import React from 'react';
import propTypes from 'prop-types';
import { Checkbox } from '@patternfly/react-core';

const CardCheckbox = ({ handleCheck, isChecked, id }) => (
  <Checkbox
    onClick={(event) => event.stopPropagation()}
    isChecked={isChecked}
    onChange={handleCheck}
    aria-label="card checkbox"
    id={id}
  />
);

CardCheckbox.propTypes = {
  handleCheck: propTypes.func,
  isChecked: propTypes.bool,
  id: propTypes.string
};

export default CardCheckbox;
