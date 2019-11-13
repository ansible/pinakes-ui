import { toolbarComponentTypes } from '../toolbar-mapper';

const createOrdersToolbarSchema = () => ({
  fields: [{
    component: toolbarComponentTypes.TOP_TOOLBAR,
    paddingBottom: false,
    key: 'orders-toolbar',
    breadcrumbs: false,
    fields: [{
      component: toolbarComponentTypes.TOP_TOOLBAR_TITLE,
      key: 'orders-toolbar-title',
      title: 'Orders'
    }]
  }]
});

export default createOrdersToolbarSchema;
