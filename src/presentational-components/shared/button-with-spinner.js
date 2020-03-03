import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Button } from '@patternfly/react-core';
import { Spinner } from '@redhat-cloud-services/frontend-components/components/Spinner';

const SpinnerButton = styled(Button)`
  display: flex !important;
  align-items: center;
`;

const StyledSpinner = styled(Spinner)`
  ::before {
    height: 16px;
    width: 16px;
    margin-left: 8px;
    border-color: #ededed;
    border-top-color: var(--pf-c-button--disabled--BackgroundColor);
  }
`;

const ButtonWithSpinner = ({ children, showSpinner, isDisabled, ...props }) => (
  <SpinnerButton {...props} isDisabled={isDisabled}>
    <span>{children}</span>
    {showSpinner && <StyledSpinner />}
  </SpinnerButton>
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
