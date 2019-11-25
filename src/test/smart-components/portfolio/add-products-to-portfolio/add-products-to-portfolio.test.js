import React from 'react';
import { act } from 'react-dom/test-utils';
import thunk from 'redux-thunk';
import { rawComponents } from '@data-driven-forms/pf4-component-mapper';
import { Provider } from 'react-redux';
import { mount, shallow } from 'enzyme';;
import { MemoryRouter } from 'react-router-dom';
import { shallowToJson } from 'enzyme-to-json';
import configureStore from 'redux-mock-store' ;
import promiseMiddleware from 'redux-promise-middleware';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications/';

import { TOPOLOGICAL_INVENTORY_API_BASE, CATALOG_API_BASE, SOURCES_API_BASE } from '../../../../utilities/constants';
import PlatformItem from '../../../../presentational-components/platform/platform-item';
import AddProductsToPortfolio from '../../../../smart-components/portfolio/add-products-to-portfolio';

describe('<AddProductsToPortfolio />', () => {
  let initialProps;
  const middlewares = [ thunk, promiseMiddleware, notificationsMiddleware() ];
  let mockStore;
  mockStore = configureStore(middlewares);
  let ComponentWrapper = ({ store, children }) => (
    <Provider store={ store }>
      <MemoryRouter>
        { children }
      </MemoryRouter>
    </Provider>
  );

  beforeEach(() => {
    initialProps = {
      portfolioRoute: '/portfolio/foo',
      portfolio: {
        name: 'Foo'
      }
    };
  });

  it('should render correctly', () => {
    const store = mockStore({});
    const wrapper = shallow(<MemoryRouter><AddProductsToPortfolio store={ store } { ...initialProps } /></MemoryRouter>).dive();
    expect(shallowToJson(wrapper.find(AddProductsToPortfolio))).toMatchSnapshot();
  });

  it('should correctly filter service offerings', async done => {
    const store = mockStore({
      platformReducer: {
        platforms: [{ id: '1', name: 'foo' }],
        platformItems: { 1: { data: [{ id: '123', name: 'platformItem', description: 'description' }]}}
      }
    });
    apiClientMock.post(`${SOURCES_API_BASE}/graphql`, mockOnce({ body: {
      data: { application_types: [{ sources: [{ id: '1', name: 'foo' }]}]}}}));
    apiClientMock
    .get(`${TOPOLOGICAL_INVENTORY_API_BASE}/sources/1/service_offerings?filter%5Barchived_at%5D%5Bnil%5D%20=&limit=50&offset=0`,
      mockOnce({ body: { data: [], meta: { count: 123, limit: 50, offset: 123 }}}));

    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={ store }>
          <AddProductsToPortfolio { ...initialProps } />
        </ComponentWrapper>
      );
    });

    setImmediate(() => {
      const select = wrapper.find(rawComponents.Select);
      act(() => {
        select.props().onChange({ id: '1' });
      });
      wrapper.update();
      expect(wrapper.find(PlatformItem)).toHaveLength(1);
      const searchInput = wrapper.find('input').at(1);
      searchInput.getDOMNode().value = 'foo';
      searchInput.simulate('change');
      wrapper.update();
      expect(wrapper.find(PlatformItem)).toHaveLength(0);
      done();
    });
  });

  it('should check item and send correct data on submit', async done => {
    const store = mockStore({
      platformReducer: {
        platforms: [{ id: '1', name: 'foo' }],
        platformItems: { 1: { data: [{ id: '123', name: 'platformItem', description: 'description' }]}}
      }
    });
    apiClientMock.post(`${SOURCES_API_BASE}/graphql`, mockOnce({ body: {
      data: { application_types: [{ sources: [{ id: '1', name: 'foo' }]}]}}}));
    apiClientMock
    .get(`${TOPOLOGICAL_INVENTORY_API_BASE}/sources/1/service_offerings?filter%5Barchived_at%5D%5Bnil%5D%20=&limit=50&offset=0`,
      mockOnce({ body: { data: [], meta: {}}
      }));
    apiClientMock.post(`${CATALOG_API_BASE}/portfolio_items`, mockOnce({ body: { id: '999' }}));
    apiClientMock.post(`${CATALOG_API_BASE}/portfolios/321/portfolio_items`, mockOnce((req, res) => {
      expect(JSON.parse(req.body())).toEqual({ portfolio_item_id: '999' });
      return res.status(200);
    }));
    apiClientMock.get(`${CATALOG_API_BASE}/portfolios/321/portfolio_items`, mockOnce({ body: { data: []}}));

    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={ store }>
          <AddProductsToPortfolio { ...initialProps } portfolio={ { id: '321', name: 'Foo' } } />
        </ComponentWrapper>
      );
    });

    setImmediate(async () => {
      const select = wrapper.find(rawComponents.Select);
      act(() => {
        select.props().onChange({
          id: '1'
        });
      });
      wrapper.update();
      wrapper.find('input').last().simulate('change');
      await act(async () => {
        wrapper.find('button').last().simulate('click');
      });
      setImmediate(() => {
        // wait for redirect and portfolio items refresh
        expect(wrapper.find(MemoryRouter).childAt(0).props().history.location.pathname).toEqual('/portfolio/foo');
        done();
      });
    });
  });
});
