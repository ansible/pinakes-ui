import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid, GridItem } from '@patternfly/react-core';
import { Section } from '@redhat-cloud-services/frontend-components';

import ToolbarRenderer from '../../toolbar/toolbar-renderer';
import createOrdersToolbarSchema from '../../toolbar/schemas/orders-toolbar.schema';

import './orders.scss';
import OrdersList from './orders-list';

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
            <OrdersList type="closedOrders"/>
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
