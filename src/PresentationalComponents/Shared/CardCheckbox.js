import React, { Component } from 'react';
import { Checkbox } from '@patternfly/react-core';


const CardCheckbox = ({ handleCheck, isChecked }) => (
    <div style={{ float: 'right' }}>
        <Checkbox
            checked={ isChecked }
            onChange={ handleCheck }
            onClick={ event => event.stopPropagation() }
            aria-label="card checkbox"
        />
    </div>
);
export default CardCheckbox;