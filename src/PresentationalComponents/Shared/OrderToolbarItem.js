import React from 'react';
import { Link } from 'react-router-dom';
import { ToolbarGroup, ToolbarItem, Button } from '@patternfly/react-core';
import '../../SmartComponents/Portfolio/portfolio.scss';

const styles = {
  alignSelf: 'baseline'
};

const OrderToolbarItem = () => (
  <ToolbarGroup className={ 'pf-u-ml-auto-on-xl' } style={ styles }>
    <ToolbarItem>
      <Link key="show_order-list" to={ `/orders` }>
        <Button variant="link" id="ordersButton">
          <i className="fas fa-shopping-cart" aria-hidden="true"></i>
          Orders
        </Button>
      </Link>
    </ToolbarItem>
  </ToolbarGroup>
);

export default OrderToolbarItem;
