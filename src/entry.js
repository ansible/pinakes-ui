import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './utilities/store';
import App from './App';
import AppContext from './app-context';

const pathName = window.location.pathname.split('/');
pathName.shift();

let release = '/';
if (pathName[0] === 'beta') {
  release = `/${pathName.shift()}/`;
}

ReactDOM.render(
  <Provider store={store}>
    <AppContext.Provider value={{ release }}>
      <Router basename={`${release}${pathName[0]}/${pathName[1]}`}>
        <App />
      </Router>
    </AppContext.Provider>
  </Provider>,
  document.getElementById('root')
);
