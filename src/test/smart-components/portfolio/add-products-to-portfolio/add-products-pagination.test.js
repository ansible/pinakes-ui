import React from 'react';
import thunk from 'redux-thunk';
import { mount, shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import configureStore from 'redux-mock-store' ;
import promiseMiddleware from 'redux-promise-middleware';
import { notificationsMiddleware } from '@red-hat-insights/insights-frontend-components/components/Notifications';

import { TOPOLOGICAL_INVENTORY_API_BASE } from '../../../../utilities/constants';
import AddProductsPagination from '../../../../smart-components/portfolio/add-products-to-portfolio/add-products-pagination';

describe('<AddProductsPagination />', () => {
  let initialProps;
  const middlewares = [ thunk, promiseMiddleware(), notificationsMiddleware() ];
  let mockStore;
  beforeEach(() => {
    initialProps = {
      platformId: '999',
      meta: {
        count: 123,
        limit: 50,
        offset: 0
      }
    };
    mockStore = configureStore(middlewares);
  });

  afterEach(() => {
    fetchMock.reset();
  });

  it('should render correctly', () => {
    const store = mockStore({});
    const wrapper = shallow(<AddProductsPagination { ...initialProps } store={ store } />).dive();
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('should correctly request next page', done => {
    const store = mockStore({});
    const fetchPlatformItems = jest.fn();
    const wrapper = mount(<AddProductsPagination { ...initialProps } store={ store } fetchPlatformItems={ fetchPlatformItems } />);
    const lastPageButton = wrapper.find('button').at(3);
    const expectedUrl = `${TOPOLOGICAL_INVENTORY_API_BASE}/sources/999/service_offerings?archived_at=&limit=50&offset=50`;
    fetchMock.getOnce(`begin:${TOPOLOGICAL_INVENTORY_API_BASE}/sources/999/service_offerings?`, {
      data: [],
      meta: {
        count: 123,
        limit: 50,
        offset: 123
      }
    });

    lastPageButton.simulate('click');
    setImmediate(() => {

      expect(fetchMock.lastUrl()).toMatch(expectedUrl);
      done();
    });
  });

  it('should correctly request last page', done => {
    const store = mockStore({});
    const fetchPlatformItems = jest.fn();
    const wrapper = mount(<AddProductsPagination { ...initialProps } store={ store } fetchPlatformItems={ fetchPlatformItems } />);
    const lastPageButton = wrapper.find('button').last();
    const expectedUrl = `${TOPOLOGICAL_INVENTORY_API_BASE}/sources/999/service_offerings?archived_at=&limit=50&offset=100`;
    fetchMock.getOnce(`begin:${TOPOLOGICAL_INVENTORY_API_BASE}/sources/999/service_offerings?`, {
      data: [],
      meta: {
        count: 123,
        limit: 50,
        offset: 123
      }
    });

    lastPageButton.simulate('click');
    setImmediate(() => {
      expect(fetchMock.lastUrl()).toMatch(expectedUrl);
      done();
    });
  });
});
