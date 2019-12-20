import orderReducer from '../../../redux/reducers/order-reducer';
import { callReducer } from '../redux-helpers';

import {
  FETCH_SERVICE_PLANS,
  LIST_ORDERS,
  FETCH_SERVICE_PLAN_PARAMETERS,
  SUBMIT_SERVICE_ORDER,
  UPDATE_SERVICE_DATA,
  SET_SELECTED_PLAN
} from '../../../redux/action-types';

describe('Platform reducer', () => {
  let initialState;
  const reducer = callReducer(orderReducer);

  const payload = {
    data: 'data'
  };

  beforeEach(() => {
    initialState = {};
  });

  it('should set loading state to true', () => {
    const expectedState = expect.objectContaining({ isLoading: true });
    expect(
      reducer(initialState, { type: `${FETCH_SERVICE_PLANS}_PENDING` })
    ).toEqual(expectedState);

    expect(reducer(initialState, { type: `${LIST_ORDERS}_PENDING` })).toEqual(
      expectedState
    );

    expect(
      reducer(initialState, {
        type: `${FETCH_SERVICE_PLAN_PARAMETERS}_PENDING`
      })
    ).toEqual(expectedState);
  });

  it('should set servicePlans and loading state to false', () => {
    const expectedState = expect.objectContaining({
      isLoading: false,
      servicePlans: payload
    });
    expect(
      reducer(initialState, {
        type: `${FETCH_SERVICE_PLANS}_FULFILLED`,
        payload
      })
    ).toEqual(expectedState);
  });

  it('should set orders and loading state to false', () => {
    const expectedState = expect.objectContaining({
      isLoading: false,
      orders: payload
    });
    expect(
      reducer(initialState, { type: `${LIST_ORDERS}_FULFILLED`, payload })
    ).toEqual(expectedState);
  });

  it('should set planParameters and loading state to false', () => {
    const expectedState = expect.objectContaining({
      isLoading: false,
      planParameters: payload
    });
    expect(
      reducer(initialState, {
        type: `${FETCH_SERVICE_PLAN_PARAMETERS}_FULFILLED`,
        payload
      })
    ).toEqual(expectedState);
  });

  it('should set serviceOrder and loading state to false', () => {
    const expectedState = expect.objectContaining({
      isLoading: false,
      ...payload
    });
    expect(
      reducer(initialState, {
        type: `${SUBMIT_SERVICE_ORDER}_FULFILLED`,
        payload
      })
    ).toEqual(expectedState);
  });

  it('should update serviceData and set loading state to false', () => {
    const expectedState = expect.objectContaining({
      isLoading: false,
      serviceData: payload
    });
    expect(
      reducer(initialState, { type: UPDATE_SERVICE_DATA, payload })
    ).toEqual(expectedState);
  });

  it('should select plan and set loading state to false', () => {
    const expectedState = expect.objectContaining({
      isLoading: false,
      selectedPlan: payload
    });
    expect(reducer(initialState, { type: SET_SELECTED_PLAN, payload })).toEqual(
      expectedState
    );
  });
});
