import styled from 'styled-components';
import { LevelItem } from '@patternfly/react-core';

export const StyledLevelItem = styled(LevelItem)`
  align-items: ${({ alignEnd }) => (alignEnd ? 'end !important' : 'inherit')};
`;
