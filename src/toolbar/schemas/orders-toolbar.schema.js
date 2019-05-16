import { toolbarComponentTypes } from '../toolbar-mapper';

const createOrdersToolbarSchema = () => ({
  fields: [{
    component: toolbarComponentTypes.TOP_TOOLBAR,
    key: 'orders-toolbar',
    breadcrumbs: false,
    fields: [{
      component: toolbarComponentTypes.TOP_TOOLBAR_TITLE,
      key: 'orders-toolbar-title',
      title: 'Orders',
      className: 'pf-u-mb-0'
    }]
  }]
});

export default createOrdersToolbarSchema;
