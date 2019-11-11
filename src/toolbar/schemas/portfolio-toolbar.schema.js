import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownPosition, DropdownSeparator, KebabToggle, DropdownItem } from '@patternfly/react-core';

import { toolbarComponentTypes } from '../toolbar-mapper';
import { createSingleItemGroup, createLinkButton } from '../helpers';
import AsyncPagination from '../../smart-components/common/async-pagination';

/**
 * Cannot be anonymous function. Requires Component.diplayName to work with PF4 refs
 */
const PortfolioActionsToolbar = ({ editPortfolioRoute, workflowPortfolioRoute, removePortfolioRoute, copyInProgress, copyPortfolio }) => {
  const [ isOpen, setOpen ] =  useState(false);
  return (
    <Dropdown
      onSelect={ () => setOpen(false) }
      position={ DropdownPosition.right }
      toggle={ <KebabToggle onToggle={ setOpen } isDisabled={ copyInProgress }/> }
      isOpen={ isOpen }
      isPlain
      dropdownItems={ [
        <DropdownItem component="button" aria-label="Copy Portfolio" key="copy-portfolio" onClick={ copyPortfolio }>
        Copy
        </DropdownItem>,
        <DropdownItem aria-label="Edit Portfolio" key="edit-portfolio" component={ Link } to={ editPortfolioRoute } role="link">
            Edit
        </DropdownItem>,
        <DropdownItem
          aria-label="Remove Portfolio"
          key="delete-portfolio"
          component={ Link }
          to={ removePortfolioRoute }
          role="link"
          className="pf-c-dropdown__menu-item destructive-color"
        >
          Delete
        </DropdownItem>,
        <DropdownSeparator key="workflow-portfolio-separator"/>,
        <DropdownItem aria-label="Edit Approval Workflow" key="edit-approval_workflow" component = { Link }
          to={ workflowPortfolioRoute } role="link" >
          Edit approval workflow
        </DropdownItem>
      ] }
    />
  );};

PortfolioActionsToolbar.propTypes = {
  removePortfolioRoute: PropTypes.string.isRequired,
  editPortfolioRoute: PropTypes.string.isRequired,
  workflowPortfolioRoute: PropTypes.string.isRequired,
  copyPortfolio: PropTypes.func.isRequired,
  copyInProgress: PropTypes.bool
};

const PortfolioItemsActionsDropdown = ({ removeProducts, isDisabled, itemsSelected }) => {
  const [ isOpen, setOpen ] =  useState(false);

  return (
    <Dropdown
      onSelect={ () => setOpen(false) }
      position={ DropdownPosition.right }
      toggle={ <KebabToggle id="remove-products-dropdown-toggle" onToggle={ open => setOpen(open) } isDisabled={ isDisabled }/> }
      isOpen={ isOpen }
      isPlain
      dropdownItems={ [
        <DropdownItem
          id="remove-products"
          isDisabled={ !itemsSelected }
          onClick={ removeProducts }
          aria-label="Remove products from portfolio"
          key="remove-products"
        >
          <span style={ { cursor: 'pointer' } } className={ `pf-c-dropdown__menu-item ${!itemsSelected ? 'disabled-color' : 'destructive-color'}` }>
            Remove products
          </span>
        </DropdownItem>
      ] }
    />
  );
};

PortfolioItemsActionsDropdown.propTypes = {
  removeProducts: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
  itemsSelected: PropTypes.bool
};

const createPortfolioToolbarSchema = ({
  title,
  addProductsRoute,
  copyPortfolio,
  sharePortfolioRoute,
  editPortfolioRoute,
  workflowPortfolioRoute,
  removePortfolioRoute,
  copyInProgress,
  isLoading,
  removeProducts,
  itemsSelected,
  meta,
  fetchPortfolioItemsWithPortfolio,
  portfolioId,
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
          {
            component: PortfolioActionsToolbar,
            editPortfolioRoute,
            workflowPortfolioRoute,
            removePortfolioRoute,
            copyPortfolio,
            copyInProgress,
            key: 'portfolio-actions-dropdown'
          }]
      }]
    }, {
      component: toolbarComponentTypes.LEVEL,
      key: 'portfolio-items-actions',
      fields: [{
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
          }), {
            component: PortfolioItemsActionsDropdown,
            isDisabled: copyInProgress,
            key: 'remove-products-actions-dropdown',
            removeProducts,
            itemsSelected
          }]
      }, {
        component: toolbarComponentTypes.LEVEL_ITEM,
        key: 'pagination-item',
        fields: [{
          component: AsyncPagination,
          key: 'portfolio-items-pagination',
          meta,
          apiRequest: fetchPortfolioItemsWithPortfolio,
          apiProps: portfolioId
        }]
      }]
    }]
  }]
});

export default createPortfolioToolbarSchema;
