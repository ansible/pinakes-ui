import React, { useState, useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Grid, GridItem } from '@patternfly/react-core';
import { Main } from '@redhat-cloud-services/frontend-components';
import { NotificationsPortal } from '@redhat-cloud-services/frontend-components-notifications/';

import { Routes } from './Routes';
import { MIN_SCREEN_HEIGHT } from './constants/ui-constants';
import { AppPlaceholder } from './presentational-components/shared/loader-placeholders';
import { SET_OPENAPI_SCHEMA } from './redux/action-types';

import 'whatwg-fetch';
import smoothscroll from 'smoothscroll-polyfill';

// react-int eng locale data
import { IntlProvider } from 'react-intl';

import '@redhat-cloud-services/frontend-components-notifications/index.css';
import './App.scss';
import { getAxiosInstance } from './helpers/shared/user-login';
import { CATALOG_API_BASE } from './utilities/constants';

smoothscroll.polyfill();

/**
 * has to be in global context because nav listener is not a part of component lifecycle
 */
let ignoreRedirect = true;

const App = () => {
  const [auth, setAuth] = useState(false);
  const schema = useSelector(({ openApiReducer }) => openApiReducer);
  const dispatch = useDispatch();
  const history = useHistory();
  let unregister;

  useEffect(() => {
    getAxiosInstance()
      .get(`${CATALOG_API_BASE}/openapi.json`)
      .then((payload) => dispatch({ type: SET_OPENAPI_SCHEMA, payload }));

    insights.chrome.init();
    insights.chrome.auth.getUser().then(() => setAuth(true));
    insights.chrome.identifyApp('catalog');
    insights.chrome.navigation([
      {
        id: 'products',
        title: 'Products'
      },
      {
        id: 'portfolios',
        title: 'Portfolios'
      },
      {
        id: 'platforms',
        title: 'Platforms'
      },
      {
        id: 'orders',
        title: 'Orders'
      }
    ]);

    unregister = insights.chrome.on('APP_NAVIGATION', (event) => {
      /**
       * Handle navigation from insights main nav
       * Uses React history directly instead of browser history to avoid template realod.
       * only redirect after first application mount
       */
      if (!ignoreRedirect && event.domEvent) {
        history.push(`/${event.navId}`);
      }

      ignoreRedirect = false;
    });

    return () => unregister();
  }, []);

  if (!auth || !schema) {
    return <AppPlaceholder />;
  }

  return (
    <IntlProvider locale="en">
      <Fragment>
        <NotificationsPortal />
        <Main style={{ marginLeft: 0, padding: 0 }}>
          <Grid style={{ minHeight: MIN_SCREEN_HEIGHT }}>
            <GridItem sm={12}>
              <Routes />
            </GridItem>
          </Grid>
        </Main>
      </Fragment>
    </IntlProvider>
  );
};

export default App;
