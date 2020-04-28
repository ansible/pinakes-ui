import React from 'react';
import styled from 'styled-components';
import { LevelItem } from '@patternfly/react-core';

export const StyledLevelItem = styled(({ alignStart, ...props }) => (
  <LevelItem {...props} />
))`
  align-items: ${({ alignStart }) =>
    alignStart ? 'flex-start !important' : 'inherit'};
`;
