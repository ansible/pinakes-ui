import React, { useEffect } from 'react';
import {
  Route,
  Link,
  Switch,
  useLocation,
  useRouteMatch
} from 'react-router-dom';
import { Stack, StackItem } from '@patternfly/react-core';
import { useDispatch } from 'react-redux';

import { fetchOrderDetails } from '../../../redux/actions/order-actions';

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
  const [ queryValues, search ] = useQuery();
  const match = useRouteMatch('/orders/:id');
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchOrderDetails({
      order: match.params.id,
      ...queryValues
    }));
  }, []);
  return (
    <Stack className="orders bg-fill pf-u-p-xl pf-u-pt-md pf-u-pb-md">
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
