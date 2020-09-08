import React, { ComponentType } from 'react';
import styled from 'styled-components';
import { LevelItem, LevelItemProps } from '@patternfly/react-core';

export interface StyledLevelItemProps extends LevelItemProps {
  alignStart?: boolean;
  alignSelf?: string;
  grow?: boolean;
}

export const StyledLevelItem = styled<ComponentType<StyledLevelItemProps>>(
  ({ alignStart, alignSelf, grow, ...props }) => <LevelItem {...props} />
)`
  align-self: ${({ alignSelf }) => (alignSelf ? alignSelf : 'inherit')};
  align-items: ${({ alignStart }) =>
    alignStart ? 'flex-start !important' : 'inherit'};
  flex: ${({ grow }) => (grow ? '1' : '0')};
`;
