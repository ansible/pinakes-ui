import React from 'react';
import styled from 'styled-components';
import { Level, Toolbar, ToolbarGroup } from '@patternfly/react-core';

export const StyledToolbar = styled(({ noWrap, ...props }) => (
  <Toolbar {...props} />
))`
  background-color: #ffffff;
  h2 {
    margin-bottom: 0 !important;
  }
  position: relative;
  top: 1px;
  .pf-c-toolbar__content-section {
    flex-wrap: ${({ noWrap }) => (noWrap ? 'nowrap' : 'wrap')};
  }
`;

export const StyledToolbarGroup = styled(ToolbarGroup)`
  flex-wrap: wrap;
`;

export const TopToolbarWrapper = styled.div`
  background-color: #ffffff;
  .pf-c-breadcrumb__item {
    .active {
      color: var(--pf-c-breadcrumb__item--Color);
      text-decoration: none;
      pointer-events: none;
    }
  }
  h1,
  h2 {
    margin-bottom: 0 !important;
    @supports not (overflow-wrap: anywhere) {
      word-break: break-all;
    }
    @supports (overflow-wrap: anywhere) {
      overflow-wrap: anywhere;
    }
  }
  .top-toolbar-title {
    min-width: 200px;
  }
  .top-toolbar-title-description {
    word-break: break-word;
  }
  .ins-c-primary-toolbar {
    padding: 0;
  }
  .pf-c-toolbar__content {
    padding: 0;
  }
`;

export const TopToolbarTitleContainer = styled(Level)`
  @media screen and (min-width: 768px) {
    flex-wrap: nowrap;
  }
`;
