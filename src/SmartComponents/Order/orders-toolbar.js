import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, withRouter } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  ToolbarGroup,
  ToolbarSection,
  ToolbarItem,
  TextContent,
  Text,
  TextVariants
} from '@patternfly/react-core';
import TopToolbar from '../../PresentationalComponents/Shared/top-toolbar';
import './orders.scss';

const OrdersToolbar = ({ match: { path }}) => (
  <TopToolbar>
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
  </TopToolbar>
);

OrdersToolbar.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string.isRequired
  }).isRequired
};

export default withRouter(OrdersToolbar);
