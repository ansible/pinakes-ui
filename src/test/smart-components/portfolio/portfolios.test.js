import React from 'react';
import thunk from 'redux-thunk';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store' ;
import { shallowToJson } from 'enzyme-to-json';
import { MemoryRouter, Route } from 'react-router-dom';
import promiseMiddleware from 'redux-promise-middleware';
import { notificationsMiddleware } from '@red-hat-insights/insights-frontend-components/components/Notifications';

import { CATALOG_API_BASE } from '../../../Utilities/Constants';
import { FETCH_PORTFOLIOS } from '../../../redux/action-types';
import Portfolios from '../../../SmartComponents/Portfolio/Portfolios';
import PortfolioCard from '../../../presentational-components/portfolio/porfolio-card';
import { CardLoader } from '../../../presentational-components/shared/loader-placeholders';
import FilterToolbarItem from '../../../presentational-components/shared/filter-toolbar-item';

describe('<Portfolios />', () => {
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
          id: '123',
          name: 'bar',
          description: 'description',
          modified: 'sometimes'
        }]
      }
    };
    mockStore = configureStore(middlewares);
  });

  it('should render correctly', () => {
    const store = mockStore(initialState);
    const wrapper = shallow(<Portfolios { ...initialProps } store={ store }/>);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('should mount and fetch data', (done) => {
    const store = mockStore(initialState);

    apiClientMock.get(`${CATALOG_API_BASE}/portfolios`, mockOnce({ body: { data: [{ name: 'Foo', id: '11' }]}}));
    const expectedActions = [{
      type: `${FETCH_PORTFOLIOS}_PENDING`
    }, expect.objectContaining({
      type: `${FETCH_PORTFOLIOS}_FULFILLED`
    }) ];
    mount(
      <ComponentWrapper store={ store }>
        <Portfolios { ...initialProps } />
      </ComponentWrapper>
    );

    setImmediate(() => {
      expect(store.getActions()).toEqual(expectedActions);
      done();
    });
  });

  it('should mount filter portfolios', (done) => {
    const store = mockStore(initialState);

    apiClientMock.get(`${CATALOG_API_BASE}/portfolios`, mockOnce({ body: { data: [{ name: 'Foo', id: '11' }]}}));

    const wrapper = mount(
      <ComponentWrapper store={ store } initialEntries={ [ '/portfolios' ] }>
        <Route path="/portfolios" render={ (...args) => <Portfolios { ...initialProps } { ...args } /> } />
      </ComponentWrapper>
    );

    setImmediate(() => {
      expect(wrapper.find(PortfolioCard)).toHaveLength(1);
      const filterInput = wrapper.find(FilterToolbarItem).first();
      filterInput.props().onFilterChange('nothing');
      wrapper.update();
      expect(wrapper.find(PortfolioCard)).toHaveLength(0);
      done();
    });
  });

  it('should render in loading state', (done) => {
    const store = mockStore({
      ...initialState,
      portfolioReducer: {
        ...initialState.portfolioReducer,
        isLoading: true,
        portfolios: []
      }
    });

    apiClientMock.get(`${CATALOG_API_BASE}/portfolios`, mockOnce({ body: { data: [{ name: 'Foo', id: '11' }]}}));

    const wrapper = mount(
      <ComponentWrapper store={ store } initialEntries={ [ '/portfolios' ] }>
        <Route path="/portfolios" render={ (...args) => <Portfolios { ...initialProps } { ...args } /> } />
      </ComponentWrapper>
    );

    setImmediate(() => {
      expect(wrapper.find(CardLoader)).toHaveLength(1);
      done();
    });
  });
});
