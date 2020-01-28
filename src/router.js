import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import AppContext from './app-context';

const pathName = window.location.pathname.split('/');
pathName.shift();

let release = '/';
if (pathName[0] === 'beta') {
  release = `/${pathName.shift()}/`;
}

const Router = () => {
  return (
    <AppContext.Provider value={{ release }}>
      <BrowserRouter basename={`${release}${pathName[0]}/${pathName[1]}`}>
        <App />
      </BrowserRouter>
    </AppContext.Provider>
  );
};

export default Router;
