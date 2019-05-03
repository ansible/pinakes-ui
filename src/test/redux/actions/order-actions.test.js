import configureStore from 'redux-mock-store' ;
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import { notificationsMiddleware, ADD_NOTIFICATION } from '@red-hat-insights/insights-frontend-components/components/Notifications';
import { CATALOG_API_BASE, APPROVAL_API_BASE } from '../../../utilities/constants';
import {
  fetchServicePlans,
  fetchOrderList,
  updateServiceData,
  setSelectedPlan,
  sendSubmitOrder,
  getLinkedOrders
} from '../../../redux/actions/order-actions';
import {
  FETCH_SERVICE_PLANS,
  LIST_ORDERS,
  UPDATE_SERVICE_DATA,
  SET_SELECTED_PLAN,
  SUBMIT_SERVICE_ORDER,
  FETCH_LINKED_ORDERS
} from '../../../redux/action-types';

describe('Order actions', () => {
  const middlewares = [ thunk, promiseMiddleware(), notificationsMiddleware() ];
  let mockStore;

  beforeEach(() => {
    mockStore = configureStore(middlewares);
  });

  it('should dispatch correct actions after fetching service plans', () => {
    const store = mockStore({});
    apiClientMock.get(`${CATALOG_API_BASE}/portfolio_items/1/service_plans`, mockOnce({
      body: [ 'Foo' ]
    }));
    const expectedActions = [{
      type: `${FETCH_SERVICE_PLANS}_PENDING`
    }, expect.objectContaining({
      type: `${FETCH_SERVICE_PLANS}_FULFILLED`
    }) ];

    return store.dispatch(fetchServicePlans(1)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch correct actions after fetching service plans fails', () => {
    const store = mockStore({});
    apiClientMock.get(`${CATALOG_API_BASE}/portfolio_items/1/service_plans`, mockOnce({
      status: 500
    }));
    const expectedActions = [{
      type: `${FETCH_SERVICE_PLANS}_PENDING`
    }, expect.objectContaining({
      type: ADD_NOTIFICATION,
      payload: expect.objectContaining({
        variant: 'danger'
      })
    }), expect.objectContaining({
      type: `${FETCH_SERVICE_PLANS}_REJECTED`
    }) ];

    return store.dispatch(fetchServicePlans(1)).catch(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch correct actions after fetching orders', () => {
    const store = mockStore({});
    apiClientMock.get(`${CATALOG_API_BASE}/orders`, mockOnce({
      body: [ 'Foo' ]
    }));
    const expectedActions = [{
      type: `${LIST_ORDERS}_PENDING`
    }, expect.objectContaining({
      type: `${LIST_ORDERS}_FULFILLED`
    }) ];

    return store.dispatch(fetchOrderList()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch correct actions after fetching orders fails', () => {
    const store = mockStore({});
    apiClientMock.get(`${CATALOG_API_BASE}/orders`, mockOnce({
      status: 500
    }));
    const expectedActions = [{
      type: `${LIST_ORDERS}_PENDING`
    }, expect.objectContaining({
      type: ADD_NOTIFICATION,
      payload: expect.objectContaining({
        variant: 'danger'
      })
    }), expect.objectContaining({
      type: `${LIST_ORDERS}_REJECTED`
    }) ];

    return store.dispatch(fetchOrderList()).catch(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch correct actions after calling update service data', () => {
    const store = mockStore({});
    const expectedActions = [{
      type: UPDATE_SERVICE_DATA,
      payload: { serviceData: { foo: 'bar' }}
    }];

    store.dispatch(updateServiceData({ foo: 'bar' }));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should dispatch correct actions after calling set selected plan', () => {
    const store = mockStore({});
    const expectedActions = [{
      type: SET_SELECTED_PLAN,
      payload: { foo: 'bar' }
    }];

    store.dispatch(setSelectedPlan({ foo: 'bar' }));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should dispatch correct actions after submitting order', () => {
    const store = mockStore({});
    apiClientMock.post(`${CATALOG_API_BASE}/orders`, mockOnce({
      body: { id: '123' }
    }));
    apiClientMock.post(`${CATALOG_API_BASE}/orders/123/order_items`, mockOnce((req, res) => {
      expect(JSON.parse(req.body())).toEqual({
        count: 1,
        provider_control_parameters: { namespace: 'default' },
        portfolio_item_id: 'Foo',
        service_plan_ref: 'Bar',
        service_parameters: { bax: 'quxx' }
      });
      return res.status(200);
    }));
    apiClientMock.post(`${CATALOG_API_BASE}/orders/123/submit_order`, mockOnce({
      body: { id: '123' }
    }));
    const expectedActions = [{
      type: `${SUBMIT_SERVICE_ORDER}_PENDING`
    }, expect.objectContaining({
      type: ADD_NOTIFICATION,
      payload: expect.objectContaining({
        variant: 'success',
        dismissable: true,
        title: 'Your order has been accepted successfully'
      })
    }),
    expect.objectContaining({
      type: `${SUBMIT_SERVICE_ORDER}_FULFILLED`
    }) ];

    return store.dispatch(sendSubmitOrder({
      portfolio_item_id: 'Foo',
      service_plan_ref: 'Bar',
      service_parameters: { bax: 'quxx', providerControlParameters: { namespace: 'default' }}
    })).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch correct actions after submitting order fails to get new order', () => {
    const store = mockStore({});
    apiClientMock.post(`${CATALOG_API_BASE}/orders`, mockOnce({
      status: 500
    }));
    const expectedActions = [{
      type: `${SUBMIT_SERVICE_ORDER}_PENDING`
    }, expect.objectContaining({
      type: ADD_NOTIFICATION,
      payload: expect.objectContaining({
        variant: 'danger'
      })
    }), expect.objectContaining({
      type: `${SUBMIT_SERVICE_ORDER}_REJECTED`
    }) ];

    return store.dispatch(sendSubmitOrder({
      portfolio_item_id: 'Foo',
      service_plan_ref: 'Bar',
      service_parameters: 'Quxx'
    })).catch(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch correct actions after submitting order fails to add to new order', () => {
    const store = mockStore({});
    apiClientMock.post(`${CATALOG_API_BASE}/orders`, mockOnce({
      body: { id: 123 }
    }));

    apiClientMock.post(`${CATALOG_API_BASE}/orders/123/items`, mockOnce({
      status: 500
    }));

    const expectedActions = [{
      type: `${SUBMIT_SERVICE_ORDER}_PENDING`
    }, expect.objectContaining({
      type: ADD_NOTIFICATION,
      payload: expect.objectContaining({
        variant: 'danger'
      })
    }), expect.objectContaining({
      type: `${SUBMIT_SERVICE_ORDER}_REJECTED`
    }) ];

    return store.dispatch(sendSubmitOrder({})).catch(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch correct actions after submitting order fails to submit order', () => {
    const store = mockStore({});
    apiClientMock.post(`${CATALOG_API_BASE}/orders`, mockOnce({
      body: { id: 123 }
    }));

    apiClientMock.post(`${CATALOG_API_BASE}/orders/123/items`, mockOnce({
      status: 200
    }));
    apiClientMock.post(`${CATALOG_API_BASE}/orders/123`, mockOnce({
      status: 500
    }));

    const expectedActions = [{
      type: `${SUBMIT_SERVICE_ORDER}_PENDING`
    }, expect.objectContaining({
      type: ADD_NOTIFICATION,
      payload: expect.objectContaining({
        variant: 'danger'
      })
    }), expect.objectContaining({
      type: `${SUBMIT_SERVICE_ORDER}_REJECTED`
    }) ];

    return store.dispatch(sendSubmitOrder({})).catch(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch correct actions after calling getLinkedOrders and create correct data structure', () => {
    const store = mockStore({});
    apiClientMock.get(`${CATALOG_API_BASE}/orders`, mockOnce({
      body: { data: [{
        id: '1',
        name: 'super-order'
      }, {
        id: '2',
        name: 'sad-lonely-order'
      }, {
        id: '3',
        name: 'completed-order',
        state: 'Completed'
      }, {
        id: '4',
        name: 'failed-order',
        state: 'Failed'
      }]}
    }));
    apiClientMock.get(`${APPROVAL_API_BASE}/requests`, mockOnce({
      body: { data: [{
        content: {
          order_id: '1'
        },
        name: 'super-order-request'
      }]}
    }));
    apiClientMock.get(`${CATALOG_API_BASE}/order_items`, mockOnce({ body: { data: [{
      order_id: '1',
      name: 'super-order-item'
    }]}}));

    const expectedActions = [{
      type: `${FETCH_LINKED_ORDERS}_PENDING`
    }, {
      type: `${FETCH_LINKED_ORDERS}_FULFILLED`,
      payload: {
        current: [{
          id: '2',
          name: 'sad-lonely-order',
          orderItems: [],
          requests: []
        }, {
          id: '1',
          name: 'super-order',
          orderItems: [{
            order_id: '1',
            name: 'super-order-item'
          }],
          requests: [{
            content: {
              order_id: '1'
            },
            name: 'super-order-request'
          }]
        }],
        past: [{
          id: '4',
          name: 'failed-order',
          state: 'Failed',
          orderItems: [],
          requests: []
        }, {
          id: '3',
          name: 'completed-order',
          state: 'Completed',
          orderItems: [],
          requests: []
        }]
      }}];

    return store.dispatch(getLinkedOrders()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
