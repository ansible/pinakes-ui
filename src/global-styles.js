import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
.disabled-link {
  pointer-events: none
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
  .ddorg__pf4-component-mapper__select__single-value {
    max-width: calc(100% - 70px);
  }
}

/**
* Update DDF select styles for select component
*/
.filter-select {
  width: 300px;
  .filter-value-container {
    position: absolute;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  .ddorg__pf4-component-mapper__select__indicators {
    margin-left: auto
  }
  .ddorg__pf4-component-mapper__select__placeholder {
    margin-left: 29px !important;
  }
  .ddorg__pf4-component-mapper__select__single-value {
    margin-left: 22px !important;
    max-width: calc(100% - 55px)!important;
  }
  .ddorg__pf4-component-mapper__select__control::before {
    border-right: none !important;
  }
  .ddorg__pf4-component-mapper__select__control {
    min-height: 36px !important;
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
* End of PF4 fixes
*/

/**
* Side nav styles
*/
.orders-side-nav-category,
.orders-side-nav-link {
  color: #151515;
  font-weight: 500;
  line-height: 27px;
}

.orders-side-nav-category {
  font-size: 16px;
}

.orders-side-nav-category > .pf-c-nav__link {
  border-left: 4px solid transparent;
  padding: 8px 16px;
}

.orders-side-nav-category > .pf-c-nav__link,
.orders-side-nav-category.pf-m-current > .pf-c-nav__link {
  color: #151515;
  font-weight: 400;
}

.orders-side-nav-list .orders-side-nav-category > .pf-c-nav__link::after,
.orders-side-nav-list .orders-side-nav-category.pf-m-current > .pf-c-nav__link::after {
  content: none;
}

.orders-side-nav-category > .pf-c-nav__link:hover,
.orders-side-nav-item .orders-side-nav-link.pf-m-active,
.orders-side-nav-item .orders-side-nav-link:hover {
  background-color: #f8f8f8;
  border-left-color: #06c;
  color: #151515;
  font-weight: 400;
}

.orders-side-nav-item .orders-side-nav-link::after {
  background-color: transparent !important;
}

.orders-nav-context-switcher-dropdown .pf-c-dropdown__toggle {
  width: 100%;
}

.orders-nav-context-switcher > label,
.orders-nav-context-switcher .pf-c-dropdown__toggle-text,
.orders-nav-context-switcher .pf-c-dropdown__menu-item {
  color: var(--pf-global--active-color--100);
  font-weight: var(--pf-global--FontWeight--bold);
}

.orders-nav-context-switcher .pf-c-dropdown__toggle::before {
  border: 1px solid #979797;
}

.orders-nav-section-group {
  padding: 0 16px 8px 16px;
  border-left: 4px solid transparent;
}
.orders-side-nav-item.disabled {
  pointer-events: none;
  > a {
    color: var(--pf-global--Color--light-300) !important;
  }
}
.orders-nav-layout {
  .order-detail-content-container {
    flex-grow: 1;
  }
  .order-detail-nav-container {
    flex-shrink: 0;
  }
} 

@media screen and (max-width: 768px) {
  .orders-nav-layout {
    flex-direction: column;
    padding: 0 32px;
    .order-detail-nav-container {
      margin-bottom: 8px;
    }
    .pf-l-split__item {
      margin-right: 0 !important;
    }
    .orders-side-nav-category > .pf-c-nav__link:hover,
    .orders-side-nav-item .orders-side-nav-link.pf-m-active,
    .orders-side-nav-item .orders-side-nav-link:hover {
      background-color: transparent;
      border-left: none;
      color: var(--pf-c-nav__tertiary-list-link--Color);
      &:after {
        position: absolute;
        bottom: 0;
        left: 0;
        display: block;
        width: 100%;
        height: var(--pf-c-nav__tertiary-list-link--after--Height);
        content: "";
        background-color: var(--pf-c-nav__tertiary-list-link--m-current--after--BackgroundColor) !important;
      }
    }
    .pf-c-nav__item.orders-nav-section-group {
      border-left: 0;
      padding-left: 0;
    }
    .pf-c-nav__item.orders-side-nav-item.orders-side-nav-category {
      float: left;
      margin-right: var(--pf-c-nav__tertiary-list-item--MarginRight);
      a {
        padding-left: 0;
        padding-right: 0;
        border-left: none;
      }
    }
  }
}

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
  background-color: #fff
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
  margin: 24px 0px;
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
`;

export default GlobalStyle;
