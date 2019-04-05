import { callReducer } from '../redux-helpers';
import rbacReducer from '../../../redux/reducers/rbac-reducer';
import { FETCH_RBAC_GROUPS } from '../../../redux/action-types';

describe('Rbac reducer', () => {
  let initialState;
  const reducer = callReducer(rbacReducer);

  beforeEach(() => {
    initialState = {};
  });

  it('should set loading state to true', () => {
    const expectedState = expect.objectContaining({ isLoading: true });
    expect(reducer(initialState, { type: `${FETCH_RBAC_GROUPS}_PENDING` })).toEqual(expectedState);
  });

  it('should set the groups data and set loading state to false', () => {
    const payload = { data: 'Foo' };
    const expectedState = { isLoading: false, rbacGroups: payload };
    expect(reducer(initialState, { type: `${FETCH_RBAC_GROUPS}_FULFILLED`, payload })).toEqual(expectedState);
  });
});

