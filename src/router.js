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

/**
 * Make sure that the [1] fragment is present in the pathname.
 * Otherwise we could end up with /undefined/ which will be transformed by the router to //
 */
const basename = `${release}${pathName[0]}/${pathName[1] ? pathName[1] : ''}`;

export const catalogHistory = createBrowserHistory({
  basename
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
