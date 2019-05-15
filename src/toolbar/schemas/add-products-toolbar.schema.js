import { toolbarComponentTypes } from '../toolbar-mapper';
import { createSingleItemGroup, createLinkButton } from '../helpers';
import FilterSelect from '../../presentational-components/shared/filter-select';
import ButtonWithSpinner from '../../presentational-components/shared/button-with-spinner';
import AddProductsPagination from '../../smart-components/portfolio/add-products-to-portfolio/add-products-pagination';

const createAddProductsSchema = ({
  options,
  isFetching,
  searchValue,
  portfolioName,
  itemsSelected,
  onOptionSelect,
  onFilterChange,
  portfolioRoute,
  onClickAddToPortfolio,
  meta,
  platformId
}) => ({
  fields: [{
    component: toolbarComponentTypes.TOP_TOOLBAR,
    key: 'add-products-toolbar',
    fields: [{
      component: toolbarComponentTypes.TOP_TOOLBAR_TITLE,
      title: `Add products: ${portfolioName}`,
      key: 'add-products-title'
    }, {
      component: toolbarComponentTypes.LEVEL,
      key: 'add-products-actions',
      fields: [{
        component: toolbarComponentTypes.TOOLBAR,
        key: 'add-products-actions-toolbar',
        fields: [{
          component: toolbarComponentTypes.TOOLBAR_GROUP,
          key: 'products-filter-group',
          fields: [{
            component: FilterSelect,
            key: 'select-platforms',
            id: 'products-platform-select',
            isMulti: false,
            placeholder: 'Filter by Platform',
            options,
            onChange: onOptionSelect
          }, {
            component: toolbarComponentTypes.FILTER_TOOLBAR_ITEM,
            key: 'filter-products-input',
            onFilterChange,
            searchValue,
            placeholder: 'Filter products'
          }]
        },
        createSingleItemGroup({
          groupName: 'cancel-group-item',
          key: 'portfolio-items-cancel-group',
          ...createLinkButton({
            to: portfolioRoute,
            variant: 'link',
            'aria-label': 'Cancel Add products to Portfolio',
            title: 'Cancel'
          })
        }),
        createSingleItemGroup({
          groupName: 'add-group-item',
          key: 'portfolio-items-add-group',
          ...createLinkButton({
            to: portfolioRoute,
            component: ButtonWithSpinner,
            variant: 'primary',
            'aria-label': 'Add products to Portfolio',
            title: 'Add',
            type: 'button',
            onClick: onClickAddToPortfolio,
            isDisabled: !itemsSelected || isFetching,
            showSpinner: isFetching,
            children: 'Add'
          })
        })  ]
      }, {
        component: toolbarComponentTypes.LEVEL_ITEM,
        key: 'pagination-item',
        fields: meta ? [{
          component: AddProductsPagination,
          key: 'add-products-pagination',
          meta,
          platformId
        }] : []
      }]
    }]
  }]
});

export default createAddProductsSchema;
