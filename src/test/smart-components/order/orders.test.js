import React from 'react';
import { act } from 'react-dom/test-utils';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { shallowToJson } from 'enzyme-to-json';
import { MemoryRouter, Route } from 'react-router-dom';
import promiseMiddleware from 'redux-promise-middleware';

import Orders from '../../../smart-components/order/orders';
import { orderInitialState } from '../../../redux/reducers/order-reducer';
import { portfoliosInitialState } from '../../../redux/reducers/portfolio-reducer';
import {
  CATALOG_API_BASE,
  SOURCES_API_BASE
} from '../../../utilities/constants';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications/';
import { SET_PORTFOLIO_ITEMS, FETCH_ORDERS } from '../../../redux/action-types';
import OrdersList from '../../../smart-components/order/orders-list';
import OrderDetail from '../../../smart-components/order/order-detail/order-detail';
import CancelOrderModal from '../../../smart-components/order/cancel-order-modal';
import { Alert } from '@patternfly/react-core';
import {
  mockApi,
  mockGraphql
} from '../../../helpers/shared/__mocks__/user-login';
import { IntlProvider } from 'react-intl';

describe('<Orders />', () => {
  let initialProps;
  const middlewares = [thunk, promiseMiddleware, notificationsMiddleware()];
  let mockStore;
  let initialState;

  const createDate = new Date(Date.UTC(2019, 5, 1, 0));

  const orderReducer = {
    orderDetail: {
      approvalRequest: {
        data: [
          {
            id: 'request-id',
            state: 'undecided',
            reason: 'Why not'
          }
        ]
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
        id: '123',
        source_type_id: '3',
        name: 'Super platform'
      },
      portfolio: {
        name: 'Portfolio name'
      },
      orderItem: {
        updated_at: createDate.toString(),
        service_parameters: {}
      },
      progressMessages: {
        data: []
      }
    }
  };

  const ComponentWrapper = ({ store, children, ...props }) => (
    <IntlProvider locale="en">
      <Provider store={store}>
        <MemoryRouter {...props}>{children}</MemoryRouter>
      </Provider>
    </IntlProvider>
  );

  beforeEach(() => {
    initialProps = {};
    mockStore = configureStore(middlewares);
    initialState = {
      i18nReducer: {
        formatMessage: ({ defaultMessage }) => defaultMessage
      },
      breadcrumbsReducer: { fragments: [] },
      orderReducer: { ...orderInitialState, isLoading: false },
      portfolioReducer: { ...portfoliosInitialState, isLoading: false },
      platformReducer: { platformIconMapping: {} }
    };
  });

  it('should render correctly', () => {
    const store = mockStore(initialState);
    const wrapper = shallow(<Orders store={store} {...initialProps} />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('should render correctly in loading state', () => {
    const store = mockStore(initialState);
    const wrapper = shallow(
      <Orders store={store} {...initialProps} isLoading />
    );
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('should mount and render orders list component', async (done) => {
    const store = mockStore({
      ...initialState,
      orderReducer: { ...orderInitialState, ...orderReducer }
    });

    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={store} initialEntries={['/orders']}>
          <Route path="/orders">
            <Orders />
          </Route>
        </ComponentWrapper>
      );
    });

    wrapper.update();
    expect(wrapper.find(OrdersList)).toHaveLength(1);
    done();
  });

  it('should mount and render orders list component and paginate correctly', async () => {
    jest.useFakeTimers();
    const orderItemsPagination = { ...orderReducer };
    orderItemsPagination.orders = {
      meta: {
        limit: 50,
        offset: 0,
        count: 120
      },
      data: [...Array(10)].map((item, index) => ({
        id: `order-${index}`,
        state: 'undecided',
        orderItems: [
          {
            id: `order-item-${index}`
          }
        ]
      }))
    };
    const store = mockStore({
      ...initialState,
      orderReducer: { ...orderInitialState, ...orderItemsPagination }
    });

    mockApi
      .onGet(
        `${CATALOG_API_BASE}/orders?filter[state][contains_i]=&limit=50&offset=0`
      )
      .replyOnce(200, { data: [] });
    mockApi
      .onGet(`${CATALOG_API_BASE}/portfolio_items?`)
      .replyOnce(200, { data: [] });
    mockApi
      .onGet(`${CATALOG_API_BASE}/order_items?`)
      .replyOnce(200, { data: [] });
    mockGraphql.onPost(`${SOURCES_API_BASE}/graphql`).replyOnce(200, {
      data: {
        application_types: [
          {
            sources: [
              {
                id: '1',
                name: 'Source 1'
              }
            ]
          }
        ]
      }
    });
    /**
     * Pagination requests
     */
    mockApi
      .onGet(`${CATALOG_API_BASE}/orders?&limit=50&offset=100`)
      .replyOnce(200, { data: [] });
    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={store} initialEntries={['/orders']}>
          <Route path="/orders">
            <Orders />
          </Route>
        </ComponentWrapper>
      );
    });
    await act(async () => {
      wrapper.update();
    });

    store.clearActions();
    await act(async () => {
      wrapper
        .find('button[data-action="last"]')
        .first()
        .simulate('click');
    });
    /**
     * wait for the debounce to run
     */
    await act(async () => {
      jest.runAllTimers();
      wrapper.update();
    });
    expect(store.getActions()).toEqual([
      { type: `${FETCH_ORDERS}_PENDING` },
      { type: SET_PORTFOLIO_ITEMS, payload: { data: [] } },
      {
        type: `${FETCH_ORDERS}_FULFILLED`,
        meta: {
          filter: '',
          filters: {
            owner: '',
            state: []
          },
          limit: 50,
          offset: 100,
          stateKey: 'orders',
          storeState: true
        },
        payload: { data: [] }
      }
    ]);
  });

  it('should mount and render order detail component', async (done) => {
    const store = mockStore({
      ...initialState,
      orderReducer: { ...orderInitialState, ...orderReducer }
    });

    mockApi
      .onGet(`${CATALOG_API_BASE}/orders/123`)
      .replyOnce(200, { data: [{ id: 123 }] });
    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper
          store={store}
          initialEntries={[
            '/order?order=123&order-item=order-item-id&portfolio-item=portfolio-item-id&platform=platform-id&portfolio=portfolio-id'
          ]}
        >
          <Route path="/order">
            <OrderDetail />
          </Route>
        </ComponentWrapper>
      );
    });
    await act(async () => {
      wrapper.update();
    });

    expect(wrapper.find(OrderDetail)).toHaveLength(1);
    done();
  });

  it('should mount and render order approval detail component', async (done) => {
    const store = mockStore({
      ...initialState,
      orderReducer: { ...orderInitialState, ...orderReducer }
    });

    mockApi
      .onGet(`${CATALOG_API_BASE}/orders/123`)
      .replyOnce(200, { data: [{ id: 123 }] });
    mockApi
      .onGet(`${CATALOG_API_BASE}/portfolio_items/portfolio-item-id`)
      .replyOnce(200, {});
    mockApi
      .onGet(`${CATALOG_API_BASE}/portfolios/portfolio-id`)
      .replyOnce(200, {});
    mockApi
      .onGet(`${CATALOG_API_BASE}/order_items/order-item-id`)
      .replyOnce(200, {});
    mockApi
      .onGet(`${CATALOG_API_BASE}/order_items/order-item-id/progress_messages`)
      .replyOnce(200, {});
    mockApi
      .onGet(`${CATALOG_API_BASE}/order_items/order-item-id/approval_requests`)
      .replyOnce(200, {});
    mockApi.onGet(`${SOURCES_API_BASE}/sources/platform-id`).replyOnce(200, {});
    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper
          store={store}
          initialEntries={[
            '/order/approval?order=123&order-item=order-item-id&portfolio-item=portfolio-item-id&platform=platform-id&portfolio=portfolio-id'
          ]} // eslint-disable-line max-len
        >
          <Route path="/order/approval">
            <OrderDetail />
          </Route>
        </ComponentWrapper>
      );
    });
    wrapper.update();

    expect(wrapper.find(OrderDetail)).toHaveLength(1);
    done();
  });

  it('should mount and render order detail component and open/close cancel order modal', async (done) => {
    const enabledCancel = { ...orderReducer };
    enabledCancel.orderDetail.order.state = 'Approval Pending';
    const store = mockStore({
      ...initialState,
      orderReducer: { ...orderInitialState, ...enabledCancel }
    });

    mockApi
      .onGet(`${CATALOG_API_BASE}/orders/123`)
      .replyOnce(200, { data: [{ id: 123 }] });
    mockApi
      .onGet(`${CATALOG_API_BASE}/portfolio_items/portfolio-item-id`)
      .replyOnce(200, {});
    mockApi
      .onGet(`${CATALOG_API_BASE}/portfolios/portfolio-id`)
      .replyOnce(200, {});
    mockApi
      .onGet(`${CATALOG_API_BASE}/order_items/order-item-id`)
      .replyOnce(200, {});
    mockApi
      .onGet(`${CATALOG_API_BASE}/order_items/order-item-id/progress_messages`)
      .replyOnce(200, {});
    mockApi
      .onGet(`${CATALOG_API_BASE}/order_items/order-item-id/approval_requests`)
      .replyOnce(200, {});
    mockApi.onGet(`${SOURCES_API_BASE}/sources/platform-id`).replyOnce(200, {});
    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper
          store={store}
          initialEntries={[
            '/order?order=123&order-item=order-item-id&portfolio-item=portfolio-item-id&platform=platform-id&portfolio=portfolio-id'
          ]}
        >
          <Route path="/order">
            <OrderDetail />
          </Route>
        </ComponentWrapper>
      );
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

  it('should mount and render order detail component with warnings about unavaiable resources', async (done) => {
    const store = mockStore({
      ...initialState,
      orderReducer: {
        ...orderReducer,
        orderDetail: {
          ...orderReducer.orderDetail,
          platform: { notFound: true, object: 'Platform' },
          portfolioItem: { notFound: true, object: 'Product' }
        }
      }
    });

    mockApi
      .onGet(`${CATALOG_API_BASE}/orders/order-fail`)
      .replyOnce(200, { data: [{ id: 'order-fail' }] });
    mockApi
      .onGet(`${CATALOG_API_BASE}/portfolio_items/portfolio-item-id-failed`)
      .replyOnce(404, {});
    mockApi
      .onGet(`${CATALOG_API_BASE}/portfolios/portfolio-id-failed`)
      .replyOnce(200, {});
    mockApi
      .onGet(`${CATALOG_API_BASE}/order_items/order-item-id-failed`)
      .replyOnce(200, {});
    mockApi
      .onGet(
        `${CATALOG_API_BASE}/order_items/order-item-id/progress_messages-failed`
      )
      .replyOnce(200, {});
    mockApi
      .onGet(
        `${CATALOG_API_BASE}/order_items/order-item-id/approval_requests-failed`
      )
      .replyOnce(200, {});
    mockApi.onGet(`${SOURCES_API_BASE}/sources/platform-id`).replyOnce(404, {});

    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper
          store={store}
          initialEntries={[
            '/order?order=123&order-item=order-item-id&portfolio-item=portfolio-item-id&platform=platform-id&portfolio=portfolio-id'
          ]}
        >
          <Route path="/order">
            <OrderDetail />
          </Route>
        </ComponentWrapper>
      );
    });
    wrapper.update();

    expect(wrapper.find(Alert)).toHaveLength(1);
    done();
  });
});
