import React from 'react';
import PropTypes from 'prop-types';

const StepLabel = ({ index, text }) => (
  <div className="requests-step-label">
    <span>{ index + 1 }</span>
    <span>{ text }</span>
  </div>
);

StepLabel.propTypes = {
  index: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired
};

export default StepLabel;
