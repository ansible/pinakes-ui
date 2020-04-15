export const decodeState = (encodedState) => {
  try {
    return JSON.parse(atob(decodeURIComponent(encodedState)));
  } catch (error) {
    return undefined;
  }
};

export const encodeState = (state, stateKey) => {
  const stateObject = stateKey
    ? {
        ...decodeState(window.location.hash),
        [stateKey]: state
      }
    : state;
  try {
    return encodeURIComponent(btoa(JSON.stringify(stateObject)));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(
      'View state is not a valid JSON, state has will not be generated. View state: ',
      state
    );
    return '';
  }
};
