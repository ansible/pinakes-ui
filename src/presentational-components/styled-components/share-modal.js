import styled from 'styled-components';
import { LevelItem } from '@patternfly/react-core';

export const ShareModalContainer = styled.div`
  border-top: ${({ isGroup }) => (isGroup ? '1px solid #d2d2d2' : 'initial')};
  padding-top: ${({ isGroup }) => (isGroup ? '24px' : '0')};
`;

export const ShareGroup = styled(LevelItem)`
  flex-grow: 1;
  &:not(:first-child) {
    max-width: 200px;
    margin-left: 8px;
  }
  h4 {
    margin: 0;
  }
`;
