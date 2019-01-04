import React from 'react';
import { Link } from 'react-router-dom';
import { ToolbarGroup, ToolbarItem, Button } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import spacingStyles from '@patternfly/patternfly-next/utilities/Spacing/spacing.css';
import '../../SmartComponents/Portfolio/portfolio.scss';

const OrderToolbarItem = () => (
  <ToolbarGroup className={ 'pf-u-ml-auto-on-xl' }>
    <ToolbarItem className={ css(spacingStyles.mrXL) }>
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
