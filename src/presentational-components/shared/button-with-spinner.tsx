/* eslint-disable react/prop-types */
import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { Button } from '@patternfly/react-core';
import { Spinner } from '@patternfly/react-core/dist/js/components/Spinner/Spinner';
import { AnyObject } from '../../types/common-types';

const SpinnerButton = styled(Button)`
  display: flex !important;
  align-items: center;
`;

const SpinnerLabel = styled.span<{ showSpinner: boolean }>`
  margin-right: ${({ showSpinner }) => (showSpinner ? '8px' : '0')};
`;

export interface ButtonWithSpinnerProps extends AnyObject {
  showSpinner?: boolean;
  isDisabled?: boolean;
}
const ButtonWithSpinner = forwardRef<HTMLButtonElement, ButtonWithSpinnerProps>(
  ({ children, showSpinner = false, isDisabled = false, ...props }, ref) => (
    <SpinnerButton ref={ref} {...props} isDisabled={isDisabled}>
      <SpinnerLabel showSpinner={showSpinner}>{children}</SpinnerLabel>
      {showSpinner && <Spinner size="md" />}
    </SpinnerButton>
  )
);

ButtonWithSpinner.displayName = 'ButtonWithSpinner';

export default ButtonWithSpinner;
