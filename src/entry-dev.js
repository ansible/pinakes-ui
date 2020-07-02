import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './utilities/store';
import Router from './router';

console.log('%c Catalog UI started in development mode', 'color: blue');

ReactDOM.render(
  <Provider store={store()}>
    <Router />
  </Provider>,
  document.getElementById('root')
);
