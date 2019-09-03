import React from 'react';
import propTypes from 'prop-types';
import { Checkbox } from '@patternfly/react-core';

const CardCheckbox = ({ handleCheck, isChecked, id }) => (
  <div style={ { float: 'right' } }>
    <Checkbox
      onClick={ event => event.stopPropagation() }
      isChecked={ isChecked }
      onChange={ handleCheck }
      aria-label="card checkbox"
      id={ id }
    />
  </div>
);

CardCheckbox.propTypes = {
  handleCheck: propTypes.func,
  isChecked: propTypes.bool,
  id: propTypes.string
};

export default CardCheckbox;
