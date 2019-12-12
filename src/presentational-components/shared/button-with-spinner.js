import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@patternfly/react-core';
import { Spinner } from '@redhat-cloud-services/frontend-components';

const ButtonWithSpinner = ({ children, showSpinner, isDisabled, ...props }) => (
  <Button
    className={isDisabled && showSpinner ? 'button-with-spinner' : ''}
    {...props}
    isDisabled={isDisabled}
  >
    <span>{children}</span>
    {showSpinner && <Spinner />}
  </Button>
);

ButtonWithSpinner.propTypes = {
  showSpinner: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ]),
  isDisabled: PropTypes.bool
};

ButtonWithSpinner.defaultProps = {
  showSpinner: false,
  isDisabled: false
};

export default ButtonWithSpinner;
