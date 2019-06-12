import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownPosition, KebabToggle, DropdownItem } from '@patternfly/react-core';

import { toolbarComponentTypes } from '../toolbar-mapper';
import { createSingleItemGroup, createLinkButton } from '../helpers';

/**
 * Cannot be anonymous function. Requires Component.diplayName to work with PF4 refs
 */
const PortfolioActionsToolbar = ({ setKebabOpen, isKebabOpen, removePortfolioRoute, copyInProgress, copyPortfolio }) => (
  <Dropdown
    onSelect={ () => setKebabOpen(false) }
    position={ DropdownPosition.right }
    toggle={ <KebabToggle onToggle={ setKebabOpen } isDisabled={ copyInProgress }/> }
    isOpen={ isKebabOpen }
    isDisabled
    isPlain
    dropdownItems={ [
      <DropdownItem component="button" aria-label="Copy Portfolio" key="copy-portfolio" onClick={ copyPortfolio }>
        Copy
      </DropdownItem>,
      <DropdownItem aria-label="Remove Portfolio" key="delete-portfolio">
        <Link to={ removePortfolioRoute } role="link" className="pf-c-dropdown__menu-item destructive-color">
          Delete
        </Link>
      </DropdownItem>
    ] }
  />
);

PortfolioActionsToolbar.propTypes = {
  setKebabOpen: PropTypes.func.isRequired,
  isKebabOpen: PropTypes.bool,
  removePortfolioRoute: PropTypes.string.isRequired,
  copyPortfolio: PropTypes.func.isRequired,
  copyInProgress: PropTypes.bool
};

const createPortfolioToolbarSchema = ({
  title,
  addProductsRoute,
  copyPortfolio,
  sharePortfolioRoute,
  editPortfolioRoute,
  removePortfolioRoute,
  removeProductsRoute,
  copyInProgress,
  isKebabOpen,
  setKebabOpen,
  isLoading,
  filterProps: {
    searchValue,
    onFilterChange,
    placeholder
  }
}) => ({
  fields: [{
    component: toolbarComponentTypes.TOP_TOOLBAR,
    key: 'portfolio-top-toolbar',
    fields: [{
      component: toolbarComponentTypes.TOP_TOOLBAR_TITLE,
      key: 'portfolio-toolbar-title',
      title,
      fields: [{
        component: toolbarComponentTypes.LEVEL_ITEM,
        key: 'portfolio-actions',
        className: 'toolbar-override',
        fields: [
          createLinkButton({
            to: sharePortfolioRoute,
            variant: 'secondary',
            title: 'Share',
            isDisabled: copyInProgress,
            key: 'portfolio-share-button'
          }),
          createLinkButton({
            to: editPortfolioRoute,
            variant: 'link',
            isDisabled: copyInProgress,
            title: 'Edit',
            key: 'portfolio-edit-button'
          }), {
            component: PortfolioActionsToolbar,
            removePortfolioRoute,
            copyPortfolio,
            isKebabOpen,
            setKebabOpen,
            copyInProgress,
            key: 'portfolio-actions-dropdown'
          }]
      }]
    }, {
      component: toolbarComponentTypes.TOOLBAR,
      key: 'portfolio-items-actions',
      fields: [
        createSingleItemGroup({
          groupName: 'filter-portfolio-items',
          component: toolbarComponentTypes.FILTER_TOOLBAR_ITEM,
          key: 'portfolio-items-filter',
          searchValue,
          onFilterChange,
          placeholder

        }),
        createSingleItemGroup({
          groupName: 'add-portfolio-items',
          key: 'portfolio-items-add-group',
          ...createLinkButton({
            to: addProductsRoute,
            isDisabled: isLoading || copyInProgress,
            variant: 'primary',
            title: 'Add products',
            key: 'add-products-button'
          })
        }),
        createSingleItemGroup({
          groupName: 'remove-portfolio-items',
          key: 'portfolio-items-add-group',
          ...createLinkButton({
            to: removeProductsRoute,
            isDisabled: isLoading || copyInProgress,
            variant: 'link',
            className: 'destructive-color',
            title: 'Remove products',
            key: 'remove-products-button'
          })
        }) ]
    }]
  }]
});

export default createPortfolioToolbarSchema;
