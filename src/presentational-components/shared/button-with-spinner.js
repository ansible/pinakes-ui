import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Button } from '@patternfly/react-core';
import { Spinner } from '@patternfly/react-core/dist/js/components/Spinner/Spinner';

const SpinnerButton = styled(Button)`
  display: flex !important;
  align-items: center;
`;

const SpinnerLabel = styled.span`
  margin-right: ${({ showSpinner }) => (showSpinner ? '8px' : '0')};
`;

const ButtonWithSpinner = ({ children, showSpinner, isDisabled, ...props }) => (
  <SpinnerButton {...props} isDisabled={isDisabled}>
    <SpinnerLabel showSpinner={showSpinner}>{children}</SpinnerLabel>
    {showSpinner && <Spinner size="md" />}
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
