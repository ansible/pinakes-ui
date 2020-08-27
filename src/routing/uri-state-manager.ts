import { AnyObject } from '../types/common-types';

export const decodeState = (encodedState: string): AnyObject | undefined => {
  try {
    return JSON.parse(atob(decodeURIComponent(encodedState)));
  } catch (error) {
    return undefined;
  }
};

export const encodeState = (state: AnyObject, stateKey?: string): string => {
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
