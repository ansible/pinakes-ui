import React, { lazy } from 'react';
import { Switch, Route } from 'react-router-dom';
import { ADD_ORDER_PROCESS_ROUTE } from '../../constants/routes';

const AddOrderProcessModal = lazy(() =>
  import(
    /* webpackChunkName: "add-order-process" */ '../order-process/add-order-process-modal'
  )
);

const OrderProcessRoutes: React.ComponentType = () => {
  return (
    <div>
      <Switch>
        <Route path={ADD_ORDER_PROCESS_ROUTE}>
          <AddOrderProcessModal />
        </Route>
      </Switch>
    </div>
  );
};

export default OrderProcessRoutes;
