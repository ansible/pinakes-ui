import { callReducer } from '../redux-helpers';
import approvalReducer from '../../../redux/reducers/approval-reducer';
import { ASYNC_ACTIONS } from '../../../redux/ActionTypes/approval-action-types';

describe('approvalReducer', () => {
  let initialState;
  const reducer = callReducer(approvalReducer);
  const payload = {
    data: 'data'
  };

  beforeEach(() => {
    initialState = {};
  });

  it('should set loading state to true', () => {
    const expectedState = expect.objectContaining({ isFetching: true });
    expect(reducer(initialState, { type: ASYNC_ACTIONS.FETCH_WORKFLOWS_PENDING })).toEqual(expectedState);
  });

  it('should set workflows and set loading state to false', () => {
    const expectedState = expect.objectContaining({ isFetching: false, workflows: payload });
    expect(reducer(initialState, { type: ASYNC_ACTIONS.FETCH_WORKFLOWS_FULFILLED, payload })).toEqual(expectedState);
  });

});
