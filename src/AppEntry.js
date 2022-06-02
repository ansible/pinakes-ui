import React from 'react';
import { Provider } from 'react-redux';
import store from './utilities/store';
import Router from './router';
import { IntlProvider } from 'react-intl';

const AppEntry = () => (
  <Provider store={store(true)}>
    <IntlProvider locale="en">
      <Router />
    </IntlProvider>
  </Provider>
);

export default AppEntry;
