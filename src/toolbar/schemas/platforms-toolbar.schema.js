import AppTabs from '../../presentational-components/shared/app-tabs';
import { toolbarComponentTypes } from '../toolbar-mapper';
import AsyncPagination from '../../smart-components/common/async-pagination';

export const createPlatformsToolbarSchema = ({
  searchValue,
  onFilterChange,
  title
}) => ({
  fields: [
    {
      component: toolbarComponentTypes.TOP_TOOLBAR,
      key: 'platforms-toolbar',
      fields: [
        {
          component: toolbarComponentTypes.TOP_TOOLBAR_TITLE,
          key: 'platforms-toolbar-title',
          title
        },
        {
          component: toolbarComponentTypes.LEVEL,
          key: 'platforms-toolbar-actions',
          fields: [
            {
              component: toolbarComponentTypes.LEVEL_ITEM,
              key: 'input-level-item',
              fields: [
                {
                  component: toolbarComponentTypes.FILTER_TOOLBAR_ITEM,
                  key: 'platforms-toolbar-filter-input',
                  searchValue,
                  onFilterChange,
                  placeholder: 'Filter by platform'
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

export const createPlatformsTopToolbarSchema = ({
  title,
  paddingBottom,
  tabItems,
  platformEnabled,
  platformAvailable
}) => ({
  fields: [
    {
      component: toolbarComponentTypes.TOP_TOOLBAR,
      key: 'platforms-toolbar',
      paddingBottom,
      fields: [
        {
          component: toolbarComponentTypes.LEVEL,
          fields: [
            {
              component: toolbarComponentTypes.TOOLBAR_GROUP,
              key: 'platform-toolbar',
              fields: [
                {
                  component: toolbarComponentTypes.TOOLBAR_ITEM,
                  key: 'platform-toolbar-group',
                  fields: [
                    {
                      component: toolbarComponentTypes.TOP_TOOLBAR_TITLE,
                      key: 'platforms-toolbar-title',
                      title
                    }
                  ]
                }
              ]
            },
            {
              component: toolbarComponentTypes.TOOLBAR_GROUP,
              key: 'platform-toolbar',
              alignment: 'alignRight',
              fields: [
                {
                  component: toolbarComponentTypes.TOOLBAR_ITEM,
                  key: 'platform-label',
                  alignment: 'alignRight',
                  fields: [
                    {
                      component: toolbarComponentTypes.LABEL,
                      key: 'platform-enabled-label',
                      ...platformEnabled()
                    },
                    {
                      component: toolbarComponentTypes.LABEL,
                      key: 'platform-available-label',
                      ...platformAvailable()
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          component: toolbarComponentTypes.LEVEL_ITEM,
          key: 'tabs-level-item',
          fields: tabItems
            ? [
                {
                  component: AppTabs,
                  key: 'platform-tabs',
                  tabItems
                }
              ]
            : []
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
      key: 'platforms-filter-toolbar',
      className: 'pf-u-pt-md pf-u-pb-md pf-u-pr-lg pf-u-pl-lg',
      fields: [
        {
          component: toolbarComponentTypes.LEVEL,
          key: 'platforms-toolbar-actions',
          className: 'pf-m-grow',
          fields: [
            {
              component: toolbarComponentTypes.LEVEL_ITEM,
              key: 'input-level-item',
              fields: [
                {
                  component: toolbarComponentTypes.FILTER_TOOLBAR_ITEM,
                  key: 'platforms-toolbar-filter-input',
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
                        key: 'platform-pagination',
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
