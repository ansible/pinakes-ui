import React, { Fragment, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
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
import useBreadcrumbs from '../../utilities/use-breadcrumbs';
import {
  PLATFORM_SERVICE_OFFERINGS_ROUTE,
  PLATFORM_INVENTORIES_ROUTE,
  PLATFORM_ROUTE,
  PLATFORM_TEMPLATES_ROUTE
} from '../../constants/routes';

const Platform = () => {
  const dispatch = useDispatch();
  const [{ platform }] = useQuery(['platform']);
  const { selectedPlatform, serviceOffering } = useSelector(
    ({ platformReducer: { selectedPlatform, serviceOffering } }) => ({
      selectedPlatform,
      serviceOffering
    })
  );

  const resetBreadcrumbs = useBreadcrumbs([selectedPlatform, serviceOffering]);

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
        <Route path={PLATFORM_SERVICE_OFFERINGS_ROUTE}>
          <ServiceOfferingDetail />
        </Route>
        <Route path={PLATFORM_INVENTORIES_ROUTE}>
          <PlatformInventories />
        </Route>
        <Route path={[PLATFORM_TEMPLATES_ROUTE, PLATFORM_ROUTE]}>
          <PlatformTemplates />
        </Route>
      </Switch>
    </Fragment>
  );
};

export default Platform;
