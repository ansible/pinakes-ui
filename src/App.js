import React, { useState, useEffect, Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Grid, GridItem } from '@patternfly/react-core';
import { Main } from '@redhat-cloud-services/frontend-components/components/Main';
import { NotificationsPortal } from '@redhat-cloud-services/frontend-components-notifications/';

import { Routes } from './Routes';
import { MIN_SCREEN_HEIGHT } from './constants/ui-constants';
import { AppPlaceholder } from './presentational-components/shared/loader-placeholders';
import { SET_OPENAPI_SCHEMA, SET_SOURCETYPE_ICONS } from './redux/action-types';

import 'whatwg-fetch';
import smoothscroll from 'smoothscroll-polyfill';

// react-int eng locale data
import { IntlProvider } from 'react-intl';

import '@redhat-cloud-services/frontend-components-notifications/index.css';
import { getAxiosInstance } from './helpers/shared/user-login';
import { CATALOG_API_BASE, SOURCES_API_BASE } from './utilities/constants';

smoothscroll.polyfill();

/**
 * has to be in global context because nav listener is not a part of component lifecycle
 */
let ignoreRedirect = true;

const App = () => {
  const [auth, setAuth] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  let unregister;

  useEffect(() => {
    insights.chrome.init();
    Promise.all([
      getAxiosInstance()
        .get(`${CATALOG_API_BASE}/openapi.json`)
        .then((payload) => dispatch({ type: SET_OPENAPI_SCHEMA, payload })),
      getAxiosInstance()
        .get(`${SOURCES_API_BASE}/source_types`)
        .then(({ data }) =>
          dispatch({
            type: SET_SOURCETYPE_ICONS,
            payload: data.reduce(
              (acc, curr) => ({
                ...acc,
                [curr.id]: curr.icon_url
              }),
              {}
            )
          })
        ),
      insights.chrome.auth.getUser()
    ]).then(() => setAuth(true));

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

  if (!auth) {
    return <AppPlaceholder />;
  }

  return (
    <IntlProvider locale="en">
      <Fragment>
        <NotificationsPortal />
        <Main className="pf-u-p-0 pf-u-ml-0">
          <Grid style={{ minHeight: MIN_SCREEN_HEIGHT }}>
            <GridItem sm={12} className="content-layout">
              <Routes />
            </GridItem>
          </Grid>
        </Main>
      </Fragment>
    </IntlProvider>
  );
};

export default App;
