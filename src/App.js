import React, { useState, useEffect, Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter, useHistory } from 'react-router-dom';
import { Grid, GridItem } from '@patternfly/react-core';
import NotificationsPortal from '@redhat-cloud-services/frontend-components-notifications/NotificationPortal';

import { Routes } from './Routes';
import { MIN_SCREEN_HEIGHT } from './constants/ui-constants';
import { AppPlaceholder } from './presentational-components/shared/loader-placeholders';
import {
  SET_OPENAPI_SCHEMA,
  SET_SOURCETYPE_ICONS,
  INITIALIZE_I18N
} from './redux/action-types';

import 'whatwg-fetch';
import smoothscroll from 'smoothscroll-polyfill';

// react-int eng locale data
import { useIntl } from 'react-intl';

import '@redhat-cloud-services/frontend-components-notifications/index.css';
import { getAxiosInstance } from './helpers/shared/user-login';
import { CATALOG_API_BASE, SOURCES_API_BASE } from './utilities/constants';
import UserContext from './user-context';

smoothscroll.polyfill();

/**
 * has to be in global context because nav listener is not a part of component lifecycle
 */
let ignoreRedirect = true;

const App = () => {
  const [auth, setAuth] = useState(false);
  const [userPermissions, setUserPermissions] = useState();
  const [userIdentity, setUserIdentity] = useState({ identity: {} });
  const [openApiSchema, setOpenApiSchema] = useState();
  const dispatch = useDispatch();
  const i18l = useIntl();
  const history = useHistory();
  let unregister;

  useEffect(() => {
    insights.chrome.init();
    dispatch({ type: INITIALIZE_I18N, payload: i18l });
    Promise.all([
      getAxiosInstance()
        .get(`${CATALOG_API_BASE}/openapi.json`)
        .then((payload) => {
          setOpenApiSchema(payload);
          dispatch({ type: SET_OPENAPI_SCHEMA, payload });
        }),
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
      insights.chrome.auth.getUser().then((user) => {
        setUserIdentity(user);
        return insights.chrome
          .getUserPermissions()
          .then((data) => setUserPermissions(data));
      })
    ]).then(() => setAuth(true));

    insights.chrome.identifyApp('catalog');
    unregister = insights.chrome.on('APP_NAVIGATION', (event) => {
      /**
       * Handle navigation from insights main nav
       * Uses React history directly instead of browser history to avoid template reload.
       */
      if (event.domEvent) {
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
    <BrowserRouter basename="">
      <UserContext.Provider
        value={{ permissions: userPermissions, userIdentity, openApiSchema }}
      >
        <Fragment>
          <NotificationsPortal />
          <section className="pf-u-p-0 pf-u-ml-0 pf-l-page__main-section pf-c-page__main-section">
            <Grid style={{ minHeight: MIN_SCREEN_HEIGHT }}>
              <GridItem sm={12} className="content-layout">
                <Routes />
              </GridItem>
            </Grid>
          </section>
        </Fragment>
      </UserContext.Provider>
    </BrowserRouter>
  );
};

export default App;
