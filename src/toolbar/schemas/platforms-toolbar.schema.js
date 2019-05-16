import { Pagination } from '@redhat-cloud-services/frontend-components';

import { toolbarComponentTypes } from '../toolbar-mapper';

const createPlatformsToolbarSchema = ({
  searchValue,
  onFilterChange,
  title,
  pagination
}) => ({
  fields: [{
    component: toolbarComponentTypes.TOP_TOOLBAR,
    key: 'platforms-toolbar',
    fields: [{
      component: toolbarComponentTypes.TOP_TOOLBAR_TITLE,
      key: 'platforms-toolbar-title',
      title
    }, {
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

export default createPlatformsToolbarSchema;
