import styled from 'styled-components';
import { Level } from '@patternfly/react-core';

export const StyledToolbar = styled.div`
  display: flex;
  flex-grow: 1;
  > *:not(:last-child) {
    margin-right: var(--pf-global--spacer--md);
  }
  background-color: #ffffff;
  h2 {
    margin-bottom: 0 !important;
  }
  position: relative;
  top: 1px;
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
`;

export const TopToolbarTitleContainer = styled(Level)`
  @media screen and (min-width: 768px) {
    flex-wrap: nowrap;
  }
`;
