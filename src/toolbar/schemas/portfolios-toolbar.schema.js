import { toolbarComponentTypes } from '../toolbar-mapper';

const createPortfolioToolbarSchema = ({
  filterProps: {
    searchValue,
    onFilterChange,
    placeholder
  }
}) => ({
  fields: [{
    component: toolbarComponentTypes.TOP_TOOLBAR,
    key: 'portfolios-top-toolbar',
    fields: [{
      component: toolbarComponentTypes.TOP_TOOLBAR_TITLE,
      key: 'portfolios-toolbar-title',
      title: 'Portfolios'
    }, {
      component: toolbarComponentTypes.TOOLBAR,
      key: 'main-portfolio-toolbar',
      className: 'pf-u-mt-md',
      fields: [{
        component: toolbarComponentTypes.TOOLBAR_GROUP,
        key: 'filter-group',
        fields: [{
          component: toolbarComponentTypes.TOOLBAR_ITEM,
          key: 'filter-input-container',
          fields: [{
            component: 'FilterToolbarItem',
            key: 'filter-input',
            searchValue,
            onFilterChange,
            placeholder
          }]
        }]
      }, {
        component: toolbarComponentTypes.TOOLBAR_GROUP,
        key: 'portfolios-button-group',
        fields: [{
          component: toolbarComponentTypes.TOOLBAR_ITEM,
          key: 'create-portfolio-item',
          fields: [{
            component: toolbarComponentTypes.LINK,
            key: 'create-portfolio-link',
            to: '/portfolios/add-portfolio',
            fields: [{
              component: toolbarComponentTypes.BUTTON,
              key: 'create-portfolio-button',
              variant: 'primary',
              'aria-label': 'Create portfolio',
              title: 'Create portfolio'
            }]
          }]
        }]
      }]
    }]
  }]
});

export default createPortfolioToolbarSchema;
