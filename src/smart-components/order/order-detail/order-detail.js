import React, { useEffect, useState, Fragment } from 'react';
import { Route, Switch, useRouteMatch, Redirect } from 'react-router-dom';
import {
  StackItem,
  Level,
  LevelItem,
  Split,
  SplitItem,
  Bullseye
} from '@patternfly/react-core';
import { Spinner } from '@redhat-cloud-services/frontend-components/components/Spinner';
import { useDispatch, useSelector } from 'react-redux';

import { fetchOrderDetails } from '../../../redux/actions/order-actions';
import OrderDetailTitle from './order-detail-title';
import OrderToolbarActions from './order-toolbar-actions';
import OrderDetailInformation from './order-detail-information';
import OrderDetailMenu from './order-detail-menu';
import OrderDetails from './order-details';
import ApprovalRequests from './approval-request';
import { OrderDetailToolbarPlaceholder } from '../../../presentational-components/shared/loader-placeholders';
import useQuery from '../../../utilities/use-query';
import OrderLifecycle from './order-lifecycle';
import CatalogBreadcrumbs from '../../common/catalog-breadcrumbs';
import useBreadcrumbs from '../../../utilities/use-breadcrumbs';
import { fetchPlatforms } from '../../../redux/actions/platform-actions';
import { ORDER_ROUTE, ORDERS_ROUTE } from '../../../constants/routes';
import {
  OrderDetailStack,
  OrderDetailStackItem
} from '../../../presentational-components/styled-components/orders';

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
    ({ orderReducer: { orderDetail } }) => orderDetail || {}
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

  if (!isFetching && Object.keys(orderDetailData).length === 0) {
    return <Redirect to={ORDERS_ROUTE} />;
  }

  const { order, portfolioItem, platform, orderItem } = orderDetailData;

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
            <Level>
              <LevelItem>
                <OrderDetailTitle
                  portfolioItemName={portfolioItem.name}
                  orderId={order.id}
                />
              </LevelItem>
              <LevelItem>
                <OrderToolbarActions
                  portfolioItemName={portfolioItem.name}
                  orderId={order.id}
                  state={order.state}
                />
              </LevelItem>
            </Level>
            <Level>
              <OrderDetailInformation
                portfolioItemId={portfolioItem.id}
                sourceId={platform.id}
                state={order.state}
                jobName={portfolioItem.name}
                orderRequestDate={order.created_at}
                orderUpdateDate={orderItem.updated_at}
                owner={order.owner}
              />
            </Level>
          </Fragment>
        )}
      </OrderDetailStackItem>
      <StackItem className="pf-u-pt-xl">
        <Split gutter="md" className="orders-nav-layout">
          <SplitItem className="order-detail-nav-cotainer">
            <OrderDetailMenu isFetching={isFetching} baseUrl={match.url} />
          </SplitItem>
          <SplitItem className="order-detail-content-cotainer">
            {isFetching ? (
              <Bullseye>
                <Spinner />
              </Bullseye>
            ) : (
              <Switch>
                <Route
                  path={`${match.url}/approval`}
                  component={ApprovalRequests}
                />
                <Route
                  path={`${match.url}/provision`}
                  render={() => <Redirect to={match.url} />}
                />
                <Route path={`${match.url}/lifecycle`}>
                  <OrderLifecycle />
                </Route>
                <Route path={match.url} component={OrderDetails} />
              </Switch>
            )}
          </SplitItem>
        </Split>
      </StackItem>
    </OrderDetailStack>
  );
};

export default OrderDetail;
