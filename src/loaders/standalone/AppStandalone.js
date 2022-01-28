import React from 'react';
import { BrowserRouter as ReactRouter } from 'react-router-dom';
import App from '../../standalone-nav';
import AppContext from '../../app-context';
import GlobalStyle from '../../global-styles';
import catalogHistory, { release } from '../../routing/catalog-history';

const Router = () => (
  <AppContext.Provider value={{ release }}>
    <GlobalStyle />
    <ReactRouter basename="/ui/catalog" history={catalogHistory}>
      <App />
    </ReactRouter>
  </AppContext.Provider>
);

export default Router;
