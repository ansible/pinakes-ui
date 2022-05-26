import React from 'react';
import { Provider } from 'react-redux';
import store from './utilities/store';
import Router from './router';
import { IntlProvider } from 'react-intl';

const AppEntry = () => {
  console.log('navigator.language: ', navigator.language);
  return (
    <Provider store={store(true)}>
      <IntlProvider locale={navigator.language.slice(0, 2)}>
        <Router />
      </IntlProvider>
    </Provider>
  );
};

export default AppEntry;
