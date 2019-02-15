import React from 'react';
import propTypes from 'prop-types';
import { Checkbox } from '@patternfly/react-core';

const CardCheckbox = ({ handleCheck, isChecked, id }) => (
  <div style={ { float: 'right' } }>
    <Checkbox
      checked={ isChecked }
      onChange={ handleCheck }
      onClick={ event => event.stopPropagation() }
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
