import { catalogHistory } from '../router';

const unAuthorizedMiddleware = () => (dispatch) => (action) => {
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
