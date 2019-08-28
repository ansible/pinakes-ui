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
import { CATALOG_API_BASE, SOURCES_API_BASE } from '../../../utilities/constants';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications/';
import { CANCEL_ORDER, FETCH_OPEN_ORDERS, FETCH_PLATFORMS } from '../../../redux/action-types';
import OrderItem from '../../../smart-components/order/order-item';

describe('<Orders />', () => {

  let initialProps;
  const middlewares = [ thunk, promiseMiddleware(), notificationsMiddleware() ];
  let mockStore;
  let initialState;

  const createDate = new Date(Date.UTC(2019, 5, 1, 0));

  const linkedOrders = {
    openOrders: {
      data: [{
        id: 'order-1',
        created_at: createDate,
        ordered_at: 'order_date',
        state: 'Ordered',
        requests: [],
        orderItems: [{
          portfolio_item_id: 'foo',
          id: 'order-item-1'
        }]
      }, {
        id: 'order-cancelable',
        created_at: createDate,
        ordered_at: 'order_date',
        state: 'Approval Pending',
        requests: [],
        orderItems: [{
          portfolio_item_id: 'foo',
          id: 'order-item-2'
        }]
      }]},
    closedOrders: {
      data: [{
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
      ]}};

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
    const store = mockStore({ ...initialState, orderReducer: { ...initialState.orderReducer, ...linkedOrders }});
    apiClientMock.get(`${CATALOG_API_BASE}/portfolio_items`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${CATALOG_API_BASE}/orders?filter%5Bstate%5D%5B%5D=Ordered&filter%5Bstate%5D%5B%5D=Approval%20Pending`, mockOnce({ body: {
      data: [{ id: '1' }, { id: '2' }]}}));
    apiClientMock.get(`${CATALOG_API_BASE}/order_items?filter%5Border_id%5D%5B%5D=1&filter%5Border_id%5D%5B%5D=2`, mockOnce({ body: { data: []}}));
    apiClientMock.post(`${SOURCES_API_BASE}/graphql`, mockOnce({ body: { data: {
      application_types: [{
        sources: []
      }]
    }}}));
    apiClientMock.get(`${CATALOG_API_BASE}/order_items/order-item-1/approval_requests`, mockOnce({ body: { data: []}}));
    const wrapper = mount(
      <ComponentWrapper store={ store } initialEntries={ [ '/orders' ] }>
        <Route path="/orders" render={ () => <Orders { ...initialProps } linkedOrders /> } />
      </ComponentWrapper>
    );

    setImmediate(() => {
      wrapper.update();
      expect(wrapper.find(DataList)).toHaveLength(1);
      expect(wrapper.find(OrderItem)).toHaveLength(2);
      done();
    });
  });

  it('should expand data list', (done) => {
    const store = mockStore({ ...initialState, orderReducer: { ...initialState.orderReducer, ...linkedOrders }});
    apiClientMock.get(`${CATALOG_API_BASE}/portfolio_items`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${CATALOG_API_BASE}/orders?filter%5Bstate%5D%5B%5D=Ordered&filter%5Bstate%5D%5B%5D=Approval%20Pending`, mockOnce({ body: {
      data: [{ id: '1' }, { id: '2' }]}}));
    apiClientMock.get(`${CATALOG_API_BASE}/order_items?filter%5Border_id%5D%5B%5D=1&filter%5Border_id%5D%5B%5D=2`, mockOnce({ body: { data: []}}));
    apiClientMock.post(`${SOURCES_API_BASE}/graphql`, mockOnce({ body: { data: {
      application_types: [{
        sources: []
      }]
    }}}));

    const wrapper = mount(
      <ComponentWrapper store={ store } initialEntries={ [ '/orders' ] }>
        <Route path="/orders" render={ () => <Orders { ...initialProps } linkedOrders /> } />
      </ComponentWrapper>
    );
    setImmediate(() => {
      wrapper.update();
      expect(wrapper.find(DataListContent).first().props().isHidden).toEqual(true);
      wrapper.find('.pf-c-data-list__toggle').first().simulate('click');
      setImmediate(() => {
        wrapper.update();
        expect(wrapper.find(DataListContent).first().props().isHidden).toEqual(false);
        expect(wrapper.find(OrderDetailTable)).toHaveLength(1);
        done();
      });
    });
  });

  it('should render past orders correctly', () => {
    initialState = { orderReducer: { ...orderInitialState, linkedOrders, isLoading: false },
      portfolioReducer: { ...portfoliosInitialState, isLoading: false }};
    const store = mockStore(initialState);
    const wrapper = shallow(
      <ComponentWrapper store={ store } initialEntries={ [ '/orders/closed' ] }>
        <Route path="/orders/closed" render={ () => <Orders { ...initialProps } /> } />
      </ComponentWrapper>
    ).dive();
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('should set the Manage Product link to open in a new tab', (done) => {
    const store = mockStore({ ...initialState, orderReducer: { ...initialState.orderReducer, ...linkedOrders }});
    apiClientMock.get(`${CATALOG_API_BASE}/orders?filter%5Bstate%5D%5B%5D=Completed&filter%5Bstate%5D%5B%5D=Failed&filter%5Bstate%5D%5B%5D=Denied&filter%5Bstate%5D%5B%5D=Canceled`, mockOnce({ body: { // eslint-disable-line max-len
      data: [{ id: '1' }, { id: '2' }]}}));
    apiClientMock.get(`${CATALOG_API_BASE}/order_items?filter%5Border_id%5D%5B%5D=1&filter%5Border_id%5D%5B%5D=2`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${CATALOG_API_BASE}/portfolio_items`, mockOnce({ body: { data: []}}));
    apiClientMock.post(`${SOURCES_API_BASE}/graphql`, mockOnce({ body: { data: {
      application_types: [{
        sources: []
      }]
    }}}));

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
    const store = mockStore({ ...initialState, orderReducer: { ...initialState.orderReducer, ...linkedOrders }});
    apiClientMock.get(`${CATALOG_API_BASE}/orders?filter%5Bstate%5D%5B%5D=Ordered&filter%5Bstate%5D%5B%5D=Approval%20Pending`, mockOnce({ body: {
      data: [{ id: '1' }, { id: '2' }]}}));
    apiClientMock.get(`${CATALOG_API_BASE}/order_items?filter%5Border_id%5D%5B%5D=1&filter%5Border_id%5D%5B%5D=2`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${CATALOG_API_BASE}/portfolio_items`, mockOnce({ body: { data: []}}));
    apiClientMock.patch(`${CATALOG_API_BASE}/orders/order-cancelable/cancel`, mockOnce({ body: { data: []}}));
    apiClientMock.post(`${SOURCES_API_BASE}/graphql`, mockOnce({ body: { data: {
      application_types: [{
        sources: []
      }]
    }}}));
    apiClientMock.get(`${CATALOG_API_BASE}/order_items/order-item-2/approval_requests`, mockOnce({ body: { data: []}}));

    const expectedActions = [
      { type: `${FETCH_OPEN_ORDERS}_PENDING` },
      { type: `${FETCH_PLATFORMS}_PENDING` },
      { type: `${FETCH_PLATFORMS}_FULFILLED`, payload: []},
      { type: `${FETCH_OPEN_ORDERS}_FULFILLED`, payload: {}},
      { type: `${CANCEL_ORDER}_PENDING` },
      { type: 'SET_ORDERS',
        payload: { openOrders: {
          data: [
            expect.objectContaining({ id: 'order-1' })
          ]}, closedOrders: {
          data: [
            expect.objectContaining({ id: 'order-cancelable' }),
            expect.objectContaining({ id: 'order-2' })
          ]}}},
      { type: '@@INSIGHTS-CORE/NOTIFICATIONS/ADD_NOTIFICATION',
        payload: { variant: 'success', title: 'Your order has been canceled successfully', description:
          'Order Order #order-cancelable was canceled and has been moved to closed orders.',
        dismissable: true }},
      { type: `${CANCEL_ORDER}_FULFILLED` }];

    const wrapper = mount(
      <ComponentWrapper store={ store } initialEntries={ [ '/orders' ] }>
        <Route path="/orders" render={ () => <Orders { ...initialProps } /> } />
      </ComponentWrapper>
    );
    setImmediate(() => {
      wrapper.update();
      expect(wrapper.find(DataListItem)).toHaveLength(2);
      wrapper.find('.pf-c-data-list__toggle').at(1).simulate('click');
      setImmediate(() => {
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
});
