import React from 'react';
import { act } from 'react-dom/test-utils';
import thunk from 'redux-thunk';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store' ;
import { shallowToJson } from 'enzyme-to-json';
import { MemoryRouter, Route } from 'react-router-dom';
import promiseMiddleware from 'redux-promise-middleware';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications/';

import { CATALOG_API_BASE } from '../../../utilities/constants';
import { FETCH_PORTFOLIOS } from '../../../redux/action-types';
import Portfolios from '../../../smart-components/portfolio/portfolios';
import PortfolioCard from '../../../presentational-components/portfolio/porfolio-card';
import { CardLoader } from '../../../presentational-components/shared/loader-placeholders';

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
        portfolios: { data: [{
          id: '123',
          name: 'bar',
          description: 'description',
          modified: 'sometimes',
          created_at: 'foo',
          owner: 'Owner'
        }],
        meta: {
          limit: 50,
          offset: 0
        }}
      }
    };
    mockStore = configureStore(middlewares);
  });

  it('should render correctly', () => {
    const store = mockStore(initialState);
    const wrapper = shallow(
      <ComponentWrapper store={ store } initialEntries={ [ '/portfolios' ] }>
        <Portfolios { ...initialProps } store={ store }/>
      </ComponentWrapper>).find(Portfolios);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('should mount and fetch data', (done) => {
    const store = mockStore(initialState);

    apiClientMock.get(`${CATALOG_API_BASE}/portfolios?filter%5Bname%5D%5Bcontains_i%5D=&limit=50&offset=0`,
      mockOnce({ body: { data: [{ name: 'Foo', id: '11' }]}}));
    const expectedActions = [{
      type: `${FETCH_PORTFOLIOS}_PENDING`
    }, expect.objectContaining({
      type: `${FETCH_PORTFOLIOS}_FULFILLED`
    }) ];
    mount(
      <ComponentWrapper store={ store } initialEntries={ [ '/portfolios' ] }>
        <Route path="/portfolios" render={ args => <Portfolios { ...initialProps } { ...args } /> } />
      </ComponentWrapper>
    );

    setImmediate(() => {
      expect(store.getActions()).toEqual(expectedActions);
      done();
    });
  });

  it('should mount and filter portfolios', async done => {
    expect.assertions(2);
    const store = mockStore(initialState);
    apiClientMock.get(`${CATALOG_API_BASE}/portfolios?filter%5Bname%5D%5Bcontains_i%5D=&limit=50&offset=0`,
      mockOnce({ body: { data: [{ name: 'Foo', id: '11' }]}}));

    apiClientMock.get(`${CATALOG_API_BASE}/portfolios?filter%5Bname%5D%5Bcontains_i%5D=nothing&limit=50&offset=0`,
      (req, res) => {
        expect(req).toBeTruthy();
        done();
        return res.status(200);
      });

    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={ store } initialEntries={ [ '/portfolios' ] }>
          <Route path="/portfolios" render={ args => <Portfolios { ...initialProps } { ...args } /> } />
        </ComponentWrapper>
      );

    });

    wrapper.update();
    expect(wrapper.find(PortfolioCard)).toHaveLength(1);
    const filterInput = wrapper.find('input').first();

    await act(async() => {
      filterInput.getDOMNode().value = 'nothing';
    });

    filterInput.simulate('change', { target: { value: 'nothing' }});
  });

  it.skip('should render in loading state', async (done) => {
    const store = mockStore({
      ...initialState,
      portfolioReducer: {
        ...initialState.portfolioReducer,
        isLoading: true,
        portfolios: { data: [], meta: { limit: 50, offset: 0 }}
      }
    });
    apiClientMock.get(`${CATALOG_API_BASE}/portfolios?filter%5Bname%5D%5Bcontains_i%5D=&limit=50&offset=0`,
      mockOnce({ body: { data: [{ name: 'Foo', id: '11' }]}}));
    apiClientMock.get(`${CATALOG_API_BASE}/portfolios?filter%5Bname%5D%5Bcontains_i%5D=&limit=50&offset=0`,
      mockOnce({ body: { data: [{ name: 'Foo', id: '11' }]}}));
    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={ store } initialEntries={ [ '/portfolios' ] }>
          <Route exact path="/portfolios" render={ props => <Portfolios { ...initialProps } { ...props } /> } />
        </ComponentWrapper>
      );
    });

    setImmediate(() => {
      expect(wrapper.find(CardLoader)).toHaveLength(1);
      done();
    });
  });
});
