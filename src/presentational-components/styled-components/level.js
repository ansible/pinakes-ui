import React from 'react';
import styled from 'styled-components';
import { LevelItem } from '@patternfly/react-core';

export const StyledLevelItem = styled(({ alignEnd, ...props }) => (
  <LevelItem {...props} />
))`
  align-items: ${({ alignEnd }) => (alignEnd ? 'end !important' : 'inherit')};
`;
