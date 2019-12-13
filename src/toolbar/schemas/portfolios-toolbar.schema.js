import { toolbarComponentTypes } from '../toolbar-mapper';
import { createSingleItemGroup, createLinkButton } from '../helpers';

import AsyncPagination from '../../smart-components/common/async-pagination';

const createPortfolioToolbarSchema = ({
  meta,
  fetchPortfolios,
  filterProps: { searchValue, onFilterChange, placeholder }
}) => ({
  fields: [
    {
      component: toolbarComponentTypes.TOP_TOOLBAR,
      key: 'portfolios-top-toolbar',
      fields: [
        {
          component: toolbarComponentTypes.TOP_TOOLBAR_TITLE,
          key: 'portfolios-toolbar-title',
          title: 'Portfolios'
        },
        {
          component: toolbarComponentTypes.LEVEL,
          key: 'portfolios-actions',
          fields: [
            {
              component: toolbarComponentTypes.TOOLBAR,
              key: 'main-portfolio-toolbar',
              fields: [
                createSingleItemGroup({
                  groupName: 'filter-group',
                  component: toolbarComponentTypes.FILTER_TOOLBAR_ITEM,
                  key: 'filter-input',
                  searchValue,
                  onFilterChange,
                  placeholder,
                  isClearable: true
                }),
                createSingleItemGroup({
                  groupName: 'portfolio-button-group',
                  key: 'create-portfolio',
                  ...createLinkButton({
                    to: '/portfolios/add-portfolio',
                    variant: 'primary',
                    key: 'create-portfolio-button',
                    'aria-label': 'Create portfolio',
                    title: 'Create portfolio'
                  })
                })
              ]
            },
            {
              component: toolbarComponentTypes.LEVEL_ITEM,
              key: 'pagination-item',
              fields: [
                {
                  component: AsyncPagination,
                  key: 'portfolios-pagination',
                  meta,
                  apiRequest: fetchPortfolios
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
