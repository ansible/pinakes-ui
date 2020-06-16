import React, { useEffect, useState, Fragment, Suspense, lazy } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import {
  StackItem,
  Level,
  LevelItem,
  Split,
  SplitItem,
  Bullseye,
  Alert
} from '@patternfly/react-core';
import { Spinner } from '@patternfly/react-core/dist/js/components/Spinner/Spinner';
import { useDispatch, useSelector } from 'react-redux';

import { fetchOrderDetails } from '../../../redux/actions/order-actions';
import OrderDetailTitle from './order-detail-title';
import OrderToolbarActions from './order-toolbar-actions';
import OrderDetailInformation from './order-detail-information';
import OrderDetailMenu from './order-detail-menu';
import { OrderDetailToolbarPlaceholder } from '../../../presentational-components/shared/loader-placeholders';
import useQuery from '../../../utilities/use-query';
import CatalogBreadcrumbs from '../../common/catalog-breadcrumbs';
import useBreadcrumbs from '../../../utilities/use-breadcrumbs';
import { fetchPlatforms } from '../../../redux/actions/platform-actions';
import { ORDER_ROUTE } from '../../../constants/routes';
import {
  OrderDetailStack,
  OrderDetailStackItem
} from '../../../presentational-components/styled-components/orders';
import UnAvailableAlertContainer from '../../../presentational-components/styled-components/unavailable-alert-container';
import { FormattedMessage } from 'react-intl';

const ApprovalRequests = lazy(() =>
  import(/* webpackChunkName: "approval-request" */ './approval-request')
);
const OrderLifecycle = lazy(() =>
  import(/* webpackChunkName: "order-lifecycle" */ './order-lifecycle')
);
const OrderDetails = lazy(() =>
  import(/* webpackChunkName: "order-details" */ './order-details')
);
const requiredParams = [
  'order-item',
  'portfolio-item',
  'platform',
  'portfolio',
  'order'
];

const OrderDetail = () => {
  const [isFetching, setIsFetching] = useState(true);
  const [queryValues] = useQuery(requiredParams);
  const orderDetailData = useSelector(
    ({ orderReducer: { orderDetail } }) => orderDetail
  );
  const match = useRouteMatch(ORDER_ROUTE);
  const dispatch = useDispatch();

  const resetBreadcrumbs = useBreadcrumbs([orderDetailData]);
  useEffect(() => {
    insights.chrome.appNavClick({ id: 'orders', secondaryNav: true });
    setIsFetching(true);
    Promise.all([
      dispatch(fetchPlatforms()),
      dispatch(fetchOrderDetails(queryValues))
    ]).then(() => setIsFetching(false));
    return () => resetBreadcrumbs();
  }, []);

  const {
    order,
    portfolioItem,
    platform,
    orderItem,
    portfolio
  } = orderDetailData;

  const unAvailable = () => {
    const notFound = [portfolioItem, platform, portfolio || {}].filter(
      ({ notFound }) => notFound
    );
    if (notFound.length === 0) {
      return null;
    }

    let notFoundObjects = [];
    if (portfolioItem.notFound) {
      notFoundObjects.push(portfolioItem.object);
    } else {
      notFoundObjects = notFound.map(({ object }) => object);
    }

    return (
      <Alert
        key="order-object-missing"
        variant="warning"
        isInline
        title={
          <FormattedMessage
            id={'order-detail-not-found'}
            defaultMessage={`The ${notFoundObjects.join(
              ', '
            )} for this order {count, plural, one {is} other {are}} not available`}
            values={{ count: notFoundObjects.length }}
          />
        }
      />
    );
  };

  const unavailableMessages = unAvailable();

  return (
    <OrderDetailStack className="bg-fill">
      <OrderDetailStackItem className="pf-u-p-lg">
        {isFetching ? (
          <OrderDetailToolbarPlaceholder />
        ) : (
          <Fragment>
            <Level className="pf-u-mb-md">
              <CatalogBreadcrumbs />
            </Level>
            <Level className="flex-no-wrap">
              {unavailableMessages ? (
                <UnAvailableAlertContainer>
                  {unavailableMessages}
                </UnAvailableAlertContainer>
              ) : (
                <Fragment>
                  <LevelItem>
                    <OrderDetailTitle
                      portfolioItemName={portfolioItem.name}
                      orderId={order.id}
                    />
                  </LevelItem>
                  <LevelItem className="flex-item-no-wrap">
                    <OrderToolbarActions
                      portfolioItemName={portfolioItem.name}
                      orderId={order.id}
                      state={order.state}
                    />
                  </LevelItem>
                </Fragment>
              )}
            </Level>
            {!unavailableMessages && (
              <Level>
                <OrderDetailInformation
                  portfolioItemId={portfolioItem.id}
                  sourceId={platform.id}
                  state={order.state}
                  jobName={portfolioItem.name}
                  orderRequestDate={order.created_at}
                  orderUpdateDate={orderItem?.updated_at}
                  owner={order.owner}
                />
              </Level>
            )}
          </Fragment>
        )}
      </OrderDetailStackItem>
      <StackItem className="pf-u-pt-xl pf-u-ml-lg pf-u-ml-0-on-md">
        <Split gutter="md" className="orders-nav-layout">
          <SplitItem className="order-detail-nav-container">
            <OrderDetailMenu isFetching={isFetching} baseUrl={match.url} />
          </SplitItem>
          <SplitItem className="order-detail-content-container">
            {isFetching ? (
              <Bullseye>
                <Spinner />
              </Bullseye>
            ) : (
              <Suspense fallback={<div></div>}>
                <Switch>
                  <Route
                    path={`${match.url}/approval`}
                    component={ApprovalRequests}
                  />
                  <Route path={`${match.url}/lifecycle`}>
                    <OrderLifecycle />
                  </Route>
                  <Route path={match.url} component={OrderDetails} />
                </Switch>
              </Suspense>
            )}
          </SplitItem>
        </Split>
      </StackItem>
    </OrderDetailStack>
  );
};

export default OrderDetail;
