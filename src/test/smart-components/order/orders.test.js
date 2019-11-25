import React from 'react';
import { act } from 'react-dom/test-utils';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import configureStore from 'redux-mock-store' ;
import { shallowToJson } from 'enzyme-to-json';
import { MemoryRouter, Route } from 'react-router-dom';
import promiseMiddleware from 'redux-promise-middleware';

import Orders from '../../../smart-components/order/orders';
import { orderInitialState } from '../../../redux/reducers/order-reducer';
import { portfoliosInitialState } from '../../../redux/reducers/portfolio-reducer';
import { CATALOG_API_BASE, SOURCES_API_BASE } from '../../../utilities/constants';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications/';
import { SET_PORTFOLIO_ITEMS, FETCH_ORDERS } from '../../../redux/action-types';
import OrdersList from '../../../smart-components/order/orders-list';
import OrderDetail from '../../../smart-components/order/order-detail/order-detail';
import CancelOrderModal from '../../../smart-components/order/cancel-order-modal';

describe('<Orders />', () => {

  let initialProps;
  const middlewares = [ thunk, promiseMiddleware(), notificationsMiddleware() ];
  let mockStore;
  let initialState;

  const createDate = new Date(Date.UTC(2019, 5, 1, 0));

  const orderReducer = {
    orderDetail: {
      approvalRequest: {
        data: [{
          id: 'request-id',
          state: 'Foo',
          reason: 'Why not'
        }]
      },
      portfolioItem: {
        name: 'Portfolio item name',
        id: 'portfolio-item-id',
        updated_at: createDate.toString()
      },
      order: {
        id: '123',
        state: 'Completed',
        created_at: createDate.toString(),
        owner: 'hula hup'
      },
      platform: {
        source_type_id: '3',
        name: 'Super platform'
      },
      portfolio: {
        name: 'Portfolio name'
      },
      orderItem: {
        service_parameters: {}
      },
      progressMessages: {
        data: []
      }
    }
  };

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

  it('should mount and render orders list component', async done => {
    const store = mockStore({ ...initialState, orderReducer: { ...orderInitialState, ...orderReducer }});

    apiClientMock.get(`${CATALOG_API_BASE}/orders?filter%5Bstate%5D%5Bcontains_i%5D=&limit=50&offset=0`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${CATALOG_API_BASE}/portfolio_items`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${CATALOG_API_BASE}/order_items`, mockOnce({ body: { data: []}}));
    apiClientMock.post(`${SOURCES_API_BASE}/graphql`, mockOnce({ body: { data: []}}));
    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={ store } initialEntries={ [ '/orders' ] }>
          <Route path="/orders">
            <Orders />
          </Route>
        </ComponentWrapper>);
    });

    wrapper.update();
    expect(wrapper.find(OrdersList)).toHaveLength(1);
    done();
  });

  it('should mount and render orders list component and paginate correctly', async done => {
    const orderItemsPagination = { ...orderReducer };
    orderItemsPagination.orders = {
      meta: {
        limit: 50,
        offset: 0,
        count: 120
      },
      data: [ ...Array(10) ].map((item, index) => ({
        id: `order-${index}`,
        orderItems: [{
          id: `order-item-${index}`
        }]
      }))
    };
    const store = mockStore({ ...initialState, orderReducer: { ...orderInitialState, ...orderItemsPagination }});

    apiClientMock.get(`${CATALOG_API_BASE}/orders?filter%5Bstate%5D%5Bcontains_i%5D=&limit=50&offset=0`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${CATALOG_API_BASE}/portfolio_items`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${CATALOG_API_BASE}/order_items`, mockOnce({ body: { data: []}}));
    apiClientMock.post(`${SOURCES_API_BASE}/graphql`, mockOnce({
      body: { data: {
        application_types: [{
          sources: [{
            id: '1',
            name: 'Source 1'
          }]
        }]
      }}}));
    /**
     * Pagination requests
     */
    apiClientMock.get(`${CATALOG_API_BASE}/orders?filter%5Bstate%5D%5Bcontains_i%5D=&limit=50&offset=100`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${CATALOG_API_BASE}/portfolio_items`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${CATALOG_API_BASE}/order_items`, mockOnce({ body: { data: []}}));
    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={ store } initialEntries={ [ '/orders' ] }>
          <Route path="/orders">
            <Orders />
          </Route>
        </ComponentWrapper>);
    });
    wrapper.update();

    store.clearActions();
    await act(async () => {
      wrapper.find('button[data-action="last"]').first().simulate('click');
    });
    wrapper.update();
    expect(store.getActions()).toEqual([
      { type: `${FETCH_ORDERS}_PENDING` },
      { type: SET_PORTFOLIO_ITEMS, payload: { data: []}},
      { type: `${FETCH_ORDERS}_FULFILLED`, payload: { data: []}}

    ]);
    done();
  });

  it('should mount and render order detail component', async done => {
    const store = mockStore({ ...initialState, orderReducer: { ...orderInitialState, ...orderReducer }});

    apiClientMock.get(`${CATALOG_API_BASE}/orders/123`, mockOnce({ body: { data: [{
      id: 123
    }]}}));
    apiClientMock.get(`${CATALOG_API_BASE}/portfolio_items/portfolio-item-id`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${CATALOG_API_BASE}/portfolios/portfolio-id`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${CATALOG_API_BASE}/order_items/order-item-id`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${CATALOG_API_BASE}/order_items/order-item-id/progress_messages`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${CATALOG_API_BASE}/order_items/order-item-id/approval_requests`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${SOURCES_API_BASE}/sources/platform-id`, mockOnce({ body: { data: []}}));
    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper
          store={ store }
          initialEntries={ [ '/orders/123?order-item=order-item-id&portfolio-item=portfolio-item-id&platform=platform-id&portfolio=portfolio-id' ] }
        >
          <Route path="/orders/:id">
            <Orders />
          </Route>
        </ComponentWrapper>);
    });
    wrapper.update();

    expect(wrapper.find(OrderDetail)).toHaveLength(1);
    done();
  });

  it('should mount and render order approval detail component', async done => {
    const store = mockStore({ ...initialState, orderReducer: { ...orderInitialState, ...orderReducer }});

    apiClientMock.get(`${CATALOG_API_BASE}/orders/123`, mockOnce({ body: { data: [{
      id: 123
    }]}}));
    apiClientMock.get(`${CATALOG_API_BASE}/portfolio_items/portfolio-item-id`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${CATALOG_API_BASE}/portfolios/portfolio-id`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${CATALOG_API_BASE}/order_items/order-item-id`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${CATALOG_API_BASE}/order_items/order-item-id/progress_messages`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${CATALOG_API_BASE}/order_items/order-item-id/approval_requests`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${SOURCES_API_BASE}/sources/platform-id`, mockOnce({ body: { data: []}}));
    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper
          store={ store }
          initialEntries={ [ '/orders/123/approval?order-item=order-item-id&portfolio-item=portfolio-item-id&platform=platform-id&portfolio=portfolio-id' ] } // eslint-disable-line max-len
        >
          <Route path="/orders/:id/approval">
            <Orders />
          </Route>
        </ComponentWrapper>);
    });
    wrapper.update();

    expect(wrapper.find(OrderDetail)).toHaveLength(1);
    done();
  });

  it('should mount and render order detail component and open/close cancel order modal', async done => {
    const enabledCancel = { ...orderReducer };
    enabledCancel.orderDetail.order.state = 'Approval Pending';
    const store = mockStore({ ...initialState, orderReducer: { ...orderInitialState, ...enabledCancel }});

    apiClientMock.get(`${CATALOG_API_BASE}/orders/123`, mockOnce({ body: { data: [{
      id: 123
    }]}}));
    apiClientMock.get(`${CATALOG_API_BASE}/portfolio_items/portfolio-item-id`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${CATALOG_API_BASE}/portfolios/portfolio-id`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${CATALOG_API_BASE}/order_items/order-item-id`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${CATALOG_API_BASE}/order_items/order-item-id/progress_messages`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${CATALOG_API_BASE}/order_items/order-item-id/approval_requests`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${SOURCES_API_BASE}/sources/platform-id`, mockOnce({ body: { data: []}}));
    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper
          store={ store }
          initialEntries={ [ '/orders/123?order-item=order-item-id&portfolio-item=portfolio-item-id&platform=platform-id&portfolio=portfolio-id' ] }
        >
          <Route path="/orders/:id">
            <Orders />
          </Route>
        </ComponentWrapper>);
    });
    wrapper.update();
    expect(wrapper.find(CancelOrderModal).props().isOpen).toEqual(false);
    wrapper.find('button#cancel-order-action').simulate('click');
    wrapper.update();
    expect(wrapper.find(CancelOrderModal).props().isOpen).toEqual(true);
    wrapper.find('button#keep-order').simulate('click');
    wrapper.update();
    expect(wrapper.find(CancelOrderModal).props().isOpen).toEqual(false);
    done();
  });
});
