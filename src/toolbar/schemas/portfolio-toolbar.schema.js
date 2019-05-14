import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownPosition, KebabToggle, DropdownItem } from '@patternfly/react-core';

import { toolbarComponentTypes } from '../toolbar-mapper';
import { createSingleItemGroup, createLinkButton } from '../helpers';

const PortfolioActionsToolbar = ({ setKebabOpen, isKebabOpen, removePortfolioRoute }) => (
  <Dropdown
    onSelect={ () => setKebabOpen(false) }
    position={ DropdownPosition.right }
    toggle={ <KebabToggle onToggle={ setKebabOpen }/> }
    isOpen={ isKebabOpen }
    isPlain
    dropdownItems={ [
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
  removePortfolioRoute: PropTypes.string.isRequired
};

const createPortfolioToolbarSchema = ({
  title,
  addProductsRoute,
  sharePortfolioRoute,
  editPortfolioRoute,
  removePortfolioRoute,
  removeProductsRoute,
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
        fields: [{
          component: toolbarComponentTypes.LINK,
          key: 'portfolio-share-action',
          to: sharePortfolioRoute,
          fields: [{
            component: toolbarComponentTypes.BUTTON,
            key: 'portfolio-share-button',
            title: 'Share',
            variant: 'secondary'
          }]
        }, {
          component: toolbarComponentTypes.LINK,
          key: 'portfolio-edit-action',
          to: editPortfolioRoute,
          fields: [{
            component: toolbarComponentTypes.BUTTON,
            key: 'portfolio-edit-button',
            title: 'Edit',
            variant: 'link'
          }]
        }, {
          component: PortfolioActionsToolbar,
          removePortfolioRoute,
          isKebabOpen,
          setKebabOpen,
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
            isDisabled: isLoading,
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
            isDisabled: isLoading,
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
