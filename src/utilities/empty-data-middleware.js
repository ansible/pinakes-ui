const emptyDataMiddleware = () => (dispatch) => (action) => {
  const nextAction = { ...action };
  if (
    action.type.match(/_FULFILLED$/) &&
    action.payload &&
    action.meta &&
    action.payload.data &&
    action.payload.meta
  ) {
    const noFilter = Object.prototype.hasOwnProperty.call(
      nextAction.meta,
      'filters'
    )
      ? Object.values(nextAction.meta.filters).every(
          (value) => typeof value === 'undefined' || value.length === 0
        )
      : nextAction.meta.filter.length === 0;
    nextAction.payload.meta.noData =
      nextAction.payload.meta.count === 0 && noFilter;
    return dispatch(nextAction);
  }

  return dispatch(nextAction);
};

export default emptyDataMiddleware;
