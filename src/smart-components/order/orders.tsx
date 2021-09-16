import React, { useEffect } from 'react';
import { Stack } from '@patternfly/react-core';

import ToolbarRenderer from '../../toolbar/toolbar-renderer';
import createOrdersToolbarSchema from '../../toolbar/schemas/orders-toolbar.schema';
import OrdersList from './orders-list';

const Orders: React.ComponentType = () => {
  return (
    <Stack>
      <ToolbarRenderer schema={createOrdersToolbarSchema()} />
      <OrdersList />
    </Stack>
  );
};

export default Orders;
