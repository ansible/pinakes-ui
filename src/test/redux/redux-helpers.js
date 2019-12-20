import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

export const callReducer = (reducer) => (state, action) => {
  if (!reducer[action.type]) {
    return;
  }

  return reducer[action.type](state, action);
};

export const mockBreacrumbsStore = (state = {}, middlewares = []) => {
  const initialState = {
    ...state
  };
  const store = configureStore(middlewares)(initialState);
  const Wrapper = ({ children, ...rest }) => (
    <Provider store={store} {...rest}>
      {children}
    </Provider>
  );
  return Wrapper;
};
