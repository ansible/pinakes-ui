import React, { useState, useEffect, Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { INITIALIZE_I18N } from '../../redux/action-types';

import 'whatwg-fetch';
import smoothscroll from 'smoothscroll-polyfill';

// react-int eng locale data
import { useIntl } from 'react-intl';

import '@redhat-cloud-services/frontend-components-notifications/index.css';
import { Bullseye, Skeleton } from '@patternfly/react-core';
import { Spinner } from '@patternfly/react-core/dist/js/components/Spinner/Spinner';

smoothscroll.polyfill();

const AppStandalone = () => {
  const dispatch = useDispatch();
  const i18l = useIntl();
  console.log('Debug - AppStandalone ');
  useEffect(() => {
    dispatch({ type: INITIALIZE_I18N, payload: i18l });
  }, []);
  return (
    <Fragment>
      <section className="pf-u-m-0 pf-u-p-0 pf-l-page__main-section pf-c-page__main-section">
        <Skeleton height={32} className="pf-u-p-lg global-primary-background" />
        <div className="pf-u-mt-lg">
          <Bullseye>
            <Spinner />
          </Bullseye>
        </div>
      </section>
    </Fragment>
  );
};

export default AppStandalone;
