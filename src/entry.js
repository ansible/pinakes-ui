import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './utilities/store';
import Router from './router';

ReactDOM.render(
  <Provider store={store()}>
    <Router />
  </Provider>,
  document.getElementById('root')
);
