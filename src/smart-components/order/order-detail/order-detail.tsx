import React, { useEffect, useState, Fragment, Suspense, lazy } from 'react';
import { Route, Switch } from 'react-router-dom';
import {
  Level,
  LevelItem,
  Stack,
  StackItem,
  Bullseye,
  Alert
} from '@patternfly/react-core';
import { Spinner } from '@patternfly/react-core/dist/js/components/Spinner/Spinner';
import AngleLeftIcon from '@patternfly/react-icons/dist/js/icons/angle-left-icon';
import { useDispatch, useSelector } from 'react-redux';

import { fetchOrderDetails } from '../../../redux/actions/order-actions';
import { fetchOrderDetails as fetchOrderDetailsS } from '../../../redux/actions/order-actions-s';
import OrderDetailTitle from './order-detail-title';
import OrderToolbarActions from './order-toolbar-actions';
import OrderDetailInformation from './order-detail-information';
import OrderDetailMenu from './order-detail-menu';
import { OrderDetailToolbarPlaceholder } from '../../../presentational-components/shared/loader-placeholders';
import useQuery from '../../../utilities/use-query';
import useBreadcrumbs from '../../../utilities/use-breadcrumbs';
import { fetchPlatforms } from '../../../redux/actions/platform-actions';
import { fetchPlatforms as fetchPlatformsS } from '../../../redux/actions/platform-actions-s';
import UnAvailableAlertContainer from '../../../presentational-components/styled-components/unavailable-alert-container';
import ordersMessages from '../../../messages/orders.messages';
import CatalogLink from '../../common/catalog-link';
import useFormatMessage from '../../../utilities/use-format-message';
import { CatalogRootState } from '../../../types/redux';
import { OrderDetail as OrderDetailType } from '../../../redux/reducers/order-reducer';
import { GetOrderDetailParams } from '../../../helpers/order/order-helper';
import { ORDER_ROUTE } from '../../../constants/routes';

const ApprovalRequests = lazy(() =>
  import(/* webpackChunkName: "approval-request" */ './approval-request')
);
const OrderLifecycle = lazy(() =>
  import(/* webpackChunkName: "order-lifecycle" */ './order-lifecycle')
);
const OrderProvision = lazy(() =>
  import(/* webpackChunkName: "order-provision" */ './order-provision')
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

const OrderDetail: React.ComponentType = () => {
  const formatMessage = useFormatMessage();
  const [isFetching, setIsFetching] = useState(true);
  const [queryValues] = useQuery<GetOrderDetailParams>(requiredParams);
  const orderDetailData = useSelector<CatalogRootState, OrderDetailType>(
    ({ orderReducer: { orderDetail } }) => orderDetail
  );
  const dispatch = useDispatch();
  const resetBreadcrumbs = useBreadcrumbs([orderDetailData]);
  useEffect(() => {
    setIsFetching(true);
    Promise.all([
      dispatch(
        window.catalog?.standalone ? fetchPlatformsS() : fetchPlatforms()
      ),
      dispatch(
        window.catalog?.standalone
          ? fetchOrderDetailsS(queryValues)
          : fetchOrderDetails(queryValues)
      )
    ]).then(() => setIsFetching(false));
    return () => {
      if (typeof resetBreadcrumbs === 'function') {
        resetBreadcrumbs();
      }
    };
  }, []);

  const { order, portfolioItem, portfolio } = orderDetailData;

  const unAvailable = () => {
    const notFound = [portfolioItem, portfolio || {}].filter(
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
        title={formatMessage(ordersMessages.objectsNotFound, {
          objects: notFoundObjects.join(', '),
          count: notFoundObjects.length
        })}
      />
    );
  };

  const unavailableMessages = unAvailable();
  return (
    <Stack>
      <StackItem className="pf-u-p-lg global-primary-background">
        {isFetching ? (
          <OrderDetailToolbarPlaceholder />
        ) : (
          <Fragment>
            <Level className="pf-u-mb-md">
              <LevelItem>
                <AngleLeftIcon className="pf-u-mr-md" />
                <CatalogLink pathname="/orders">
                  {formatMessage(ordersMessages.backToOrders)}
                </CatalogLink>
              </LevelItem>
            </Level>
            <Level className="flex-no-wrap">
              {unavailableMessages ? (
                <UnAvailableAlertContainer>
                  {unavailableMessages}
                </UnAvailableAlertContainer>
              ) : (
                <Fragment>
                  <LevelItem>
                    <OrderDetailTitle orderId={order.id} />
                  </LevelItem>
                  <LevelItem>
                    <OrderToolbarActions
                      portfolioItemName={portfolioItem.name}
                      orderId={order.id}
                      state={order.state}
                      portfolioItemId={portfolioItem.id}
                      portfolioId={portfolio.id}
                      sourceId={'1'}
                      orderable={portfolioItem.metadata?.orderable || false}
                    />
                  </LevelItem>
                </Fragment>
              )}
            </Level>
            {!unavailableMessages && (
              <OrderDetailInformation
                portfolioItemId={portfolioItem.id}
                portfolioId={portfolio.id}
                sourceId={'1'}
                jobName={portfolioItem.name}
                state={order.state}
              />
            )}
          </Fragment>
        )}
      </StackItem>
      <StackItem>
        <Stack hasGutter>
          <StackItem className="global-primary-background">
            <OrderDetailMenu isFetching={isFetching} baseUrl={ORDER_ROUTE} />
          </StackItem>
          <StackItem className="pf-u-pl-lg pf-u-pr-lg pf-u-mb-lg">
            {isFetching ? (
              <Bullseye>
                <Spinner />
              </Bullseye>
            ) : (
              <Suspense fallback={<div></div>}>
                <Switch>
                  <Route
                    path={`${ORDER_ROUTE}/approval`}
                    component={ApprovalRequests}
                  />
                  <Route path={`${ORDER_ROUTE}/provision`}>
                    <OrderProvision />
                  </Route>
                  <Route path={`${ORDER_ROUTE}/lifecycle`}>
                    <OrderLifecycle />
                  </Route>
                  <Route path={ORDER_ROUTE} component={OrderDetails} />
                </Switch>
              </Suspense>
            )}
          </StackItem>
        </Stack>
      </StackItem>
    </Stack>
  );
};

export default OrderDetail;
