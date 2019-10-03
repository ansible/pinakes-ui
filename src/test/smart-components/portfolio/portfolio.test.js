import React from 'react';
import { act } from 'react-dom/test-utils';
import thunk from 'redux-thunk';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import configureStore from 'redux-mock-store' ;
import { shallowToJson } from 'enzyme-to-json';
import { MemoryRouter, Route } from 'react-router-dom';
import promiseMiddleware from 'redux-promise-middleware';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications/';

import ToolbarRenderer from '../../../toolbar/toolbar-renderer';
import OrderModal from '../../../smart-components/common/order-modal';
import Portfolio from '../../../smart-components/portfolio/portfolio';
import PortfolioItem from '../../../smart-components/portfolio/portfolio-item';
import { CATALOG_API_BASE, SOURCES_API_BASE } from '../../../utilities/constants';
import FilterToolbarItem from '../../../presentational-components/shared/filter-toolbar-item';
import RemovePortfolioModal from '../../../smart-components/portfolio/remove-portfolio-modal';
import AddProductsToPortfolio from '../../../smart-components/portfolio/add-products-to-portfolio';
import { FETCH_PLATFORMS, FETCH_PORTFOLIO, FETCH_PORTFOLIO_ITEMS_WITH_PORTFOLIO } from '../../../redux/action-types';

describe('<Portfolio />', () => {

  let initialProps;
  let initialState;
  const middlewares = [ thunk, promiseMiddleware(), notificationsMiddleware() ];
  let mockStore;

  const ComponentWrapper = ({ store, initialEntries = [ '/foo' ], children }) => (
    <Provider store={ store }>
      <MemoryRouter initialEntries={ initialEntries }>
        { children }
      </MemoryRouter>
    </Provider>
  );

  beforeEach(() => {
    initialProps = {
      id: '123'
    };
    initialState = {
      platformReducer: {
        platformItems: []
      },
      portfolioReducer: {
        selectedPortfolio: {
          id: '123',
          name: 'Foo'
        },
        portfolioItems: { data: [], meta: {
          limit: 50,
          offset: 0
        }},
        portfolios: { data: [{
          id: '123',
          name: 'bar',
          description: 'description',
          modified: 'sometimes'
        }]}
      }
    };
    mockStore = configureStore(middlewares);
  });

  it('should render correctly', () => {
    const wrapper = shallow(<Portfolio { ...initialProps } />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('should mount and fetch correct data', async (done) => {
    const store = mockStore(initialState);
    const expectedActions = [{
      type: `${FETCH_PLATFORMS}_PENDING`
    }, {
      type: `${FETCH_PORTFOLIO}_PENDING`
    }, {
      type: `${FETCH_PORTFOLIO_ITEMS_WITH_PORTFOLIO}_PENDING`
    }, expect.objectContaining({
      type: `${FETCH_PLATFORMS}_FULFILLED`
    }), expect.objectContaining({
      type: `${FETCH_PORTFOLIO}_FULFILLED`
    }), expect.objectContaining({
      type: `${FETCH_PORTFOLIO_ITEMS_WITH_PORTFOLIO}_FULFILLED`
    }) ];

    apiClientMock.post(`${SOURCES_API_BASE}/graphql`, mockOnce({ body: {
      data: {
        application_types: [{
          sources: []
        }]
      }
    }}));
    apiClientMock.get(`${CATALOG_API_BASE}/portfolios/123`, mockOnce({ body: {}}));

    apiClientMock.get(`${CATALOG_API_BASE}/portfolios/123/portfolio_items?limit=50&offset=0`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${CATALOG_API_BASE}/portfolios/123/portfolio_items?limit=50&offset=0`, mockOnce({ body: { data: []}}));

    await act(async() => {
      mount(
        <ComponentWrapper store={ store } initialEntries={ [ '/portfolios/detail/123' ] }>
          <Route path="/portfolios/detail/:id" render={ (...args) => <Portfolio { ...initialProps } { ...args } /> } />
        </ComponentWrapper>
      );
    });
    setImmediate(() => {
      expect(store.getActions()).toEqual(expectedActions);
      done();
    });
  });

  it('should mount and render add products page', async (done) => {
    const store = mockStore({ ...initialState, platformReducer: { platforms: [], platformItems: {}}});
    apiClientMock.get(`${CATALOG_API_BASE}/portfolios/123/portfolio_items?limit=50&offset=0`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${CATALOG_API_BASE}/portfolios/123`, mockOnce({ body: { data: []}}));
    apiClientMock.post(`${SOURCES_API_BASE}/graphql`, mockOnce({ body: {
      data: { application_types: [{ sources: []}]}}}));
    apiClientMock.post(`${SOURCES_API_BASE}/graphql`, mockOnce({ body: {
      data: { application_types: [{ sources: []}]}}}));
    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={ store } initialEntries={ [ '/portfolios/detail/123/add-products' ] }>
          <Route path="/portfolios/detail/:id" render={ (...args) => <Portfolio { ...initialProps } { ...args } /> } />
        </ComponentWrapper>
      );
    });

    setImmediate(() => {
      expect(wrapper.find(AddProductsToPortfolio)).toHaveLength(1);
      done();
    });
  });

  it('should mount and render remove products page and call remove products', async (done) => {
    expect.assertions(2);
    const store = mockStore({
      ...initialState,
      platformReducer: { platforms: []},
      portfolioReducer: {
        ...initialState.portfolioReducer,
        selectedPortfolio: {
          id: '123',
          name: 'Foo'
        },
        portfolioItems: { data: [{
          id: '123',
          name: 'Foo',
          description: 'desc',
          modified: 'sometimes'
        }], meta: {
          limit: 50,
          offset: 0
        }}
      }
    });

    apiClientMock.get(`${CATALOG_API_BASE}/portfolios/123`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${CATALOG_API_BASE}/portfolios/123`, mockOnce({ body: { data: []}}));
    apiClientMock.delete(`${CATALOG_API_BASE}/portfolio_items/123`, mockOnce((req, res) => {
      expect(req).toBeTruthy();
      done();
      return res.status(200);
    }));
    apiClientMock.post(`${SOURCES_API_BASE}/graphql`, mockOnce({ body: {
      data: { application_types: [{ sources: []}]}}}));
    apiClientMock.get(`${CATALOG_API_BASE}/portfolios/123/portfolio_items?limit=50&offset=0`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${CATALOG_API_BASE}/portfolios/123/portfolio_items?limit=50&offset=0`, mockOnce({ body: { data: []}}));
    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={ store } initialEntries={ [ '/portfolios/detail/123/remove-products' ] }>
          <Route path="/portfolios/detail/:id" render={ (...args) => <Portfolio { ...initialProps } { ...args } /> } />
        </ComponentWrapper>
      );
    });

    setImmediate(async () => {
      wrapper.update();
      expect(wrapper.find(ToolbarRenderer)).toHaveLength(1);
      act(() => {
        wrapper.find(PortfolioItem).props().onSelect('123');
        wrapper.update();
      });
      wrapper.find('button#remove-products-dropdown-toggle').simulate('click');
      await act(async () => {
        wrapper.find('li').last().find('span').simulate('click');
      });
    });
  });

  it('should mount and render remove portfolio modal', (done) => {
    const store = mockStore({
      ...initialState,
      platformReducer: { platforms: []},
      portfolioReducer: {
        ...initialState.portfolioReducer,
        portfolioItems: { data: [{
          id: '123',
          name: 'Foo',
          description: 'desc',
          modified: 'sometimes'
        }],
        meta: {
          limit: 50,
          offset: 0
        }}
      }
    });
    apiClientMock.get(`${CATALOG_API_BASE}/portfolios/123/portfolio_items?limit=50&offset=0`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${CATALOG_API_BASE}/portfolios/123`, mockOnce({ body: { data: []}}));
    apiClientMock.post(`${SOURCES_API_BASE}/graphql`, mockOnce({ body: {
      data: { application_types: [{ sources: []}]}}}));

    const wrapper = mount(
      <ComponentWrapper store={ store } initialEntries={ [ '/portfolios/detail/123/remove-portfolio' ] }>
        <Route path="/portfolios/detail/:id" render={ (...args) => <Portfolio { ...initialProps } { ...args } /> } />
      </ComponentWrapper>
    );

    setImmediate(() => {
      expect(wrapper.find(RemovePortfolioModal)).toHaveLength(1);
      done();
    });
  });

  it('should mount and render order item modal', async (done) => {
    const store = mockStore({
      ...initialState,
      platformReducer: { platforms: []},
      orderReducer: {
        isLoading: false
      },
      portfolioReducer: {
        ...initialState.portfolioReducer,
        portfolioItems: { data: [{
          id: '123',
          name: 'Foo',
          description: 'desc',
          modified: 'sometimes'
        }],
        meta: {
          limit: 50,
          offset: 0
        }}
      }
    });
    apiClientMock.get(`${CATALOG_API_BASE}/portfolios/123/portfolio_items?limit=50&offset=0`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${CATALOG_API_BASE}/portfolios/123`, mockOnce({ body: { data: []}}));
    apiClientMock.post(`${SOURCES_API_BASE}/graphql`, mockOnce({ body: {
      data: {
        application_types: [{ sources: []}]
      }
    }}));
    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={ store } initialEntries={ [ '/portfolios/detail/123/order/321' ] }>
          <Route path="/portfolios/detail/:id" render={ (...args) => <Portfolio { ...initialProps } { ...args } /> } />
        </ComponentWrapper>
      );
    });

    setImmediate(() => {
      expect(wrapper.find(OrderModal)).toHaveLength(1);
      done();
    });
  });

  it('should mount and filter portfolio items', async (done) => {
    const store = mockStore({
      ...initialState,
      platformReducer: { platforms: []},
      portfolioReducer: {
        ...initialState.portfolioReducer,
        portfolioItems: { data: [{
          id: '123',
          name: 'Foo',
          description: 'desc',
          modified: 'sometimes'
        }],
        meta: {
          offset: 50,
          limit: 0
        }}
      }
    });
    apiClientMock.get(`${CATALOG_API_BASE}/portfolios/123/portfolio_items?limit=50&offset=0`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${CATALOG_API_BASE}/portfolios/123`, mockOnce({ body: { data: []}}));
    apiClientMock.post(`${SOURCES_API_BASE}/graphql`, mockOnce({ body: {
      data: { application_types: [{ sources: []}]}}}));

    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={ store } initialEntries={ [ '/portfolios/detail/123' ] }>
          <Route path="/portfolios/detail/:id" render={ (...args) => <Portfolio { ...initialProps } { ...args } /> } />
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
      platformReducer: { platforms: []},
      portfolioReducer: {
        ...initialState.portfolioReducer,
        selectedPortfolio: {
          id: '321',
          name: 'Foo'
        },
        portfolioItems: { data: [{
          id: '321',
          name: 'Foo',
          description: 'desc',
          modified: 'sometimes'
        }],
        meta: {
          limit: 50,
          offset: 0
        }}
      }
    });
    const restoreKey = 'restore-321';

    apiClientMock.get(`${CATALOG_API_BASE}/portfolios/321/portfolio_items?limit=50&offset=0`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${CATALOG_API_BASE}/portfolios/321`, mockOnce({ body: { data: []}}));
    apiClientMock.post(`${SOURCES_API_BASE}/graphql`, mockOnce({ body: {
      data: { application_types: [{ sources: []}]}}}));

    /**
     * remove portfolio items calls
     */
    apiClientMock.delete(`${CATALOG_API_BASE}/portfolio_items/321`, mockOnce((_req, res) => res.status(200).body({ restore_key: restoreKey })));
    apiClientMock.get(`${CATALOG_API_BASE}/portfolios/321/portfolio_items?limit=50&offset=0`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${CATALOG_API_BASE}/portfolios/321/portfolio_items?limit=50&offset=0`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${CATALOG_API_BASE}/portfolios/321`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${CATALOG_API_BASE}/portfolios/321/portfolio_items`, mockOnce({ body: { data: []}}));

    /**
     * undo endpoint
     */
    apiClientMock.post(`${CATALOG_API_BASE}/portfolio_items/321/undelete`, mockOnce((req, res) => {
      expect(JSON.parse(req.body())).toEqual({ restore_key: 'restore-321' });
      done();
      return res.status(200).body({ id: '321' });
    }));

    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={ store } initialEntries={ [ '/portfolios/detail/321' ] }>
          <Route path="/portfolios/detail/:id" render={ (...args) => <Portfolio { ...initialProps } id="321" { ...args } /> } />
        </ComponentWrapper>
      );
    });

    setImmediate(async () => {
      wrapper.update();
      const checkbox = wrapper.find(PortfolioItem).find('input');
      checkbox.simulate('change');
      /**
       * Trigger remove portfolio items action
       */
      const removeTrigger = wrapper.find('button#remove-products-dropdown-toggle');

      /**
       * open dropdown
       */
      removeTrigger.simulate('click');
      wrapper.update();

      /**
       * trigger remove actions
       */
      await act(async() => {
        wrapper.find('li').last().find('span').simulate('click');
      });
      setImmediate(() => {
        /**
         * trigger notification undo click
         */
        const notification = store.getActions()[9].payload.description;
        const notificationWrapper = mount(<IntlProvider locale="en"><React.Fragment>{ notification }</React.Fragment></IntlProvider>);
        notificationWrapper.find('a span').simulate('click');
      });
    });
  });
});
