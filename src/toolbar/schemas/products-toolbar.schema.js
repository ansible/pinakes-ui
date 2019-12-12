import { toolbarComponentTypes } from '../toolbar-mapper';
import { createSingleItemGroup } from '../helpers';

import AsyncPagination from '../../smart-components/common/async-pagination';

const createPortfolioToolbarSchema = ({
  meta,
  fetchProducts,
  isLoading,
  filterProps: { searchValue, onFilterChange, placeholder }
}) => ({
  fields: [
    {
      component: toolbarComponentTypes.TOP_TOOLBAR,
      key: 'products-top-toolbar',
      fields: [
        {
          component: toolbarComponentTypes.TOP_TOOLBAR_TITLE,
          key: 'products-toolbar-title',
          title: 'Products'
        },
        {
          component: toolbarComponentTypes.LEVEL,
          key: 'Products-actions',
          fields: [
            {
              component: toolbarComponentTypes.TOOLBAR,
              key: 'main-portfolio-toolbar',
              className: 'pf-u-mt-md',
              fields: [
                createSingleItemGroup({
                  groupName: 'filter-group',
                  component: toolbarComponentTypes.FILTER_TOOLBAR_ITEM,
                  key: 'filter-input',
                  searchValue,
                  onFilterChange,
                  placeholder,
                  isClearable: true
                })
              ]
            },
            {
              component: toolbarComponentTypes.LEVEL_ITEM,
              key: 'pagination-item',
              fields: [
                {
                  component: AsyncPagination,
                  key: 'products-pagination',
                  meta,
                  apiProps: searchValue,
                  apiRequest: fetchProducts,
                  isDisabled: isLoading
                }
              ]
            }
          ]
        }
      ]
    }
  ]
});

export default createPortfolioToolbarSchema;
