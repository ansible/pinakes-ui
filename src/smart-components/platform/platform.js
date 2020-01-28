import React, { Fragment, useEffect } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import { scrollToTop } from '../../helpers/shared/helpers';
import {
  fetchSelectedPlatform,
  fetchPlatforms
} from '../../redux/actions/platform-actions';
import PlatformTemplates from './platform-templates';
import PlatformInventories from './platform-inventories';
import useQuery from '../../utilities/use-query';
import { useDispatch, useSelector } from 'react-redux';
import ServiceOfferingDetail from './service-offering/service-offering-detail';
import useBreadCrumbs from '../../utilities/use-breadcrumbs';

const Platform = () => {
  const dispatch = useDispatch();
  const [{ platform }] = useQuery(['platform']);
  const { pathname } = useLocation();
  const { selectedPlatform, serviceOffering } = useSelector(
    ({ platformReducer: { selectedPlatform, serviceOffering } }) => ({
      selectedPlatform,
      serviceOffering
    })
  );

  const resetBreadcrumbs = useBreadCrumbs([
    pathname,
    selectedPlatform,
    serviceOffering
  ]);

  useEffect(() => {
    insights.chrome.appNavClick({ id: 'platforms', secondaryNav: true });
    Promise.all([
      dispatch(fetchSelectedPlatform(platform)),
      dispatch(fetchPlatforms())
    ]);
    scrollToTop();
    return () => {
      resetBreadcrumbs();
    };
  }, [platform]);

  return (
    <Fragment>
      <Switch>
        <Route path="/platform/service-offerings">
          <ServiceOfferingDetail />
        </Route>
        <Route path="/platform/platform-inventories">
          <PlatformInventories />
        </Route>
        <Route path={['/platform/platform-templates', '/platform']}>
          <PlatformTemplates />
        </Route>
      </Switch>
    </Fragment>
  );
};

export default Platform;
