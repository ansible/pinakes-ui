import React from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ExternalLinkAlt from '@patternfly/react-icons/dist/js/icons/external-link-alt-icon';

import useQuery from '../../../utilities/use-query';
import ordersMessages from '../../../messages/orders.messages';
import { Card, CardBody } from '@patternfly/react-core';
import useFormatMessage from '../../../utilities/use-format-message';
import { OrderDetail } from '../../../redux/reducers/order-reducer';
import { CatalogRootState } from '../../../types/redux';

const OrderLifecycle: React.ComponentType = () => {
  const formatMessage = useFormatMessage();
  const [, search] = useQuery([]);
  const { pathname } = useLocation();
  const orderDetailData = useSelector<CatalogRootState, OrderDetail>(
    ({ orderReducer: { orderDetail } }) => orderDetail || {}
  );
  const { order, orderItem } = orderDetailData;
  if (order.state !== 'Completed' && order.state !== 'Ordered') {
    return (
      <Redirect
        to={{
          pathname,
          search
        }}
      />
    );
  }

  return (
    <Card>
      <CardBody>
        <a
          href={orderItem?.external_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {formatMessage(ordersMessages.lifecycleLink)}
          &nbsp;
          <ExternalLinkAlt />
        </a>
      </CardBody>
    </Card>
  );
};

export default OrderLifecycle;
