import React, { Component } from 'react';
import PropTypes from 'prop-types';

const CardCheckbox = ({ type = 'checkbox', id, onChange, checked = false }) => (
    <div style={ { float: 'right' } }>
        <input
            type={ type }
            id = { id }
            checked={ checked }
            onChange={ onChange }
            aria-label="card checkbox"
        />
    </div>
);

CardCheckbox.propTypes = {
    type: PropTypes.string,
    id: PropTypes.string.isRequired,
    checked: PropTypes.bool,
    onChange: PropTypes.func.isRequired
};

export default CardCheckbox;
