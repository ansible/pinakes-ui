import { toolbarComponentTypes } from '../toolbar-mapper';

const createOrdersToolbarSchema = ({ Tabs }) => ({
  fields: [{
    component: toolbarComponentTypes.TOP_TOOLBAR,
    paddingBottom: false,
    key: 'orders-toolbar',
    breadcrumbs: false,
    fields: [{
      component: toolbarComponentTypes.TOP_TOOLBAR_TITLE,
      key: 'orders-toolbar-title',
      title: 'Orders',
      className: 'pf-u-mb-0'
    }, {
      component: toolbarComponentTypes.LEVEL,
      key: 'add-products-actions',
      fields: [{
        component: Tabs,
        key: 'order-tab-nav'
      }]
    }]
  }]
});

export default createOrdersToolbarSchema;
