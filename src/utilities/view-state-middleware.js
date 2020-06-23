import { encodeState } from '../routing/uri-state-manager';
import { catalogHistory } from '../router';

const viewStateMiddleware = () => (dispatch) => (action) => {
  if (
    action.type.match(/_FULFILLED$/) &&
    action?.payload?.meta &&
    action?.meta?.storeState
  ) {
    const hash = encodeState(
      {
        ...action.meta,
        ...action.payload.meta
      },
      action.meta.stateKey
    );
    /**
     * Use replace event in case that app did not compute the viewState hash yet (eg. navigating in main menu).
     * Use history replace event to prevent the multiple prev routes with the same pathname on stack witouth the hash param.
     * The browser goBack method will now skip the non hash route.
     * Users wont have to trigger the goBack action multiple times to get to the actual previous view.
     */
    const routingAction =
      catalogHistory.location.hash && catalogHistory.location.hash !== hash
        ? catalogHistory.push
        : catalogHistory.replace;
    routingAction({
      pathname: catalogHistory.location.pathname,
      search: catalogHistory.location.search,
      hash
    });
  }

  return dispatch(action);
};

export default viewStateMiddleware;
