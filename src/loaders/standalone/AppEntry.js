import React from 'react';
import { Provider } from 'react-redux';
import store from '../../utilities/store';
import { IntlProvider } from '@redhat-cloud-services/frontend-components-translations';
import Router from './AppStandalone';
import { translatedMessages } from '../../translatedMessages';

const AppEntry = () => {
  console.log('%c Catalog UI started in standalone mode', 'color: blue');
  console.log('navigator.language: ', navigator.language);
  localStorage.setItem('catalog_standalone', true);
  return (
    <Provider store={store(true)}>
      <IntlProvider
        locale={navigator.language.slice(0, 2)}
        messages={translatedMessages}
      >
        <Router />
      </IntlProvider>
    </Provider>
  );
};

export default AppEntry;
