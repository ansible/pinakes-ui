import React from 'react';
import styled from 'styled-components';
import { LevelItem } from '@patternfly/react-core';

export const StyledLevelItem = styled(
  ({ alignStart, alignSelf, grow, ...props }) => <LevelItem {...props} />
)`
  align-self: ${({ alignSelf }) => (alignSelf ? alignSelf : 'inherit')};
  align-items: ${({ alignStart }) =>
    alignStart ? 'flex-start !important' : 'inherit'};
  flex: ${({ grow }) => (grow ? '1' : '0')};
`;
