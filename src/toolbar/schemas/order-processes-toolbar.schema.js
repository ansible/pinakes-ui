import { toolbarComponentTypes } from '../toolbar-mapper';
import AsyncPagination from '../../smart-components/common/async-pagination';

export const createOrderProcessesToolbarSchema = ({
  searchValue,
  onFilterChange,
  title
}) => ({
  fields: [
    {
      component: toolbarComponentTypes.TOP_TOOLBAR,
      key: 'order-processes-toolbar',
      fields: [
        {
          component: toolbarComponentTypes.TOP_TOOLBAR_TITLE,
          key: 'order-processes-toolbar-title',
          title
        },
        {
          component: toolbarComponentTypes.LEVEL,
          key: 'order-processes-toolbar-actions',
          fields: [
            {
              component: toolbarComponentTypes.LEVEL_ITEM,
              key: 'input-level-item',
              fields: [
                {
                  component: toolbarComponentTypes.FILTER_TOOLBAR_ITEM,
                  key: 'order-processes-toolbar-filter-input',
                  searchValue,
                  onFilterChange,
                  placeholder: 'Filter by name'
                }
              ]
            },
            {
              component: toolbarComponentTypes.LEVEL_ITEM,
              key: 'pagination-level-item',
              fields: []
            }
          ]
        }
      ]
    }
  ]
});

export const createOrderProcessesFilterToolbarSchema = ({
  title,
  paddingBottom
}) => ({
  fields: [
    {
      component: toolbarComponentTypes.TOP_TOOLBAR,
      key: 'order-processes-toolbar',
      paddingBottom,
      fields: [
        {
          component: toolbarComponentTypes.TOP_TOOLBAR_TITLE,
          key: 'order-processes-toolbar-title',
          title
        }
      ]
    }
  ]
});

export const createPlatformsFilterToolbarSchema = ({
  searchValue,
  onFilterChange,
  meta,
  apiRequest,
  filterPlaceholder
}) => ({
  fields: [
    {
      component: toolbarComponentTypes.TOOLBAR,
      key: 'order-processes-filter-toolbar',
      className: 'pf-u-pt-md pf-u-pb-md pf-u-pr-lg pf-u-pl-lg',
      fields: [
        {
          component: toolbarComponentTypes.LEVEL,
          key: 'order-processes-toolbar-actions',
          className: 'pf-m-grow',
          fields: [
            {
              component: toolbarComponentTypes.LEVEL_ITEM,
              key: 'input-level-item',
              fields: [
                {
                  component: toolbarComponentTypes.FILTER_TOOLBAR_ITEM,
                  key: 'order-processes-toolbar-filter-input',
                  searchValue,
                  onFilterChange,
                  placeholder: filterPlaceholder
                }
              ]
            },
            {
              component: toolbarComponentTypes.LEVEL_ITEM,
              key: 'pagination-level-item',
              fields:
                meta.count > 0
                  ? [
                      {
                        component: AsyncPagination,
                        key: 'order-processes-pagination',
                        apiRequest,
                        meta,
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
