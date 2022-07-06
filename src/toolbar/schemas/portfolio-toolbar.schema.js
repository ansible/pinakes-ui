import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dropdown,
  DropdownPosition,
  KebabToggle,
  DropdownItem
} from '@patternfly/react-core';

import { toolbarComponentTypes } from '../toolbar-mapper';
import { createLinkButton } from '../helpers';
import AsyncPagination from '../../smart-components/common/async-pagination';
import CatalogLink from '../../smart-components/common/catalog-link';
import BackToProducts from '../../presentational-components/portfolio/back-to-products';
import useFormatMessage from '../../utilities/use-format-message';
import orderProcessesMessages from '../../messages/order-processes.messages';
import { NESTED_EDIT_ORDER_PROCESS_ROUTE } from '../../constants/routes';

/**
 * Cannot be anonymous function. Requires Component.displayName to work with PF4 refs
 */
const PortfolioActionsToolbar = ({
  editPortfolioRoute,
  workflowPortfolioRoute,
  removePortfolioRoute,
  copyInProgress,
  copyPortfolio,
  userCapabilities,
  canLinkOrderProcesses
}) => {
  const [isOpen, setOpen] = useState(false);
  const formatMessage = useFormatMessage();
  const dropdownItems = [];

  if (userCapabilities?.update) {
    dropdownItems.push(
      <DropdownItem
        aria-label="Edit Portfolio"
        key="edit-portfolio"
        id="edit-portfolio"
        component={
          <CatalogLink
            id="edit-portfolio"
            preserveSearch
            pathname={editPortfolioRoute}
          >
            Edit
          </CatalogLink>
        }
        role="link"
      />
    );
  }

  if (userCapabilities?.copy) {
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

  if (userCapabilities?.tags) {
    dropdownItems.push(
      <DropdownItem
        aria-label="Set approval workflow"
        key="set-approval-portfolio-action"
        id="set-approval-portfolio-action"
        component={
          <CatalogLink preserveSearch pathname={workflowPortfolioRoute}>
            Set approval
          </CatalogLink>
        }
        role="link"
      />
    );
  }

  if (userCapabilities?.update && canLinkOrderProcesses) {
    const orderProcessAction = formatMessage(
      orderProcessesMessages.setOrderProcess
    );
    dropdownItems.push(
      <DropdownItem
        aria-label={orderProcessAction}
        key="attach-order-processes"
        id="attach-order-processes"
        component={
          <CatalogLink
            preserveSearch
            pathname={NESTED_EDIT_ORDER_PROCESS_ROUTE}
          >
            {orderProcessAction}
          </CatalogLink>
        }
        role="link"
      />
    );
  }

  if (userCapabilities?.destroy) {
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

  return dropdownItems.length === 0 ? null : (
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
    destroy: PropTypes.bool,
    tags: PropTypes.bool
  }).isRequired,
  canLinkOrderProcesses: PropTypes.bool
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
  setLimit,
  setOffset,
  fetchPortfolioItemsWithPortfolio,
  portfolioId,
  description,
  fromProducts,
  filterProps: { searchValue, onFilterChange, placeholder },
  userCapabilities,
  canLinkOrderProcesses
}) => ({
  fields: [
    {
      component: toolbarComponentTypes.TOP_TOOLBAR,
      breadcrumbs: !fromProducts,
      key: 'portfolio-top-toolbar',
      fields: [
        {
          key: 'back-to-products',
          hidden: !fromProducts,
          component: BackToProducts
        },
        {
          component: toolbarComponentTypes.TOP_TOOLBAR_TITLE,
          key: 'portfolio-toolbar-title',
          noData: meta?.noData,
          title,
          description,
          fields: [
            {
              component: toolbarComponentTypes.TOOLBAR,
              key: 'portfolio-actions',
              noWrap: true,
              fields: [
                createLinkButton({
                  pathname: sharePortfolioRoute,
                  preserveSearch: true,
                  variant: 'secondary',
                  title: 'Share',
                  isDisabled: copyInProgress,
                  key: 'portfolio-share-button',
                  id: 'portfolio-share-button',
                  hidden: !userCapabilities?.share && !userCapabilities?.unshare
                }),
                {
                  component: toolbarComponentTypes.TOOLBAR_ITEM,
                  key: 'portfolio-actions-dropdown-item',
                  fields: [
                    {
                      component: PortfolioActionsToolbar,
                      editPortfolioRoute,
                      workflowPortfolioRoute,
                      removePortfolioRoute,
                      copyPortfolio,
                      copyInProgress,
                      userCapabilities,
                      canLinkOrderProcesses,
                      key: 'portfolio-actions-dropdown'
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          component: toolbarComponentTypes.LEVEL,
          key: 'portfolio-items-actions',
          fields: meta?.noData
            ? []
            : [
                {
                  component: toolbarComponentTypes.TOOLBAR,
                  key: 'portfolio-items-actions',
                  fields: [
                    {
                      groupName: 'filter-portfolio-items',
                      component: toolbarComponentTypes.FILTER_TOOLBAR_ITEM,
                      isClearable: true,
                      key: 'portfolio-items-filter',
                      searchValue,
                      onFilterChange,
                      placeholder
                    },
                    {
                      hidden: !userCapabilities?.update,
                      groupName: 'add-portfolio-items',
                      key: 'portfolio-items-add-group',
                      ...createLinkButton({
                        preserveSearch: true,
                        pathname: addProductsRoute,
                        isDisabled: isLoading || copyInProgress,
                        variant: 'primary',
                        title: 'Add',
                        id: 'add-products-button',
                        key: 'add-products-button'
                      })
                    },
                    {
                      component: toolbarComponentTypes.TOOLBAR_ITEM,
                      key: 'remove-products-item',
                      hidden: meta.count === 0 || !userCapabilities?.update,
                      fields: [
                        {
                          component: toolbarComponentTypes.BUTTON,
                          groupName: 'remove-portfolio-items',
                          variant: 'link',
                          title: 'Remove',
                          key: 'remove-products-button',
                          id: 'remove-products-button',
                          isDisabled: !itemsSelected,
                          onClick: removeProducts
                        }
                      ]
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
                            setLimit,
                            setOffset,
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
