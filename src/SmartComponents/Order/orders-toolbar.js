import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, withRouter } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  Toolbar,
  ToolbarGroup,
  ToolbarSection,
  ToolbarItem,
  TextContent,
  Text,
  TextVariants
} from '@patternfly/react-core';
import './orders.scss';

const OrdersToolbar = ({ match: { path }}) => (
  <Toolbar className="pf-u-pt-xl pf-u-pr-xl pf-u-pl-xl order-toolbar-breadcrumbs" style={ { backgroundColor: '#FFFFFF' } }>
    <ToolbarSection aria-label="order-toolbar-breadcrumbs">
      <ToolbarGroup>
        <ToolbarItem>
          <Breadcrumb>
            <BreadcrumbItem isActive={ path === '/portfolios' }>
              <NavLink exact to="/portfolios">All Portfolios</NavLink>
            </BreadcrumbItem>
            <BreadcrumbItem isActive={ path === '/orders' }>
              <NavLink exact to="/orders">Orders</NavLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </ToolbarItem>
      </ToolbarGroup>
    </ToolbarSection>
    <ToolbarSection aria-label="order-toolbar-heading">
      <ToolbarGroup>
        <ToolbarItem>
          <TextContent>
            <Text component={ TextVariants.h1 }>Orders</Text>
          </TextContent>
        </ToolbarItem>
      </ToolbarGroup>
    </ToolbarSection>
  </Toolbar>
);

OrdersToolbar.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string.isRequired
  }).isRequired
};

export default withRouter(OrdersToolbar);
