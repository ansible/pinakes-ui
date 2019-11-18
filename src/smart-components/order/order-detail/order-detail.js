import React, { useEffect, useState, Fragment } from 'react';
import { Route, Switch, useLocation, useRouteMatch, Redirect } from 'react-router-dom';
import { Stack, StackItem, Level, LevelItem, Split, SplitItem, Bullseye } from '@patternfly/react-core';
import { Spinner } from '@redhat-cloud-services/frontend-components';
import { useDispatch, useSelector } from 'react-redux';

import { fetchOrderDetails } from '../../../redux/actions/order-actions';
import OrderDetailTitle from './order-detail-title';
import OrderToolbarActions from './order-toolbar-actions';
import OrderDetailInformation from './order-detail-information';
import OrderDetailMenu from './order-detail-menu';
import OrderDetails from './order-details';
import ApprovalRequests from './approval-request';
import { OrderDetailToolbarPlaceholder } from '../../../presentational-components/shared/loader-placeholders';

const requiredParams = [ 'order-item', 'portfolio-item', 'platform', 'portfolio' ];

const useQuery = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  return [ requiredParams.reduce((acc, curr) => ({
    ...acc,
    [curr]: query.get(curr)
  }), {}), search, query ];
};

const OrderDetail = () => {
  const [ isFetching, setIsFetching ] = useState(true);
  const [ queryValues, search ] = useQuery();
  const orderDetailData = useSelector(({ orderReducer: { orderDetail }}) => orderDetail || {});
  const match = useRouteMatch('/orders/:id');
  const dispatch = useDispatch();
  useEffect(() => {
    setIsFetching(true);
    dispatch(fetchOrderDetails({
      order: match.params.id,
      ...queryValues
    })).then(() => setIsFetching(false));
  }, []);

  if (!isFetching && Object.keys(orderDetailData).length === 0) {
    return <Redirect to="/orders" />;
  }

  const {
    order,
    portfolioItem,
    platform
  } = orderDetailData;

  return (
    <Stack className="orders bg-fill">
      <StackItem className="orders separator pf-u-p-xl pf-u-pt-md pf-u-pb-0">
        { isFetching
          ? <OrderDetailToolbarPlaceholder/>
          : (
            <Fragment>
              <Level>
                <LevelItem>
                  <OrderDetailTitle portfolioItemName={ portfolioItem.name } orderId={ order.id } />
                </LevelItem>
                <LevelItem>
                  <OrderToolbarActions portfolioItemName={ portfolioItem.name } orderId={ order.id } state={ order.state } />
                </LevelItem>
              </Level>
              <Level>
                <OrderDetailInformation
                  portfolioItemId={ portfolioItem.id }
                  sourceType={ platform.source_type_id }
                  state={ order.state }
                  jobName={ portfolioItem.name }
                  orderRequestDate={ order.created_at }
                  orderUpdateDate={ portfolioItem.updated_at }
                  owner={ order.owner }
                />
              </Level>
            </Fragment>
          ) }
      </StackItem>
      <StackItem className="pf-u-pt-xl">
        <Split gutter="md" className="orders-nav-layout">
          <SplitItem className="order-detail-nav-cotainer">
            <OrderDetailMenu isFetching={ isFetching } baseUrl={ match.url } search={ search } />
          </SplitItem>
          <SplitItem className="order-detail-content-cotainer">
            { isFetching ? (
              <Bullseye>
                <Spinner />
              </Bullseye>
            ) : (
              <Switch>
                <Route path={ `${match.url}/approval` } component={ ApprovalRequests } />
                <Route path={ `${match.url}/provision` } render={ () => (
                  <div>
                    provision
                  </div>
                ) } />
                <Route path={ `${match.url}/lifecycle` } render={ () => (
                  <div>
                    lifecycle
                  </div>
                ) }  />
                <Route path={ match.url } component={ OrderDetails }/>
              </Switch>
            ) }
          </SplitItem>
        </Split>
      </StackItem>
    </Stack>
  );
};

export default OrderDetail;
