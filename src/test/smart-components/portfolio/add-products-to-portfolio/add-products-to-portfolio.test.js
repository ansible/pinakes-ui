import React from 'react';
import thunk from 'redux-thunk';
import Select from 'react-select';
import { Provider } from 'react-redux';
import { mount, shallow } from 'enzyme';;
import { MemoryRouter } from 'react-router-dom';
import { shallowToJson } from 'enzyme-to-json';
import configureStore from 'redux-mock-store' ;
import promiseMiddleware from 'redux-promise-middleware';
import { notificationsMiddleware } from '@red-hat-insights/insights-frontend-components/components/Notifications';

import { TOPOLOGICAL_INVENTORY_API_BASE, CATALOG_API_BASE } from '../../../../Utilities/Constants';
import PlatformItem from '../../../../presentational-components/platform/platform-item';
import AddProductsToPortfolio from '../../../../SmartComponents/Portfolio/add-products-to-portfolio';

describe('<AddProductsToPortfolio />', () => {
  let initialProps;
  const middlewares = [ thunk, promiseMiddleware(), notificationsMiddleware() ];
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
      portfolioRoute: '/portfolio/foo'
    };
  });

  afterEach(() => {
    fetchMock.reset();
  });

  it('should render correctly', () => {
    const store = mockStore({});
    const wrapper = shallow(<MemoryRouter><AddProductsToPortfolio store={ store } { ...initialProps } /></MemoryRouter>).dive();
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('should correctly filter service offerings', done => {
    const store = mockStore({
      platformReducer: {
        platforms: [{ id: '1', name: 'foo' }],
        platformItems: {
          1: {
            data: [{
              id: '123', name: 'platformItem', description: 'description'
            }]
          }
        }
      }
    });
    apiClientMock.get(`${TOPOLOGICAL_INVENTORY_API_BASE}/sources`, mockOnce({ body: { data: [{ id: '1', name: 'foo' }]}}));

    const wrapper = mount(
      <ComponentWrapper store={ store }>
        <AddProductsToPortfolio { ...initialProps } />
      </ComponentWrapper>
    );
    fetchMock.getOnce(`${TOPOLOGICAL_INVENTORY_API_BASE}/sources/1/service_offerings?archived_at=&limit=50&offset=0`, {
      data: [{
        id: '123', name: 'platformItem', description: 'description'
      }],
      meta: {
        count: 123,
        limit: 50,
        offset: 123
      }
    });

    setImmediate(() => {
      const select = wrapper.find(Select);
      select.props().onChange({
        id: '1'
      });
      wrapper.update();
      expect(wrapper.find(PlatformItem)).toHaveLength(1);
      const searchInput = wrapper.find('input').first();
      searchInput.getDOMNode().value = 'foo';
      searchInput.simulate('change');
      wrapper.update();
      expect(wrapper.find(PlatformItem)).toHaveLength(0);
      done();
    });
  });

  it('should check item and send correct data on submit', done => {
    const store = mockStore({
      platformReducer: {
        platforms: [{ id: '1', name: 'foo' }],
        platformItems: {
          1: {
            data: [{
              id: '123', name: 'platformItem', description: 'description'
            }]
          }
        }
      }
    });
    apiClientMock.get(`${TOPOLOGICAL_INVENTORY_API_BASE}/sources`, mockOnce({ body: { data: [{ id: '1', name: 'foo' }]}}));

    const wrapper = mount(
      <ComponentWrapper store={ store }>
        <AddProductsToPortfolio { ...initialProps } portfolio={ { id: '321' } } />
      </ComponentWrapper>
    );
    fetchMock.getOnce(`${TOPOLOGICAL_INVENTORY_API_BASE}/sources/1/service_offerings?archived_at=&limit=50&offset=0`, {
      data: [{
        id: '123', name: 'platformItem', description: 'description'
      }],
      meta: {
        count: 123,
        limit: 50,
        offset: 123
      }
    });
    apiClientMock.post(`${CATALOG_API_BASE}/portfolio_items`, mockOnce({ body: { id: '999' }}));
    apiClientMock.post(`${CATALOG_API_BASE}/portfolios/321/portfolio_items`, mockOnce((req, res) => {
      expect(JSON.parse(req.body())).toEqual({ portfolio_item_id: '999' });
      done();
      return res.status(200);
    }));
    apiClientMock.get(`${CATALOG_API_BASE}/portfolios/321/portfolio_items`, mockOnce({ body: { id: '999' }}));

    setImmediate(() => {
      const select = wrapper.find(Select);
      select.props().onChange({
        id: '1'
      });
      wrapper.update();
      wrapper.find('input').last().simulate('change');
      wrapper.find('button').at(2).simulate('click');
    });
  });
});
