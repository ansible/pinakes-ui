import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import {
  notificationsMiddleware,
  ADD_NOTIFICATION
} from '@redhat-cloud-services/frontend-components-notifications/';
import { CATALOG_API_BASE } from '../../../utilities/constants';
import {
  fetchServicePlans,
  updateServiceData,
  setSelectedPlan,
  sendSubmitOrder
} from '../../../redux/actions/order-actions';
import {
  FETCH_SERVICE_PLANS,
  UPDATE_SERVICE_DATA,
  SET_SELECTED_PLAN,
  SUBMIT_SERVICE_ORDER
} from '../../../redux/action-types';
import { mockApi } from '../../../helpers/shared/__mocks__/user-login';

describe('Order actions', () => {
  const middlewares = [thunk, promiseMiddleware, notificationsMiddleware()];
  let mockStore;

  beforeEach(() => {
    mockStore = configureStore(middlewares);
  });

  it('should dispatch correct actions after fetching service plans', () => {
    const store = mockStore({});
    mockApi
      .onGet(`${CATALOG_API_BASE}/portfolio_items/1/service_plans`)
      .replyOnce(200, ['Foo']);
    const expectedActions = [
      {
        type: `${FETCH_SERVICE_PLANS}_PENDING`
      },
      expect.objectContaining({
        type: `${FETCH_SERVICE_PLANS}_FULFILLED`
      })
    ];

    return store.dispatch(fetchServicePlans(1)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch correct actions after fetching service plans fails', () => {
    const store = mockStore({});
    mockApi.onGet(`${CATALOG_API_BASE}/portfolio_items/1/service_plans`, {
      status: 500
    });
    const expectedActions = [
      {
        type: `${FETCH_SERVICE_PLANS}_PENDING`
      },
      expect.objectContaining({
        type: ADD_NOTIFICATION,
        payload: expect.objectContaining({
          variant: 'danger'
        })
      }),
      expect.objectContaining({
        type: `${FETCH_SERVICE_PLANS}_REJECTED`
      })
    ];

    return store.dispatch(fetchServicePlans(1)).catch(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch correct actions after calling update service data', () => {
    const store = mockStore({});
    const expectedActions = [
      {
        type: UPDATE_SERVICE_DATA,
        payload: { serviceData: { foo: 'bar' } }
      }
    ];

    store.dispatch(updateServiceData({ foo: 'bar' }));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should dispatch correct actions after calling set selected plan', () => {
    const store = mockStore({});
    const expectedActions = [
      {
        type: SET_SELECTED_PLAN,
        payload: { foo: 'bar' }
      }
    ];

    store.dispatch(setSelectedPlan({ foo: 'bar' }));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should dispatch correct actions after submitting order', () => {
    const store = mockStore({});
    mockApi.onPost(`${CATALOG_API_BASE}/orders`).reply(200, { id: '123' });
    mockApi
      .onPost(`${CATALOG_API_BASE}/orders/123/order_items`)
      .reply(200, { id: 'order-item-id' });
    mockApi.onPost(`${CATALOG_API_BASE}/orders/123/submit_order`).reply(200, {
      id: 'new-order-id'
    });
    const expectedActions = [
      {
        type: `${SUBMIT_SERVICE_ORDER}_PENDING`
      },
      expect.objectContaining({
        type: ADD_NOTIFICATION,
        payload: expect.objectContaining({
          variant: 'success',
          dismissable: true,
          title: 'Your order has been accepted successfully'
        })
      }),
      expect.objectContaining({
        type: `${SUBMIT_SERVICE_ORDER}_FULFILLED`
      })
    ];

    return store
      .dispatch(
        sendSubmitOrder(
          {
            portfolio_item_id: 'Foo',
            service_plan_ref: 'Bar',
            service_parameters: {
              bax: 'quxx',
              providerControlParameters: { namespace: 'default' }
            }
          },
          {
            id: 'Foo',
            portfolio_id: 'portfolio-id',
            service_offering_source_ref: 'source-id'
          }
        )
      )
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should dispatch correct actions after submitting order fails to get new order', () => {
    const store = mockStore({});
    mockApi.onPost(`${CATALOG_API_BASE}/orders`, { status: 500 });
    const expectedActions = [
      {
        type: `${SUBMIT_SERVICE_ORDER}_PENDING`
      },
      expect.objectContaining({
        type: ADD_NOTIFICATION,
        payload: expect.objectContaining({
          variant: 'danger'
        })
      }),
      expect.objectContaining({
        type: `${SUBMIT_SERVICE_ORDER}_REJECTED`
      })
    ];

    return store
      .dispatch(
        sendSubmitOrder({
          portfolio_item_id: 'Foo',
          service_plan_ref: 'Bar',
          service_parameters: 'Quxx'
        })
      )
      .catch(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should dispatch correct actions after submitting order fails to add to new order', () => {
    const store = mockStore({});
    mockApi.onPost(`${CATALOG_API_BASE}/orders`, { id: 123 });

    mockApi.onPost(`${CATALOG_API_BASE}/orders/123/items`, { status: 500 });

    const expectedActions = [
      {
        type: `${SUBMIT_SERVICE_ORDER}_PENDING`
      },
      expect.objectContaining({
        type: ADD_NOTIFICATION,
        payload: expect.objectContaining({
          variant: 'danger'
        })
      }),
      expect.objectContaining({
        type: `${SUBMIT_SERVICE_ORDER}_REJECTED`
      })
    ];

    return store.dispatch(sendSubmitOrder({})).catch(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch correct actions after submitting order fails to submit order', () => {
    const store = mockStore({});
    mockApi.onPost(`${CATALOG_API_BASE}/orders`, { id: 123 });

    mockApi.onPost(`${CATALOG_API_BASE}/orders/123/items`, { status: 200 });
    mockApi.onPost(`${CATALOG_API_BASE}/orders/123`, { status: 500 });

    const expectedActions = [
      {
        type: `${SUBMIT_SERVICE_ORDER}_PENDING`
      },
      expect.objectContaining({
        type: ADD_NOTIFICATION,
        payload: expect.objectContaining({
          variant: 'danger'
        })
      }),
      expect.objectContaining({
        type: `${SUBMIT_SERVICE_ORDER}_REJECTED`
      })
    ];

    return store.dispatch(sendSubmitOrder({})).catch(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
