import { createGlobalStyle } from 'styled-components';

/**
 * Use direct css imports for FCE components
 * This will save some bundle size
 */
const GlobalStyle = createGlobalStyle`
.disabled-link {
  pointer-events: none
}

h2.pf-c-nav__section-title {
  font-size: 18px;
  font-weight: var(--pf-global--FontWeight--semi-bold);
}

.font-14{
  font-size: 14px;
  color: var(--pf-global--Color--100);
  font-weight: bold;
  margin-bottom: 2px !important;
}

.flex-no-wrap {
  flex-wrap: nowrap !important;
  .flex-item-no-wrap {
    align-self: flex-start;
    white-space: nowrap;
  }
  .pf-c-form__actions {
    flex-wrap: nowrap !important;
  }
}

.orders-list {
  background-color: var(--pf-global--BackgroundColor--100)
}

.share-column {
  .pf-c-select_toggle-wrapper {
    max-width: calc(100% - 70px);
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

/**
* Update DDF select styles for select component
*/
.ddorg__pf4-component-mapper__select-toggle.pf-c-select__toggle.pf-m-typeahead {
  padding-top: 1px;
  padding-bottom: 1px;
}
.ddorg__pf4-component-mapper__select-toggle {
  min-height: 34px;
}

.filter-select {
  width: 300px;
  .pf-c-select__menu {
    max-width: 100%
  }
  .pf-c-select__menu-item {
    white-space: break-spaces;
  }
  .pf-c-select_toggle-wrapper {
    max-width: calc(100% - 32px);
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

//pf-4 fixes
/**
* non working pf display modifier: https://www.patternfly.org/v4/documentation/core/utilities/display#display-block
*/
.pf-m-grow {
  flex-grow: 1;
}

.pf-c-breadcrumb__list, .overflow-wrap {
  @supports not (overflow-wrap: anywhere) {
    word-break: break-all;
  }
  @supports (overflow-wrap: anywhere) {
    overflow-wrap: anywhere;
  }
}

a.pf-c-breadcrumb__item {
  cursor: pointer;
  >* {
    cursor: pointer;
  }
}

.pf4-hidefield-overlay{
  .hide-indicator {
    z-index: 1;
  }
  &::before {
    z-index: 1;
  }
}
/**
 * table vertical align defaults to baseline
 */
.pf-c-table.orders-table tbody > tr > *{
  vertical-align: inherit;
}
/**
* End of PF4 fixes
*/

.icon-danger-fill {
  fill: var(--pf-global--danger-color--100)
}

.pf-u-gg-md {
  grid-gap: 16px !important;
  gap: 16px;
}

.bottom-pagination-container {
  width: 100%
}

.global-primary-background {
  background-color: var(--pf-global--BackgroundColor--100)
}

.full-height {
  min-height: 100%;
}

.content-layout {
  display: flex;
  flex-direction: column;
}

.pf-l-flex.align-items-center {
  align-items: center;
}

/**
 * frontend components override
 */
:root {
  --ins-color--orange: #ec7a08;
}

button:focus {
  outline: none;
}

section.ins-l-content {
  padding: var(--pf-global--spacer--lg); 
}

section.ins-l-button-group {
  margin: var(--pf-global--spacer--lg) 0;
  margin: 1.5rem 0rem; 
}

section.ins-l-button-group > * {
  display: inline; 
}

section.ins-l-button-group * + * {
  margin-left: 5px;
  margin-left: 0.3125rem; 
}

section.ins-l-icon-group * + * {
  margin-left: 10px; 
}

section.ins-l-icon-group__with-major * + * {
  margin-left: 7.5px; 
}

section.ins-l-icon-group__with-major .ins-battery:last-of-type {
  padding-left: 15px;
  border-left: 2px solid #eaeaea; 
}

section.ins-l-icon-group__with-major .ins-battery:last-of-type span.label {
  font-weight: 500;
  margin: 0 10px; 
}

.ins-c-primary-toolbar__pagination {
  margin-left: auto;
}

.ins-c-primary-toolbar .ins-c-primary-toolbar__group-filter {
  margin-right: 7px;
}
.standalone-toolbar {
  margin: 0 0 inherit 0;
  padding: var(--pf-global--spacer--lg);
  background-color: var(--pf-global--BackgroundColor--100);
}
`;

export default GlobalStyle;
