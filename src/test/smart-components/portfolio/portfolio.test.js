import React from 'react';
import { act } from 'react-dom/test-utils';
import thunk from 'redux-thunk';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import configureStore from 'redux-mock-store';
import { shallowToJson } from 'enzyme-to-json';
import { MemoryRouter, Route } from 'react-router-dom';
import promiseMiddleware from 'redux-promise-middleware';
import notificationsMiddleware from '@redhat-cloud-services/frontend-components-notifications/notificationsMiddleware';

import ToolbarRenderer from '../../../toolbar/toolbar-renderer';
import OrderModal from '../../../smart-components/common/order-modal';
import Portfolio from '../../../smart-components/portfolio/portfolio';
import PortfolioItem from '../../../smart-components/portfolio/portfolio-item';
import {
  CATALOG_API_BASE,
  CATALOG_INVENTORY_API_BASE,
  SOURCES_API_BASE
} from '../../../utilities/constants';
import FilterToolbarItem from '../../../presentational-components/shared/filter-toolbar-item';
import RemovePortfolioModal from '../../../smart-components/portfolio/remove-portfolio-modal';
import AddProductsToPortfolio from '../../../smart-components/portfolio/add-products-to-portfolio';
import {
  FETCH_PLATFORMS,
  FETCH_PORTFOLIO,
  FETCH_PORTFOLIO_ITEMS_WITH_PORTFOLIO,
  INITIALIZE_BREADCRUMBS
} from '../../../redux/action-types';
import { testStore } from '../../../utilities/store';
import CatalogBreadcrumbs from '../../../smart-components/common/catalog-breadcrumbs';
import { BreadcrumbItem } from '@patternfly/react-core';
import CommonApiError from '../../../smart-components/error-pages/common-api-error';
import {
  mockApi,
  mockGraphql
} from '../../../helpers/shared/__mocks__/user-login';
import DialogRoutes from '../../../smart-components/dialog-routes';

describe('<Portfolio />', () => {
  let initialProps;
  let initialState;
  const middlewares = [thunk, promiseMiddleware, notificationsMiddleware()];
  let mockStore;

  const ComponentWrapper = ({
    store,
    initialEntries = ['/portfolios/detail/123'],
    children
  }) => (
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>
        {children}
        <DialogRoutes />
      </MemoryRouter>
    </Provider>
  );

  beforeEach(() => {
    initialProps = {
      id: '123'
    };
    initialState = {
      i18nReducer: {
        formatMessage: ({ defaultMessage }) => defaultMessage
      },
      breadcrumbsReducer: { fragments: [] },
      platformReducer: {
        platformItems: []
      },
      portfolioReducer: {
        selectedPortfolio: {
          id: '123',
          name: 'Foo',
          metadata: {
            user_capabilities: {
              copy: true,
              destroy: true,
              update: true,
              share: true,
              unshare: true,
              show: true
            }
          },
          statistics: {}
        },
        portfolioItems: {
          data: [],
          meta: {
            limit: 50,
            offset: 0
          }
        },
        portfolios: {
          data: [
            {
              id: '123',
              name: 'bar',
              description: 'description',
              modified: 'sometimes',
              metadata: {
                user_capabilities: {
                  copy: true,
                  destroy: true,
                  update: true,
                  share: true,
                  unshare: true,
                  show: true
                }
              },
              statistics: {}
            }
          ]
        }
      }
    };
    mockStore = configureStore(middlewares);
  });

  it('should render correctly', () => {
    const store = mockStore(initialState);
    const wrapper = shallow(
      <ComponentWrapper store={store}>
        <Portfolio {...initialProps} />
      </ComponentWrapper>
    ).find(Portfolio);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('should mount and fetch correct data', async (done) => {
    const store = mockStore(initialState);
    const expectedActions = [
      expect.objectContaining({ type: INITIALIZE_BREADCRUMBS }),
      {
        type: `${FETCH_PLATFORMS}_PENDING`
      },
      {
        type: `${FETCH_PORTFOLIO}_PENDING`
      },
      {
        type: `${FETCH_PORTFOLIO_ITEMS_WITH_PORTFOLIO}_PENDING`,
        meta: {
          filter: '',
          count: 0,
          limit: 50,
          offset: 0,
          storeState: true,
          stateKey: 'portfolioItems'
        }
      },
      expect.objectContaining({
        type: `${FETCH_PORTFOLIO_ITEMS_WITH_PORTFOLIO}_FULFILLED`
      }),
      expect.objectContaining({
        type: `${FETCH_PORTFOLIO}_FULFILLED`
      }),
      expect.objectContaining({
        type: `${FETCH_PLATFORMS}_FULFILLED`
      })
    ];

    mockApi
      .onGet(`${CATALOG_INVENTORY_API_BASE}/sources?limit=50`)
      .replyOnce(200, { data: [] });
    mockGraphql
      .onPost(`${SOURCES_API_BASE}/graphql`)
      .replyOnce(200, { data: { application_types: [{ sources: [] }] } });
    mockApi.onGet(`${CATALOG_API_BASE}/portfolios/123`).replyOnce(200, {});

    mockApi
      .onGet(
        `${CATALOG_API_BASE}/portfolios/123/portfolio_items?filter[name][contains_i]=&limit=50&offset=0`
      )
      .replyOnce(200, { data: [] });

    await act(async () => {
      mount(
        <ComponentWrapper
          store={store}
          initialEntries={['/portfolio?portfolio=123']}
        >
          <Route
            path="/portfolio"
            render={(...args) => <Portfolio {...initialProps} {...args} />}
          />
        </ComponentWrapper>
      );
    });
    setImmediate(() => {
      expect(store.getActions()).toEqual(expectedActions);
      done();
    });
  });

  it('should mount and render add products page', async (done) => {
    const store = mockStore({
      ...initialState,
      platformReducer: { platforms: [], platformItems: {} }
    });
    mockApi
      .onGet(
        `${CATALOG_API_BASE}/portfolios/123/portfolio_items?limit=50&offset=0`
      )
      .replyOnce(200, { data: [], meta: {} });
    mockApi
      .onGet(`${CATALOG_API_BASE}/portfolios/123`)
      .replyOnce(200, { data: [], meta: {} });
    mockApi
      .onGet(`${CATALOG_INVENTORY_API_BASE}/sources?limit=50`)
      .replyOnce(200, { data: [] });

    mockGraphql
      .onPost(`${SOURCES_API_BASE}/graphql`)
      .replyOnce(200, { data: { application_types: [{ sources: [] }] } });
    mockGraphql
      .onPost(`${SOURCES_API_BASE}/graphql`)
      .replyOnce(200, { data: { application_types: [{ sources: [] }] } });
    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper
          store={store}
          initialEntries={['/portfolio/add-products?portfolio=123']}
        >
          <Route
            path="/portfolio"
            render={(...args) => <Portfolio {...initialProps} {...args} />}
          />
        </ComponentWrapper>
      );
    });
    wrapper.update();
    setImmediate(() => {
      expect(wrapper.find(AddProductsToPortfolio)).toHaveLength(1);
      done();
    });
  });

  it('should mount and render remove products page and call remove products', async (done) => {
    expect.assertions(2);
    const store = mockStore({
      ...initialState,
      platformReducer: { platforms: [] },
      portfolioReducer: {
        ...initialState.portfolioReducer,
        selectedPortfolio: {
          ...initialState.portfolioReducer.selectedPortfolio,
          id: '123',
          name: 'Foo'
        },
        portfolioItems: {
          data: [
            {
              id: '123',
              name: 'Foo',
              description: 'desc',
              modified: 'sometimes',
              metadata: {
                user_capabilities: {
                  copy: true,
                  destroy: true,
                  update: true,
                  share: true,
                  unshare: true,
                  show: true
                },
                statistics: {}
              }
            }
          ],
          meta: {
            limit: 50,
            offset: 0
          }
        }
      }
    });

    mockApi
      .onGet(`${CATALOG_API_BASE}/portfolios/123`)
      .replyOnce(200, { data: [], meta: {} });
    mockApi
      .onGet(`${CATALOG_API_BASE}/portfolios/123`)
      .replyOnce(200, { data: [], meta: {} });
    mockApi
      .onDelete(`${CATALOG_API_BASE}/portfolio_items/123`)
      .replyOnce((req) => {
        expect(req).toBeTruthy();
        done();
        return [200];
      });
    mockGraphql.onPost(`${SOURCES_API_BASE}/graphql`).replyOnce(200, {
      data: {
        data: {
          application_types: [
            {
              id: '1',
              name: '/insights/platform/catalog',
              sources: [
                {
                  id: 'source-id',
                  name: 'Source',
                  source_type_id: '3',
                  availability_status: 'available',
                  enabled: true
                }
              ]
            }
          ]
        }
      }
    });
    mockApi
      .onGet(
        `${CATALOG_API_BASE}/portfolios/123/portfolio_items?limit=50&offset=0`
      )
      .replyOnce(200, { data: [], meta: {} });
    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper
          store={store}
          initialEntries={['/portfolio/remove-products?portfolio=123']}
        >
          <Route
            path="/portfolio"
            render={(...args) => <Portfolio {...initialProps} {...args} />}
          />
        </ComponentWrapper>
      );
    });

    setImmediate(async () => {
      wrapper.update();
      expect(wrapper.find(ToolbarRenderer)).toHaveLength(1);
      act(() => {
        wrapper
          .find(PortfolioItem)
          .props()
          .onSelect('123');
        wrapper.update();
      });
      await act(async () => {
        wrapper.find('button#remove-products-button').simulate('click');
      });
    });
  });

  it('should mount and render remove portfolio modal', async () => {
    const store = mockStore({
      ...initialState,
      platformReducer: { platforms: [] },
      portfolioReducer: {
        ...initialState.portfolioReducer,
        portfolioItems: {
          data: [
            {
              id: '123',
              name: 'Foo',
              description: 'desc',
              modified: 'sometimes',
              metadata: {
                user_capabilities: {
                  destroy: true
                },
                statistics: {}
              }
            }
          ],
          meta: {
            limit: 50,
            offset: 0
          }
        }
      }
    });
    mockApi
      .onGet(
        `${CATALOG_API_BASE}/portfolios/123/portfolio_items?limit=50&offset=0`
      )
      .replyOnce(200, { data: [], meta: {} });
    mockApi
      .onGet(`${CATALOG_API_BASE}/portfolios/123`)
      .replyOnce(200, { data: [], meta: {} });
    mockGraphql.onPost(`${SOURCES_API_BASE}/graphql`).replyOnce(200, {
      data: {
        data: {
          application_types: [
            {
              id: '1',
              name: '/insights/platform/catalog',
              sources: [
                {
                  id: 'source-id',
                  name: 'Source',
                  source_type_id: '3',
                  availability_status: 'available',
                  enabled: true
                }
              ]
            }
          ]
        }
      }
    });

    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper
          store={store}
          initialEntries={['/portfolio/remove-portfolio?portfolio=123']}
        >
          <Route
            path="/portfolio/remove-portfolio"
            render={(...args) => <Portfolio {...initialProps} {...args} />}
          />
        </ComponentWrapper>
      );
    });
    /**
     * await for lazy loaded component
     */
    await act(async () => {
      wrapper.update();
    });
    wrapper.update();
    expect(wrapper.find(RemovePortfolioModal)).toHaveLength(1);
  });

  it('should mount and render order item modal', async (done) => {
    const store = mockStore({
      ...initialState,
      platformReducer: { platforms: [] },
      orderReducer: {
        isLoading: false,
        servicePlans: [{ create_json_schema: { schema: { fields: [] } } }]
      },
      portfolioReducer: {
        ...initialState.portfolioReducer,
        portfolioItem: {
          source: { id: '321', availability_status: 'available' },
          portfolioItem: {
            id: '123',
            name: 'Foo',
            description: 'desc',
            modified: 'sometimes',
            metadata: {
              user_capabilities: { order: true }
            }
          }
        }
      }
    });
    mockApi
      .onGet(
        `${CATALOG_API_BASE}/portfolios/123/portfolio_items?limit=50&offset=0`
      )
      .replyOnce(200, { data: [], meta: {} });
    mockApi
      .onGet(`${CATALOG_API_BASE}/portfolios/123`)
      .replyOnce(200, { data: [], meta: {} });
    mockApi
      .onGet(`${CATALOG_API_BASE}/portfolio_items/123/service_plans`)
      .replyOnce(200, { data: [] });
    mockGraphql
      .onPost(`${SOURCES_API_BASE}/graphql`)
      .replyOnce(200, { data: { application_types: [{ sources: [] }] } });
    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper
          store={store}
          initialEntries={[
            '/portfolio/portfolio-item/order?source=321&portfolio=123&portfolio-item=123'
          ]}
        >
          <Route
            path="/portfolio"
            render={(...args) => <Portfolio {...initialProps} {...args} />}
          />
        </ComponentWrapper>
      );
    });

    await act(async () => {
      wrapper.update();
    });
    wrapper.update();
    expect(wrapper.find(OrderModal)).toHaveLength(1);
    done();
  });

  it('should mount and filter portfolio items', async (done) => {
    const store = mockStore({
      ...initialState,
      platformReducer: { platforms: [] },
      portfolioReducer: {
        ...initialState.portfolioReducer,
        portfolioItems: {
          data: [
            {
              id: '123',
              name: 'Foo',
              description: 'desc',
              modified: 'sometimes',
              metadata: {
                user_capabilities: {}
              }
            }
          ],
          meta: {
            offset: 50,
            limit: 0
          }
        }
      }
    });
    mockApi
      .onGet(
        `${CATALOG_API_BASE}/portfolios/123/portfolio_items?limit=50&offset=0`
      )
      .replyOnce(200, { data: [], meta: {} });
    mockApi
      .onGet(`${CATALOG_API_BASE}/portfolios/123`)
      .replyOnce(200, { data: [], meta: {} });
    mockGraphql
      .onPost(`${SOURCES_API_BASE}/graphql`)
      .replyOnce(200, { data: { application_types: [{ sources: [] }] } });

    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper
          store={store}
          initialEntries={['/portfolio?portfolio=123']}
        >
          <Route
            path="/portfolio"
            render={(...args) => <Portfolio {...initialProps} {...args} />}
          />
        </ComponentWrapper>
      );
    });

    setImmediate(() => {
      wrapper.update();
      expect(wrapper.find(PortfolioItem)).toHaveLength(1);
      const filterInput = wrapper.find(FilterToolbarItem).first();
      act(() => {
        filterInput.props().onFilterChange('nothing');
      });
      wrapper.update();
      expect(wrapper.find(PortfolioItem)).toHaveLength(0);
      done();
    });
  });

  it('should remove portfolio items and call undo action', async (done) => {
    expect.assertions(1);
    let store = mockStore({
      ...initialState,
      platformReducer: { platforms: [] },
      portfolioReducer: {
        ...initialState.portfolioReducer,
        selectedPortfolio: {
          ...initialState.portfolioReducer.selectedPortfolio,
          id: '321',
          name: 'Foo'
        },
        portfolioItems: {
          data: [
            {
              id: '321',
              name: 'Foo',
              description: 'desc',
              modified: 'sometimes',
              metadata: {
                user_capabilities: {
                  copy: true,
                  destroy: true,
                  update: true,
                  share: true,
                  unshare: true,
                  show: true
                }
              }
            }
          ],
          meta: {
            limit: 50,
            offset: 0
          }
        }
      }
    });
    const restoreKey = 'restore-321';

    mockApi
      .onGet(
        `${CATALOG_API_BASE}/portfolios/123/portfolio_items?filter[name][contains_i]=nothing&limit=0&offset=0`
      )
      .replyOnce(200, { data: [], meta: {} });
    mockApi
      .onGet(
        `${CATALOG_API_BASE}/portfolios/321/portfolio_items?filter[name][contains_i]=&limit=50&offset=0`
      )
      .replyOnce(200, { data: [], meta: {} });
    mockApi
      .onGet(
        `${CATALOG_API_BASE}/portfolios/321/portfolio_items?filter[name][contains_i]=nothing&limit=50&offset=0`
      )
      .replyOnce(200, { data: [], meta: {} });
    mockApi
      .onGet(`${CATALOG_API_BASE}/portfolios/321`)
      .replyOnce(200, { data: [], meta: {} });
    mockApi
      .onGet(
        `${CATALOG_INVENTORY_API_BASE}/sources?limit=1&filter[id][]=source-id`
      )
      .replyOnce(200, {
        data: [
          {
            id: 'source-id',
            name: 'Source',
            availability_status: 'available',
            enabled: true
          }
        ],
        meta: {
          count: 1,
          limit: 50,
          offset: 0
        }
      });

    mockGraphql.onPost(`${SOURCES_API_BASE}/graphql`).replyOnce(200, {
      data: {
        data: {
          application_types: [
            {
              id: '1',
              name: '/insights/platform/catalog',
              sources: [
                {
                  id: 'source-id',
                  name: 'Source',
                  source_type_id: '3',
                  availability_status: 'available',
                  enabled: true
                }
              ]
            }
          ]
        }
      }
    });

    /**
     * remove portfolio items calls
     */
    mockApi
      .onDelete(`${CATALOG_API_BASE}/portfolio_items/321`)
      .replyOnce(200, { restore_key: restoreKey });
    mockApi
      .onGet(
        `${CATALOG_API_BASE}/portfolios/321/portfolio_items?filter[name][contains_i]=&limit=50&offset=0`
      )
      .replyOnce(200, { data: [], meta: {} });
    mockApi
      .onGet(`${CATALOG_API_BASE}/portfolios/321`)
      .replyOnce(200, { data: [], meta: {} });
    mockApi
      .onGet(`${CATALOG_API_BASE}/portfolios/321/portfolio_items`)
      .replyOnce(200, { data: [], meta: {} });

    /**
     * undo endpoint
     */
    mockApi
      .onPost(`${CATALOG_API_BASE}/portfolio_items/321/undelete`)
      .replyOnce((req) => {
        expect(JSON.parse(req.data)).toEqual({ restore_key: restoreKey });
        done();
        return [200, { id: '321' }];
      });

    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper
          store={store}
          initialEntries={['/portfolio?portfolio=321']}
        >
          <Route
            path="/portfolio"
            render={(...args) => <Portfolio {...initialProps} {...args} />}
          />
        </ComponentWrapper>
      );
    });

    wrapper.update();
    const checkbox = wrapper.find(PortfolioItem).find('input');
    checkbox.simulate('change');
    wrapper.update();

    /**
     * trigger remove actions
     */
    await act(async () => {
      wrapper.find('button#remove-products-button').simulate('click');
    });
    /**
     * trigger notification undo click
     */
    const notification = store.getActions()[10].payload.description;
    const notificationWrapper = mount(
      <IntlProvider locale="en">{notification}</IntlProvider>
    );
    await act(async () => {
      notificationWrapper.find('a').simulate('click');
    });
  });

  it('should navigate back from portfolio item to portfolio via breadcrumbs', async () => {
    const { ...store } = testStore();
    mockApi
      .onGet(
        `${CATALOG_INVENTORY_API_BASE}/sources?limit=1&filter[id][]=source-id`
      )
      .replyOnce(200, {
        data: [
          {
            id: 'source-id',
            name: 'Source',
            availability_status: 'available',
            enabled: true
          }
        ],
        meta: {
          count: 1,
          limit: 50,
          offset: 0
        }
      });

    mockApi
      .onGet(`${CATALOG_API_BASE}/portfolios/portfolio-id`)
      .replyOnce(200, {
        id: 'portfolio-id',
        name: 'Portfolio',
        metadata: { user_capabilities: { show: true }, statistics: {} }
      })
      .onGet(`${CATALOG_API_BASE}/portfolio_items/portfolio-item-id`)
      .replyOnce(200, {
        id: 'portfolio-item-id',
        name: 'Portfolio item',
        portfolio_id: 'portfolio-id',
        service_offering_source_ref: 'source-id',
        created_at: '1999-07-26',
        metadata: { user_capabilities: { show: true } }
      })
      .onGet(`${SOURCES_API_BASE}/sources/source-id`)
      .replyOnce(200, { id: 'source-id', name: 'Source', source_type_id: '3' })
      .onGet(
        `${CATALOG_API_BASE}/portfolios/portfolio-id/portfolio_items??filter[name][contains_i]=&limit=50&offset=0`
      )
      .replyOnce(200, { meta: {}, data: [] });
    mockGraphql.onPost(`${SOURCES_API_BASE}/graphql`).replyOnce(200, {
      data: {
        application_types: [
          {
            id: '1',
            name: '/insights/platform/catalog',
            sources: [
              {
                id: 'source-id',
                name: 'Source',
                source_type_id: '3',
                availability_status: 'available',
                enabled: true
              }
            ]
          }
        ]
      }
    });
    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper
          store={store}
          initialEntries={[
            '/portfolio/portfolio-item?portfolio=portfolio-id&source=source-id&portfolio-item=portfolio-item-id'
          ]}
        >
          <Route
            path="/portfolio"
            render={(...args) => <Portfolio {...initialProps} {...args} />}
          />
        </ComponentWrapper>
      );
    });
    expect(store.getState().breadcrumbsReducer.fragments).toEqual([
      expect.objectContaining({ pathname: '/portfolios', searchParams: {} }),
      expect.objectContaining({
        pathname: '/portfolio',
        searchParams: {
          portfolio: 'portfolio-id'
        }
      }),
      expect.objectContaining({
        pathname: '/portfolio/portfolio-item',
        searchParams: {
          portfolio: 'portfolio-id',
          'portfolio-item': 'portfolio-item-id',
          source: 'source-id'
        }
      })
    ]);
    wrapper.update();

    expect(wrapper.find(CatalogBreadcrumbs)).toHaveLength(1);
    expect(wrapper.find(BreadcrumbItem)).toHaveLength(3);

    await act(async () => {
      wrapper
        .find('a.pf-c-breadcrumb__item')
        .at(1)
        .simulate('click', { button: 0 });
    });
    wrapper.update();
    expect(wrapper.find(BreadcrumbItem)).toHaveLength(2);
    expect(store.getState().breadcrumbsReducer.fragments).toEqual([
      expect.objectContaining({ pathname: '/portfolios', searchParams: {} }),
      expect.objectContaining({
        pathname: '/portfolio',
        searchParams: {
          portfolio: 'portfolio-id'
        }
      })
    ]);
    const { pathname, search } = wrapper
      .find(MemoryRouter)
      .instance().history.location;
    expect(pathname).toEqual('/portfolio');
    expect(search).toEqual('?portfolio=portfolio-id');
  });

  it('should redirect the user to 403 page if the user capability show is set to false', async (done) => {
    const store = mockStore({
      ...initialState,
      portfolioReducer: {
        ...initialState.portfolioReducer,
        selectedPortfolio: {
          ...initialState.portfolioReducer.selectedPortfolio,
          metadata: {
            user_capabilities: {
              show: false
            },
            statistics: {}
          }
        }
      }
    });

    mockGraphql
      .onPost(`${SOURCES_API_BASE}/graphql`)
      .replyOnce(200, { data: { application_types: [{ sources: [] }] } });
    mockApi.onGet(`${CATALOG_API_BASE}/portfolios/123`).replyOnce(200, {});

    mockApi
      .onGet(
        `${CATALOG_API_BASE}/portfolios/123/portfolio_items?filter[name][contains_i]=&limit=50&offset=0`
      )
      .replyOnce(200, { data: [] });

    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper
          store={store}
          initialEntries={['/portfolio?portfolio=123']}
        >
          <Route
            path="/portfolio"
            render={(...args) => <Portfolio {...initialProps} {...args} />}
          />
          <Route path="/403" component={CommonApiError} />
        </ComponentWrapper>
      );
    });
    expect(
      wrapper.find(MemoryRouter).instance().history.location.pathname
    ).toEqual('/403');
    wrapper.update();
    expect(wrapper.find(CommonApiError)).toHaveLength(1);
    done();
  });
});
