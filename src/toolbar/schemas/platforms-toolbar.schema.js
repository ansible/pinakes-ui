import { Pagination } from '@redhat-cloud-services/frontend-components';
import AppTabs from '../../presentational-components/shared/app-tabs';

import { toolbarComponentTypes } from '../toolbar-mapper';

export const createPlatformsTopToolbarSchema = ({
  title,
  tabItems
}) => ({
  fields: [{
    component: toolbarComponentTypes.TOP_TOOLBAR,
    key: 'platforms-toolbar',
    fields: [{
      component: toolbarComponentTypes.TOP_TOOLBAR_TITLE,
      key: 'platforms-toolbar-title',
      title
    }, {
      component: toolbarComponentTypes.LEVEL_ITEM,
      key: 'tabs-level-item',
      fields: tabItems ? [{
        component: AppTabs,
        key: 'platform-tabs',
        tabItems
      }] : []
    }]
  }]
});

export const createPlatformsFilterToolbarSchema = ({
  searchValue,
  onFilterChange,
  pagination
}) => ({
  fields: [{
    component: toolbarComponentTypes.TOOLBAR,
    key: 'platforms-filter-toolbar',
    fields: [{
      component: toolbarComponentTypes.LEVEL,
      key: 'platforms-toolbar-actions',
      fields: [{
        component: toolbarComponentTypes.LEVEL_ITEM,
        key: 'input-level-item',
        fields: [{
          component: toolbarComponentTypes.FILTER_TOOLBAR_ITEM,
          key: 'platforms-toolbar-filter-input',
          searchValue,
          onFilterChange,
          placeholder: 'Filter by name...'
        }]
      }, {
        component: toolbarComponentTypes.LEVEL_ITEM,
        key: 'pagination-level-item',
        fields: pagination ? [{
          component: Pagination,
          key: 'platform-pagination',
          ...pagination
        }] : []
      }]
    }]
  }]
});

