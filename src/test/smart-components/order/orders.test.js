import React from 'react';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import configureStore from 'redux-mock-store' ;
import { shallowToJson } from 'enzyme-to-json';
import { MemoryRouter } from 'react-router-dom';
import promiseMiddleware from 'redux-promise-middleware';
import { DataList, DataListContent } from '@patternfly/react-core';

import Orders from '../../../smart-components/order/orders';
import { orderInitialState } from '../../../redux/reducers/order-reducer';
import OrderDetailTable from '../../../smart-components/order/order-detail-table';
import { portfoliosInitialState } from '../../../redux/reducers/portfolio-reducer';
import { CATALOG_API_BASE, APPROVAL_API_BASE } from '../../../utilities/constants';
import { notificationsMiddleware } from '@red-hat-insights/insights-frontend-components/components/Notifications';

describe('<Orders />', () => {

  let initialProps;
  const middlewares = [ thunk, promiseMiddleware(), notificationsMiddleware() ];
  let mockStore;
  let initialState;

  const createDate = new Date('2019-05-16T12:54:18.827');

  const linkedOrders = {
    current: [{
      id: 'order-1',
      created_at: createDate,
      ordered_at: 'order_date',
      state: 'ordered',
      requests: [],
      orderItems: [{
        portfolio_item_id: 'foo'
      }]
    }],
    past: [{
      id: 'order-2',
      created_at: createDate,
      ordered_at: 'order_date',
      state: 'Completed',
      requests: [],
      orderItems: [{
        portfolio_item_id: '123',
        order_id: 'order-2',
        state: 'Completed',
        external_url: 'https://example.com/fake-done'
      }]
    }
    ]};

  const ComponentWrapper = ({ store, children }) => (
    <Provider store={ store }>
      <MemoryRouter>
        { children }
      </MemoryRouter>
    </Provider>
  );

  beforeEach(() => {
    initialProps = {};
    mockStore = configureStore(middlewares);
    initialState = { orderReducer: { ...orderInitialState, isLoading: false },
      portfolioReducer: { ...portfoliosInitialState, isLoading: false }};
  });

  it('should render correctly', () => {
    const store = mockStore(initialState);
    const wrapper = shallow(<Orders store={ store } { ...initialProps } />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('should render correctly in loading state', () => {
    const store = mockStore(initialState);
    const wrapper = shallow(<Orders store={ store } { ...initialProps } isLoading />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('should fetch orders data on component mount', (done) => {
    const store = mockStore({ ...initialState, orderReducer: { ...initialState.orderReducer, linkedOrders }});
    apiClientMock.get(`${CATALOG_API_BASE}/orders`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${APPROVAL_API_BASE}/requests`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${CATALOG_API_BASE}/portfolio_items`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${CATALOG_API_BASE}/order_items`, mockOnce({ body: { data: []}}));

    const wrapper = mount(<ComponentWrapper store={ store }><Orders { ...initialProps } /></ComponentWrapper>);
    setImmediate(() => {
      expect(wrapper.find(DataList)).toHaveLength(2);
      done();
    });
  });

  it('should expand data list', (done) => {
    const store = mockStore({ ...initialState, orderReducer: { ...initialState.orderReducer, linkedOrders }});
    apiClientMock.get(`${CATALOG_API_BASE}/orders`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${APPROVAL_API_BASE}/requests`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${CATALOG_API_BASE}/portfolio_items`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${CATALOG_API_BASE}/order_items`, mockOnce({ body: { data: []}}));

    const wrapper = mount(<ComponentWrapper store={ store }><Orders { ...initialProps } /></ComponentWrapper>);
    setImmediate(() => {
      wrapper.update();
      expect(wrapper.find(DataListContent).first().props().isHidden).toEqual(true);
      wrapper.find('.pf-c-data-list__toggle').first().simulate('click');
      expect(wrapper.find(DataListContent).first().props().isHidden).toEqual(false);
      expect(wrapper.find(OrderDetailTable)).toHaveLength(1);
      done();
    });
  });

  it('should render past orders correctly', () => {
    initialState = { orderReducer: { ...orderInitialState, linkedOrders, isLoading: false },
      portfolioReducer: { ...portfoliosInitialState, isLoading: false }};
    const store = mockStore(initialState);
    const wrapper = shallow(<Orders store={ store } { ...initialProps } linkedOrders />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('should set the Manage Product link to open in a new tab', (done) => {
    const store = mockStore({ ...initialState, orderReducer: { ...initialState.orderReducer, linkedOrders }});
    apiClientMock.get(`${CATALOG_API_BASE}/orders`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${APPROVAL_API_BASE}/requests`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${CATALOG_API_BASE}/portfolio_items`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${CATALOG_API_BASE}/order_items`, mockOnce({ body: { data: []}}));

    const wrapper = mount(<ComponentWrapper store={ store }><Orders { ...initialProps } linkedOrders /></ComponentWrapper>);
    setImmediate(() => {
      wrapper.update();
      expect(wrapper.find(DataListContent).first().props().isHidden).toEqual(true);
      expect(wrapper.find('a').props()).toMatchObject(
        { children: 'Manage product',
          href: 'https://example.com/fake-done',
          rel: 'noopener noreferrer',
          target: '_blank' });
      done();
    });
  });
});
