import { toolbarComponentTypes } from '../toolbar-mapper';

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
          title: 'Products',
          description: 'All products collected from your portfolios',
          noData: meta.noData
        },
        {
          component: toolbarComponentTypes.LEVEL,
          key: 'Products-actions',
          fields: meta.noData
            ? []
            : [
                {
                  component: toolbarComponentTypes.TOOLBAR,
                  key: 'main-portfolio-toolbar',
                  fields: [
                    {
                      groupName: 'filter-group',
                      component: toolbarComponentTypes.FILTER_TOOLBAR_ITEM,
                      key: 'filter-input',
                      searchValue,
                      onFilterChange,
                      placeholder,
                      isClearable: true
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
                            key: 'products-pagination',
                            meta,
                            apiProps: searchValue,
                            apiRequest: fetchProducts,
                            isDisabled: isLoading,
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
