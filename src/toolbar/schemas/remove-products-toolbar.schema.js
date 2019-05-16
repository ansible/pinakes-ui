import { toolbarComponentTypes } from '../toolbar-mapper';
import { createSingleItemGroup, createLinkButton } from '../helpers';

const createRemoveProductsSchema = ({
  portfolioRoute,
  onRemove,
  portfolioName,
  filterValue,
  onFilterChange,
  disableButton
}) => ({
  fields: [{
    component: toolbarComponentTypes.TOP_TOOLBAR,
    key: 'remove-products-toolbar',
    fields: [{
      component: toolbarComponentTypes.TOP_TOOLBAR_TITLE,
      title: `Remove products: ${portfolioName}`,
      key: 'remove-products-title'
    }, {
      component: toolbarComponentTypes.LEVEL,
      key: 'remove-products-actions',
      fields: [{
        component: toolbarComponentTypes.TOOLBAR,
        key: 'remove-products-actions-toolbar',
        fields: [
          createSingleItemGroup({
            groupName: 'remove-filter-group',
            component: toolbarComponentTypes.FILTER_TOOLBAR_ITEM,
            key: 'remove-filter-input',
            placeholder: 'Filter by name...',
            searchValue: filterValue,
            onFilterChange
          }),
          createSingleItemGroup({
            groupName: 'cancel-group-item',
            ...createLinkButton({
              key: 'portfolio-items-cancel-group',
              to: portfolioRoute,
              variant: 'link',
              'aria-label': 'Cancel Add removing to Portfolio',
              title: 'Cancel'
            })
          }),
          createSingleItemGroup({
            groupName: 'remove-group-item',
            key: 'portfolio-items-remove-button',
            component: toolbarComponentTypes.BUTTON,
            isDisabled: disableButton,
            variant: 'danger',
            'aria-label': 'Remove selected portfolio items',
            onClick: onRemove,
            title: 'Remove'
          })
        ]
      }]
    }]
  }]
});

export default createRemoveProductsSchema;
