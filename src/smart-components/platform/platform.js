import React, { Fragment, useEffect, lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import { scrollToTop } from '../../helpers/shared/helpers';
import {
  fetchSelectedPlatform,
  fetchPlatforms
} from '../../redux/actions/platform-actions';
import useQuery from '../../utilities/use-query';
import { useDispatch, useSelector } from 'react-redux';
import useBreadcrumbs from '../../utilities/use-breadcrumbs';
import {
  PLATFORM_SERVICE_OFFERINGS_ROUTE,
  PLATFORM_INVENTORIES_ROUTE,
  PLATFORM_ROUTE,
  PLATFORM_TEMPLATES_ROUTE,
  PLATFORM_DETAILS_ROUTE
} from '../../constants/routes';
import ToolbarRenderer from '../../toolbar/toolbar-renderer';
import { createPlatformsTopToolbarSchema } from '../../toolbar/schemas/platforms-toolbar.schema';
import { PlatformToolbarPlaceholder } from '../../presentational-components/shared/loader-placeholders';
import { LevelItem } from '@patternfly/react-core';
import { InfoCircleIcon } from '@patternfly/react-icons';
import labelMessages from '../../messages/labels.messages';
import useFormatMessage from '../../utilities/use-format-message';

const PlatformDetails = lazy(() =>
  import(/* webpackChunkName: "platform-details" */ './platform-details')
);

const PlatformTemplates = lazy(() =>
  import(/* webpackChunkName: "platform-templates" */ './platform-templates')
);

const PlatformInventories = lazy(() =>
  import(
    /* webpackChunkName: "platform-inventories" */ './platform-inventories'
  )
);

const ServiceOfferingDetail = lazy(() =>
  import(
    /* webpackChunkName: "service-offering-detail" */ './service-offering/service-offering-detail'
  )
);

const tabItems = [
  {
    eventKey: 0,
    title: 'Templates',
    name: `/platform/platform-templates`
  },
  {
    eventKey: 1,
    title: 'Inventories',
    name: `/platform/platform-inventories`
  },
  {
    eventKey: 2,
    title: 'Summary',
    name: `/platform/platform-details`
  }
];

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
  const formatMessage = useFormatMessage();

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

  const platformAvailable = (platform) => ({
    color: platform.availability_status === 'available' ? 'green' : 'red',
    icon: <InfoCircleIcon />,
    title:
      platform.availability_status === 'available'
        ? formatMessage(labelMessages.available)
        : formatMessage(labelMessages.notAvailable)
  });

  return (
    <Fragment>
      <Route
        exact
        path={[
          PLATFORM_INVENTORIES_ROUTE,
          PLATFORM_ROUTE,
          PLATFORM_TEMPLATES_ROUTE,
          PLATFORM_DETAILS_ROUTE,
          `${PLATFORM_INVENTORIES_ROUTE}/*`
        ]}
      >
        <LevelItem>
          <ToolbarRenderer
            schema={createPlatformsTopToolbarSchema({
              title: selectedPlatform.name,
              paddingBottom: false,
              tabItems,
              platformAvailable: () => platformAvailable(selectedPlatform)
            })}
          />
        </LevelItem>
      </Route>
      <Suspense fallback={<PlatformToolbarPlaceholder />}>
        <Switch>
          <Route path={PLATFORM_SERVICE_OFFERINGS_ROUTE}>
            <ServiceOfferingDetail />
          </Route>
          <Route path={PLATFORM_INVENTORIES_ROUTE}>
            <PlatformInventories />
          </Route>
          <Route path={PLATFORM_DETAILS_ROUTE}>
            <PlatformDetails />
          </Route>
          <Route path={[PLATFORM_TEMPLATES_ROUTE, PLATFORM_ROUTE]}>
            <PlatformTemplates />
          </Route>
        </Switch>
      </Suspense>
    </Fragment>
  );
};

export default Platform;
