import React, { useEffect, useState } from 'react';
import {
  Route,
  Link,
  Switch,
  useLocation,
  useRouteMatch
} from 'react-router-dom';
import { Stack, StackItem, Level, LevelItem } from '@patternfly/react-core';
import { useDispatch, useSelector } from 'react-redux';

import { fetchOrderDetails } from '../../../redux/actions/order-actions';
import OrderDetailTitle from './order-detail-title';
import OrderToolbarActions from './order-toolbar-actions';
import OrderDetailInformation from './order-detail-information';

const requiredParams = [ 'order-item', 'portfolio-item', 'platform' ];

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
  const orderDetailData = useSelector(({ orderReducer: { orderDetail }}) => orderDetail);
  const match = useRouteMatch('/orders/:id');
  const dispatch = useDispatch();
  useEffect(() => {
    setIsFetching(true);
    dispatch(fetchOrderDetails({
      order: match.params.id,
      ...queryValues
    })).then(() => setIsFetching(false));
  }, []);
  if (isFetching) {
    return (
      <div>Loading</div>
    );
  }

  const {
    order,
    portfolioItem,
    platform
  } = orderDetailData;

  return (
    <Stack className="orders bg-fill">
      <StackItem className="orders separator pf-u-p-xl pf-u-pt-md pf-u-pb-0">
        <Level>
          <LevelItem>
            <OrderDetailTitle portfolioItemName={ portfolioItem.name } orderId={ order.id } />
          </LevelItem>
          <LevelItem>
            <OrderToolbarActions state={ order.state } />
          </LevelItem>
        </Level>
        <Level>
          <OrderDetailInformation
            portfolioItemId={ portfolioItem.id }
            sourceType={ platform.source_type_id }
            state={ order.state }
            platformName={ platform.name }
            orderRequestDate={ order.order_request_sent_at }
            orderUpdateDate={ portfolioItem.updated_at }
            owner={ order.owner }
          />
        </Level>
      </StackItem>
      <StackItem>
        <Link to={ {
          pathname: `${match.url}/foo`,
          search
        } }
        >
            There will be dragons
        </Link>
        <Switch>
          <Route path={ `${match.url}/foo` } render={ () => {
            return <div>Nested</div>;
          } } />
        </Switch>
      </StackItem>
    </Stack>
  );
};

export default OrderDetail;
