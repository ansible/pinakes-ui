import React from 'react';
import {
  ToolbarGroup,
  ToolbarSection,
  ToolbarItem,
  TextContent,
  Text,
  TextVariants
} from '@patternfly/react-core';
import TopToolbar from '../../presentational-components/shared/top-toolbar';
import './orders.scss';

const OrdersToolbar = () => (
  <TopToolbar paddingBottom={ false }>
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

export default OrdersToolbar;
