import { toolbarComponentTypes } from '../toolbar-mapper';
import { createSingleItemGroup, createLinkButton } from '../helpers';
import { hasPermission } from '../../helpers/shared/helpers';

import AsyncPagination from '../../smart-components/common/async-pagination';

const createPortfolioToolbarSchema = ({
  meta,
  fetchPortfolios,
  userPermissions,
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
          title: 'Portfolios',
          noData: meta.noData
        },
        {
          component: toolbarComponentTypes.LEVEL,
          key: 'portfolios-actions',
          fields: meta.noData
            ? []
            : [
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
                      hidden:
                        meta.count === 0 ||
                        !hasPermission(userPermissions, [
                          'catalog:portfolios:create'
                        ]),
                      groupName: 'portfolio-button-group',
                      key: 'create-portfolio',
                      ...createLinkButton({
                        pathname: '/portfolios/add-portfolio',
                        variant: 'primary',
                        key: 'create-portfolio-button',
                        'aria-label': 'Create portfolio',
                        title: 'Create'
                      })
                    })
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
                            isCompact: true,
                            key: 'portfolios-pagination',
                            meta,
                            apiRequest: fetchPortfolios
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
