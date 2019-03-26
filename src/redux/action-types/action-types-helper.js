export const createAsyncActionTypes = (actionTypes, prefix) => actionTypes.reduce((acc, curr) => [
  ...acc,
  ...[ curr, `${curr}_PENDING`, `${curr}_FULFILLED`, `${curr}_REJECTED` ]
], []).reduce((acc, curr) => ({
  ...acc,
  [curr]: `${prefix}${curr}`
}), {});

