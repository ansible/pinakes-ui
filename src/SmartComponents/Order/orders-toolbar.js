import React from 'react';
import PropTypes from 'prop-types';
import {
  ToolbarGroup,
  ToolbarSection,
  ToolbarItem,
  TextContent,
  Text,
  TextVariants
} from '@patternfly/react-core';
import TopToolbar from '../../PresentationalComponents/Shared/top-toolbar';
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

OrdersToolbar.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string.isRequired
  }).isRequired
};

export default OrdersToolbar;
