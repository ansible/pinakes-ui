import React from 'react';
import { Router as ReactRouter } from 'react-router-dom';
import App from './App';
import AppContext from './app-context';
import GlobalStyle from './global-styles';
import catalogHistory, { release } from './routing/catalog-history';

const Router = () => (
  <AppContext.Provider value={{ release }}>
    <GlobalStyle />
    <ReactRouter history={catalogHistory}>
      <App />
    </ReactRouter>
  </AppContext.Provider>
);

export default Router;
