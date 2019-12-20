import { SET_LOADING_STATE } from '../redux/action-types';

const loadingStateMiddleware = () => (dispatch) => (action) => {
  if (action.type.match(/_REJECTED$/)) {
    dispatch({ type: SET_LOADING_STATE, payload: false });
  }

  return dispatch(action);
};

export default loadingStateMiddleware;
