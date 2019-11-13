import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Stack } from '@patternfly/react-core';
import { Switch, Route } from 'react-router-dom';

import ToolbarRenderer from '../../toolbar/toolbar-renderer';
import createOrdersToolbarSchema from '../../toolbar/schemas/orders-toolbar.schema';

import OrdersList from './orders-list';
import OrderDetail from './order-detail/order-detail';

const Orders = () => {
  useEffect(() => {
    insights.chrome.appNavClick({ id: 'orders', secondaryNav: true });
  }, []);

  return (
    <Stack>
      <ToolbarRenderer schema={ createOrdersToolbarSchema() } />
      <Switch>
        <Route path="/orders/:id" component={ OrderDetail } />
        <Route path="/orders" component={ OrdersList } />
      </Switch>
    </Stack>
  );
};

Orders.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  location: PropTypes.shape({ pathname: PropTypes.string.isRequired }).isRequired
};

export default Orders;
