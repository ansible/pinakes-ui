import React from 'react';
import styled from 'styled-components';
import { ShareIcon, ClipboardCheckIcon } from '@patternfly/react-icons';

export const StyledShareIcon = styled(ShareIcon)`
  :hover {
    fill: var(--pf-global--Color--100);
    cursor: pointer;
  }
`;

export const StyledClipboardCheckIcon = styled(ClipboardCheckIcon)`
  :hover {
    fill: var(--pf-global--Color--100);
    cursor: pointer;
  }
`;
