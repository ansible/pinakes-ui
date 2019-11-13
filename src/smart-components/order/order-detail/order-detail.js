import React from 'react';
import {
  Route,
  Link,
  Switch,
  useLocation,
  useRouteMatch
} from 'react-router-dom';
import { Stack, StackItem } from '@patternfly/react-core';

function useQuery() {
  const { search } = useLocation();
  return [ new URLSearchParams(search), search ];
}

const OrderDetail = () => {
  const [ query, search ] = useQuery();
  const match = useRouteMatch('/orders/:id');
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
