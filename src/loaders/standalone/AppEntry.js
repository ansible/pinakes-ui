import React from 'react';
import { Provider } from 'react-redux';
import store from '../../utilities/store';
import { IntlProvider } from 'react-intl';
import Router from './AppStandalone';

const AppEntry = () => {
  console.log('Debug - Standalone App entry ');
  return (
    <Provider store={store(true)}>
      <IntlProvider locale="en">
        <Router />
      </IntlProvider>
    </Provider>
  );
};

export default AppEntry;
