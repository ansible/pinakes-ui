import catalogHistory from '../routing/catalog-history';
import { Dispatch } from 'redux';
import { ReduxAction } from '../types/common-types';

const unAuthorizedMiddleware = () => (dispatch: Dispatch) => (
  action: ReduxAction
): ReduxAction | void => {
  const nextAction = { ...action };
  if (action.type.match(/_REJECTED$/) && action?.payload?.redirect) {
    setTimeout(() => {
      catalogHistory.push(action.payload.redirect.pathname, {
        from: catalogHistory.location
      });
    });
    return;
  }

  return dispatch(nextAction);
};

export default unAuthorizedMiddleware;
