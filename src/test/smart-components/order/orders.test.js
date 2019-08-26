import React from 'react';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import configureStore from 'redux-mock-store' ;
import { shallowToJson } from 'enzyme-to-json';
import { MemoryRouter, Route } from 'react-router-dom';
import promiseMiddleware from 'redux-promise-middleware';
import { DataList, DataListContent, Modal, DataListItem } from '@patternfly/react-core';

import Orders from '../../../smart-components/order/orders';
import { orderInitialState } from '../../../redux/reducers/order-reducer';
import OrderDetailTable from '../../../smart-components/order/order-detail-table';
import { portfoliosInitialState } from '../../../redux/reducers/portfolio-reducer';
import { CATALOG_API_BASE, APPROVAL_API_BASE } from '../../../utilities/constants';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications/';
import { FETCH_LINKED_ORDERS, FETCH_PORTFOLIO_ITEMS, CANCEL_ORDER } from '../../../redux/action-types';

describe('<Orders />', () => {

  let initialProps;
  const middlewares = [ thunk, promiseMiddleware(), notificationsMiddleware() ];
  let mockStore;
  let initialState;

  const createDate = new Date(Date.UTC(2019, 5, 1, 0));

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
    }, {
      id: 'order-cancelable',
      created_at: createDate,
      ordered_at: 'order_date',
      state: 'Approval Pending',
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

  const ComponentWrapper = ({ store, children, ...props }) => (
    <Provider store={ store }>
      <MemoryRouter { ...props }>
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

    const wrapper = mount(
      <ComponentWrapper store={ store } initialEntries={ [ '/orders' ] }>
        <Route path="/orders" render={ () => <Orders { ...initialProps } linkedOrders /> } />
      </ComponentWrapper>
    );

    setImmediate(() => {
      expect(wrapper.find(DataList)).toHaveLength(1);
      done();
    });
  });

  it('should expand data list', (done) => {
    const store = mockStore({ ...initialState, orderReducer: { ...initialState.orderReducer, linkedOrders }});
    apiClientMock.get(`${CATALOG_API_BASE}/orders`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${APPROVAL_API_BASE}/requests`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${CATALOG_API_BASE}/portfolio_items`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${CATALOG_API_BASE}/order_items`, mockOnce({ body: { data: []}}));

    const wrapper = mount(
      <ComponentWrapper store={ store } initialEntries={ [ '/orders' ] }>
        <Route path="/orders" render={ () => <Orders { ...initialProps } linkedOrders /> } />
      </ComponentWrapper>
    );
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
    const wrapper = shallow(
      <ComponentWrapper store={ store } initialEntries={ [ '/orders/closed' ] }>
        <Route path="/orders/closed" render={ () => <Orders { ...initialProps } linkedOrders /> } />
      </ComponentWrapper>
    ).dive();
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('should set the Manage Product link to open in a new tab', (done) => {
    const store = mockStore({ ...initialState, orderReducer: { ...initialState.orderReducer, linkedOrders }});
    apiClientMock.get(`${CATALOG_API_BASE}/orders`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${APPROVAL_API_BASE}/requests`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${CATALOG_API_BASE}/portfolio_items`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${CATALOG_API_BASE}/order_items`, mockOnce({ body: { data: []}}));

    const wrapper = mount(
      <ComponentWrapper store={ store } initialEntries={ [ '/orders/closed' ] }>
        <Route path="/orders/closed" render={ () => <Orders { ...initialProps } linkedOrders /> } />
      </ComponentWrapper>
    );
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

  it('should cancel order', (done) => {
    const store = mockStore({ ...initialState, orderReducer: { ...initialState.orderReducer, linkedOrders }});
    apiClientMock.get(`${CATALOG_API_BASE}/orders`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${APPROVAL_API_BASE}/requests`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${CATALOG_API_BASE}/portfolio_items`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${CATALOG_API_BASE}/order_items`, mockOnce({ body: { data: []}}));
    apiClientMock.patch(`${CATALOG_API_BASE}/orders/order-cancelable/cancel`, mockOnce({ body: { data: []}}));

    const expectedActions = [
      { type: `${FETCH_LINKED_ORDERS}_PENDING` },
      { type: `${FETCH_PORTFOLIO_ITEMS}_PENDING` },
      { type: `${FETCH_PORTFOLIO_ITEMS}_FULFILLED`, payload: { data: []}},
      { type: `${FETCH_LINKED_ORDERS}_FULFILLED`, payload: { current: [], past: []}},
      { type: `${CANCEL_ORDER}_PENDING` },
      { type: 'SET_ORDERS',
        payload: { current: [
          expect.objectContaining({ id: 'order-1' })
        ], past: [
          expect.objectContaining({ id: 'order-cancelable' }),
          expect.objectContaining({ id: 'order-2' })
        ]}},
      { type: '@@INSIGHTS-CORE/NOTIFICATIONS/ADD_NOTIFICATION',
        payload: { variant: 'success', title: 'Your order has been canceled successfully', description:
          'Order Order #order-cancelable was canceled and has been moved to closed orders.',
        dismissable: true }},
      { type: `${CANCEL_ORDER}_FULFILLED` }];

    const wrapper = mount(
      <ComponentWrapper store={ store } initialEntries={ [ '/orders' ] }>
        <Route path="/orders" render={ () => <Orders { ...initialProps } linkedOrders /> } />
      </ComponentWrapper>
    );
    setImmediate(() => {
      wrapper.update();
      expect(wrapper.find(DataListItem)).toHaveLength(2);
      wrapper.find('.pf-c-data-list__toggle').at(1).simulate('click');
      wrapper.update();
      wrapper.find('button#cancel-order-order-cancelable').simulate('click');
      wrapper.update();
      expect(wrapper.find(Modal)).toHaveLength(1);
      wrapper.find('button#cancel-order').simulate('click');
      setImmediate(() => {
        wrapper.update();
        expect(store.getActions()).toEqual(expectedActions);
        done();
      });
    });
  });
});
