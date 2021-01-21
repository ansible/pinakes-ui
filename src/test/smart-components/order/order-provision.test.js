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
import notificationsMiddleware from '@redhat-cloud-services/frontend-components-notifications/';
import { SET_PORTFOLIO_ITEMS, FETCH_ORDERS } from '../../../redux/action-types';
import OrderProvision from '../../../smart-components/order/order-detail/order-provision';
import {
  mockApi,
  mockGraphql
} from '../../../helpers/shared/__mocks__/user-login';
import { IntlProvider } from 'react-intl';
import { OrderItemStateEnum } from '@redhat-cloud-services/catalog-client';

describe('<Orders />', () => {
  let initialProps;
  const middlewares = [thunk, promiseMiddleware, notificationsMiddleware()];
  let mockStore;
  let initialState;

  const createDate = new Date(Date.UTC(2019, 5, 1, 0));

  const orderReducer = {
    orderProvision: {
      orderItems: [
        {
          updated_at: createDate.toString(),
          state: OrderItemStateEnum.Completed,
          service_parameters: {}
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
        `${CATALOG_API_BASE}/orders?&sort_by=id:descfilter[state][contains_i]=&limit=50&offset=0`
      )
      .replyOnce(200, { data: [] });
    mockApi
      .onGet(`${CATALOG_API_BASE}/portfolio_items?`)
      .replyOnce(200, { data: [] });
    mockApi
      .onGet(`${CATALOG_API_BASE}/order_items?limit=50`)
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
      .onGet(`${CATALOG_API_BASE}/orders?&sort_by=id:desc&limit=50&offset=100`)
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
          filter: '&sort_by=id:desc',
          filters: {
            owner: '',
            state: []
          },
          limit: 50,
          offset: 100,
          sortBy: 'id',
          sortDirection: 'desc',
          sortIndex: 0,
          stateKey: 'orders',
          storeState: true
        },
        payload: { data: [] }
      }
    ]);
  });

  it('should mount and render order provision component', async (done) => {
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
            <OrderProvision />
          </Route>
        </ComponentWrapper>
      );
    });
    await act(async () => {
      wrapper.update();
    });

    expect(wrapper.find(OrderProvision)).toHaveLength(1);
    done();
  });
});
