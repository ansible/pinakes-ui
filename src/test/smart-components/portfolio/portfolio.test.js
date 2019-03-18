import React from 'react';
import thunk from 'redux-thunk';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store' ;
import { shallowToJson } from 'enzyme-to-json';
import { MemoryRouter, Route } from 'react-router-dom';
import promiseMiddleware from 'redux-promise-middleware';
import { notificationsMiddleware } from '@red-hat-insights/insights-frontend-components/components/Notifications';

import OrderModal from '../../../SmartComponents/Common/OrderModal';
import Portfolio from '../../../SmartComponents/Portfolio/Portfolio';
import PortfolioItem from '../../../SmartComponents/Portfolio/PortfolioItem';
import FilterToolbarItem from '../../../PresentationalComponents/Shared/FilterToolbarItem';
import RemovePortfolioItems from '../../../SmartComponents/Portfolio/RemovePortfolioItems';
import RemovePortfolioModal from '../../../SmartComponents/Portfolio/remove-portfolio-modal';
import { CATALOG_API_BASE, TOPOLOGICAL_INVENTORY_API_BASE } from '../../../Utilities/Constants';
import AddProductsToPortfolio from '../../../SmartComponents/Portfolio/add-products-to-portfolio';
import { FETCH_PORTFOLIO, FETCH_PORTFOLIO_ITEMS_WITH_PORTFOLIO } from '../../../redux/ActionTypes';

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
      portfolioReducer: {
        portfolios: [{
          id: 123,
          name: 'bar',
          description: 'description',
          modified: 'sometimes'
        }]
      }
    };
    mockStore = configureStore(middlewares);
  });

  afterEach(() => {
    fetchMock.reset();
  });

  it('should render correctly', () => {
    const wrapper = shallow(<Portfolio { ...initialProps } />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('should mount and fetch correct data', (done) => {
    const store = mockStore(initialState);
    const expectedActions = [{
      type: `${FETCH_PORTFOLIO}_PENDING`
    }, {
      type: `${FETCH_PORTFOLIO_ITEMS_WITH_PORTFOLIO}_PENDING`
    }, expect.objectContaining({
      type: `${FETCH_PORTFOLIO}_FULFILLED`
    }), expect.objectContaining({
      type: `${FETCH_PORTFOLIO_ITEMS_WITH_PORTFOLIO}_FULFILLED`
    }) ];
    apiClientMock.get(`${CATALOG_API_BASE}/portfolios/123`, mockOnce({
      body: {}
    }));

    fetchMock.getOnce(`${CATALOG_API_BASE}/portfolios/123/portfolio_items`, { data: []});

    mount(
      <ComponentWrapper store={ store } initialEntries={ [ '/portfolios/detail/123' ] }>
        <Route path="/portfolios/detail/:id" render={ (...args) => <Portfolio { ...initialProps } { ...args } /> } />
      </ComponentWrapper>
    );
    setImmediate(() => {
      expect(store.getActions()).toEqual(expectedActions);
      done();
    });
  });

  it('should mount and render add products page', (done) => {
    const store = mockStore({ ...initialState, platformReducer: { platforms: []}});
    fetchMock.getOnce(`${CATALOG_API_BASE}/portfolios/123/portfolio_items`, { data: []});
    apiClientMock.get(`${CATALOG_API_BASE}/portfolios/123`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${TOPOLOGICAL_INVENTORY_API_BASE}/sources`, mockOnce({ body: { data: []}}));

    const wrapper = mount(
      <ComponentWrapper store={ store } initialEntries={ [ '/portfolios/detail/123/add-products' ] }>
        <Route path="/portfolios/detail/:id" render={ (...args) => <Portfolio { ...initialProps } { ...args } /> } />
      </ComponentWrapper>
    );

    setImmediate(() => {
      expect(wrapper.find(AddProductsToPortfolio)).toHaveLength(1);
      done();
    });
  });

  it('should mount and render remove products page and call remove products', (done) => {
    const store = mockStore({
      ...initialState,
      platformReducer: { platforms: []},
      portfolioReducer: {
        ...initialState.portfolioReducer,
        portfolioItems: [{
          id: 123,
          name: 'Foo',
          description: 'desc',
          modified: 'sometimes'
        }]
      }
    });

    apiClientMock.get(`${CATALOG_API_BASE}/portfolios/123`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${CATALOG_API_BASE}/portfolios/123`, mockOnce({ body: { data: []}}));
    apiClientMock.delete(`${CATALOG_API_BASE}/portfolio_items/123`, mockOnce((req, res) => {
      expect(req).toBeTruthy();
      return res.status(200);
    }));
    apiClientMock.get(`${TOPOLOGICAL_INVENTORY_API_BASE}/sources`, mockOnce({ body: { data: []}}));
    fetchMock.get(`${CATALOG_API_BASE}/portfolios/123/portfolio_items`, { data: []});

    const wrapper = mount(
      <ComponentWrapper store={ store } initialEntries={ [ '/portfolios/detail/123/remove-products' ] }>
        <Route path="/portfolios/detail/:id" render={ (...args) => <Portfolio { ...initialProps } { ...args } /> } />
      </ComponentWrapper>
    );

    setImmediate(() => {
      expect(wrapper.find(RemovePortfolioItems)).toHaveLength(1);
      wrapper.find(PortfolioItem).props().onSelect('123');
      wrapper.update();
      wrapper.find('button').last().simulate('click');
      setImmediate(() => done());
    });
  });

  it.skip('should mount and render remove portfolio modal', (done) => {
    const store = mockStore({
      ...initialState,
      platformReducer: { platforms: []},
      portfolioReducer: {
        ...initialState.portfolioReducer,
        portfolioItems: [{
          id: '123',
          name: 'Foo',
          description: 'desc',
          modified: 'sometimes'
        }]
      }
    });
    fetchMock.getOnce(`${CATALOG_API_BASE}/portfolios/123/portfolio_items`, { data: []});
    apiClientMock.get(`${CATALOG_API_BASE}/portfolios/123`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${TOPOLOGICAL_INVENTORY_API_BASE}/sources`, mockOnce({ body: { data: []}}));

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

  it('should mount and render order item modal', (done) => {
    const store = mockStore({
      ...initialState,
      platformReducer: { platforms: []},
      orderReducer: {
        isLoading: false
      },
      portfolioReducer: {
        ...initialState.portfolioReducer,
        portfolioItems: [{
          id: 123,
          name: 'Foo',
          description: 'desc',
          modified: 'sometimes'
        }]
      }
    });
    fetchMock.getOnce(`${CATALOG_API_BASE}/portfolios/123/portfolio_items`, { data: []});
    apiClientMock.get(`${CATALOG_API_BASE}/portfolios/123`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${TOPOLOGICAL_INVENTORY_API_BASE}/sources`, mockOnce({ body: { data: []}}));

    const wrapper = mount(
      <ComponentWrapper store={ store } initialEntries={ [ '/portfolios/detail/123/order/321' ] }>
        <Route path="/portfolios/detail/:id" render={ (...args) => <Portfolio { ...initialProps } { ...args } /> } />
      </ComponentWrapper>
    );

    setImmediate(() => {
      expect(wrapper.find(OrderModal)).toHaveLength(1);
      done();
    });
  });

  it('should mount and filter portfolio items', (done) => {
    const store = mockStore({
      ...initialState,
      platformReducer: { platforms: []},
      portfolioReducer: {
        ...initialState.portfolioReducer,
        portfolioItems: [{
          id: 123,
          name: 'Foo',
          description: 'desc',
          modified: 'sometimes'
        }]
      }
    });
    fetchMock.getOnce(`${CATALOG_API_BASE}/portfolios/123/portfolio_items`, { data: []});
    apiClientMock.get(`${CATALOG_API_BASE}/portfolios/123`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${TOPOLOGICAL_INVENTORY_API_BASE}/sources`, mockOnce({ body: { data: []}}));

    const wrapper = mount(
      <ComponentWrapper store={ store } initialEntries={ [ '/portfolios/detail/123' ] }>
        <Route path="/portfolios/detail/:id" render={ (...args) => <Portfolio { ...initialProps } { ...args } /> } />
      </ComponentWrapper>
    );

    setImmediate(() => {
      expect(wrapper.find(PortfolioItem)).toHaveLength(1);
      const filterInput = wrapper.find(FilterToolbarItem).first();
      filterInput.props().onFilterChange('nothing');
      wrapper.update();
      expect(wrapper.find(PortfolioItem)).toHaveLength(0);
      done();
    });
  });

});
