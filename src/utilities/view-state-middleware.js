import { encodeState } from '../routing/uri-state-manager';

const viewStateMiddleware = () => (dispatch) => (action) => {
  if (
    action.type.match(/_FULFILLED$/) &&
    action?.payload?.meta &&
    action?.meta?.storeState
  ) {
    window.location.hash = encodeState(
      {
        ...action.meta,
        ...action.payload.meta
      },
      action.meta.stateKey
    );
  }

  return dispatch(action);
};

export default viewStateMiddleware;
