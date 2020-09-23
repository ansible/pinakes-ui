import { SET_LOADING_STATE } from '../redux/action-types';
import { Dispatch } from 'redux';
import { ReduxAction } from '../types/common-types';

const loadingStateMiddleware = () => (dispatch: Dispatch) => (
  action: ReduxAction
): ReduxAction => {
  if (action.type.match(/_REJECTED$/)) {
    dispatch({ type: SET_LOADING_STATE, payload: false });
  }

  return dispatch(action);
};

export default loadingStateMiddleware;
