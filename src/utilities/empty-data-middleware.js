const emptyDataMiddleware = () => (dispatch) => (action) => {
  const nextAction = { ...action };
  if (
    action.type.match(/_FULFILLED$/) &&
    action.payload &&
    action.meta &&
    action.payload.data &&
    action.payload.meta
  ) {
    nextAction.payload.meta.noData =
      nextAction.payload.meta.count === 0 &&
      nextAction.meta.filter.length === 0;
    return dispatch(nextAction);
  }

  return dispatch(nextAction);
};

export default emptyDataMiddleware;
