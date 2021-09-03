import React from 'react';
import { Provider } from 'react-redux';
import store from '../../utilities/store';
import { IntlProvider } from 'react-intl';
import { Router as ReactRouter } from 'react-router-dom';
import AppStandalone from './AppStandalone';
import AppContext from '../../app-context';
import GlobalStyle from '../../global-styles';
import catalogHistory, { release } from '../../routing/catalog-history';

const Router = () => (
  <AppContext.Provider value={{ release }}>
    <GlobalStyle />
    <ReactRouter history={catalogHistory}>
      <AppStandalone />
    </ReactRouter>
  </AppContext.Provider>
);

const AppEntry = () => {
  console.log('Debug - App entry ');
  return (
    <Provider store={store(true)}>
      <IntlProvider locale="en">
        <Router />
      </IntlProvider>
    </Provider>
  );
};

export default AppEntry;
