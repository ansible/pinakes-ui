import React from 'react';
import { Router as ReactRouter } from 'react-router-dom';
import App from './App';
import { createBrowserHistory } from 'history';
import AppContext from './app-context';
import GlobalStyle from './global-styles';

const pathName = window.location.pathname.split('/');
pathName.shift();

let release = '/';
if (pathName[0] === 'beta') {
  release = `/${pathName.shift()}/`;
}

export const catalogHistory = createBrowserHistory({
  basename: `${release}${pathName[0]}/${pathName[1]}`
});

const Router = () => (
  <AppContext.Provider value={{ release }}>
    <GlobalStyle />
    <ReactRouter history={catalogHistory}>
      <App />
    </ReactRouter>
  </AppContext.Provider>
);

export default Router;
