import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dropdown,
  DropdownPosition,
  KebabToggle,
  DropdownItem
} from '@patternfly/react-core';

import { toolbarComponentTypes } from '../toolbar-mapper';
import { createSingleItemGroup, createLinkButton } from '../helpers';
import AsyncPagination from '../../smart-components/common/async-pagination';
import CatalogLink from '../../smart-components/common/catalog-link';

/**
 * Cannot be anonymous function. Requires Component.diplayName to work with PF4 refs
 */
const PortfolioActionsToolbar = ({
  editPortfolioRoute,
  workflowPortfolioRoute,
  removePortfolioRoute,
  copyInProgress,
  copyPortfolio,
  userCapabilities: { copy, destroy, update }
}) => {
  const [isOpen, setOpen] = useState(false);
  const dropdownItems = [];
  if (copy) {
    dropdownItems.push(
      <DropdownItem
        component="button"
        aria-label="Copy Portfolio"
        key="copy-portfolio"
        id="copy-portfolio"
        onClick={copyPortfolio}
      >
        Copy
      </DropdownItem>
    );
  }

  dropdownItems.push(
    <DropdownItem
      aria-label="Set approval workflow"
      key="edit-approval_workflow"
      component={
        <CatalogLink preserveSearch pathname={workflowPortfolioRoute}>
          Set approval
        </CatalogLink>
      }
      role="link"
    />
  );

  if (update) {
    dropdownItems.push(
      <DropdownItem
        aria-label="Edit Portfolio"
        key="edit-portfolio"
        id="edit-portfolio"
        component={
          <CatalogLink preserveSearch pathname={editPortfolioRoute}>
            Edit
          </CatalogLink>
        }
        role="link"
      />
    );
  }

  if (destroy) {
    dropdownItems.push(
      <DropdownItem
        aria-label="Remove Portfolio"
        key="delete-portfolio"
        id="delete-portfolio"
        component={
          <CatalogLink preserveSearch pathname={removePortfolioRoute}>
            Delete
          </CatalogLink>
        }
        role="link"
        className="pf-c-dropdown__menu-item"
      />
    );
  }

  return (
    <Dropdown
      className="pf-u-ml-md"
      onSelect={() => setOpen(false)}
      position={DropdownPosition.right}
      toggle={
        <KebabToggle
          id="toggle-portfolio-actions"
          onToggle={setOpen}
          isDisabled={copyInProgress}
        />
      }
      isOpen={isOpen}
      isPlain
      dropdownItems={dropdownItems}
    />
  );
};

PortfolioActionsToolbar.propTypes = {
  removePortfolioRoute: PropTypes.string.isRequired,
  editPortfolioRoute: PropTypes.string.isRequired,
  workflowPortfolioRoute: PropTypes.string.isRequired,
  copyPortfolio: PropTypes.func.isRequired,
  copyInProgress: PropTypes.bool,
  userCapabilities: PropTypes.shape({
    copy: PropTypes.bool,
    update: PropTypes.bool,
    destroy: PropTypes.bool
  }).isRequired
};

const PortfolioItemsActionsDropdown = ({
  removeProducts,
  isDisabled,
  itemsSelected,
  hidden
}) => {
  const [isOpen, setOpen] = useState(false);

  if (hidden) {
    return null;
  }

  return (
    <Dropdown
      onSelect={() => setOpen(false)}
      position={DropdownPosition.right}
      toggle={
        <KebabToggle
          id="remove-products-dropdown-toggle"
          onToggle={(open) => setOpen(open)}
          isDisabled={isDisabled}
        />
      }
      isOpen={isOpen}
      isPlain
      dropdownItems={[
        <DropdownItem
          id="remove-products"
          isDisabled={!itemsSelected}
          onClick={removeProducts}
          aria-label="Remove products from portfolio"
          key="remove-products"
        >
          Remove products
        </DropdownItem>
      ]}
    />
  );
};

PortfolioItemsActionsDropdown.propTypes = {
  removeProducts: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
  itemsSelected: PropTypes.bool,
  hidden: PropTypes.bool
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
  description,
  filterProps: { searchValue, onFilterChange, placeholder },
  userCapabilities: { share, unshare, ...userCapabilities }
}) => ({
  fields: [
    {
      component: toolbarComponentTypes.TOP_TOOLBAR,
      key: 'portfolio-top-toolbar',
      fields: [
        {
          component: toolbarComponentTypes.TOP_TOOLBAR_TITLE,
          key: 'portfolio-toolbar-title',
          noData: meta.noData,
          title,
          description,
          fields: [
            {
              component: toolbarComponentTypes.LEVEL_ITEM,
              key: 'portfolio-actions',
              fields: [
                createLinkButton({
                  pathname: sharePortfolioRoute,
                  preserveSearch: true,
                  variant: 'secondary',
                  title: 'Share',
                  isDisabled: copyInProgress,
                  key: 'portfolio-share-button',
                  id: 'portfolio-share-button',
                  hidden: !share && !unshare
                }),
                {
                  component: PortfolioActionsToolbar,
                  editPortfolioRoute,
                  workflowPortfolioRoute,
                  removePortfolioRoute,
                  copyPortfolio,
                  copyInProgress,
                  userCapabilities,
                  key: 'portfolio-actions-dropdown'
                }
              ]
            }
          ]
        },
        {
          component: toolbarComponentTypes.LEVEL,
          key: 'portfolio-items-actions',
          fields: meta.noData
            ? []
            : [
                {
                  component: toolbarComponentTypes.TOOLBAR,
                  key: 'portfolio-items-actions',
                  fields: [
                    createSingleItemGroup({
                      groupName: 'filter-portfolio-items',
                      component: toolbarComponentTypes.FILTER_TOOLBAR_ITEM,
                      isClearable: true,
                      key: 'portfolio-items-filter',
                      searchValue,
                      onFilterChange,
                      placeholder
                    }),
                    createSingleItemGroup({
                      hidden: meta.count === 0 || !userCapabilities.update,
                      groupName: 'add-portfolio-items',
                      key: 'portfolio-items-add-group',
                      ...createLinkButton({
                        preserveSearch: true,
                        pathname: addProductsRoute,
                        isDisabled: isLoading || copyInProgress,
                        variant: 'primary',
                        title: 'Add products',
                        key: 'add-products-button'
                      })
                    }),
                    {
                      hidden: meta.count === 0 || !userCapabilities.update,
                      component: PortfolioItemsActionsDropdown,
                      isDisabled: copyInProgress,
                      key: 'remove-products-actions-dropdown',
                      removeProducts,
                      itemsSelected
                    }
                  ]
                },
                {
                  component: toolbarComponentTypes.LEVEL_ITEM,
                  key: 'pagination-item',
                  fields:
                    meta.count > 0
                      ? [
                          {
                            component: AsyncPagination,
                            key: 'portfolio-items-pagination',
                            meta,
                            apiRequest: fetchPortfolioItemsWithPortfolio,
                            apiProps: portfolioId,
                            isCompact: true
                          }
                        ]
                      : []
                }
              ]
        }
      ]
    }
  ]
});

export default createPortfolioToolbarSchema;
