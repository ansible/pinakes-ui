import { Stack, StackItem } from '@patternfly/react-core';
import styled from 'styled-components';

export const OrderDetailStack = styled(Stack)`
  background-color: var(--pf-global--Color--light-100);
`;

export const OrderDetailStackItem = styled(StackItem)`
  border-bottom: 2px solid var(--pf-global--Color--light-200);
`;
