import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid, GridItem } from '@patternfly/react-core';
import { Section } from '@redhat-cloud-services/frontend-components';
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
    <Fragment>
      <ToolbarRenderer schema={ createOrdersToolbarSchema() } />
      <Section type="content">
        <Grid gutter="md">
          <GridItem>
            <Switch>
              <Route exact path="/orders/:id" component={ OrderDetail } />
              <Route exact path="/orders" component={ OrdersList } />
            </Switch>
          </GridItem>
        </Grid>
      </Section>
    </Fragment>
  );
};

Orders.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  location: PropTypes.shape({ pathname: PropTypes.string.isRequired }).isRequired
};

export default Orders;
