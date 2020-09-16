import React from 'react';
import styled from 'styled-components';
import { Card, GalleryItem } from '@patternfly/react-core';

export const StyledCard = styled(Card)`
  height: 330px;
  position: relative;
`;

export const StyledGalleryItem = styled(({ isDisabled, ...props }) => (
  <GalleryItem {...props} />
))`
  position: relative;
  ::after {
    display: ${({ isDisabled }) => (isDisabled ? 'block' : 'none')};
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    content: '';
    background-color: rgba(210, 210, 210, 0.5);
    z-index: 1;
    cursor: progress;
  }
`;
