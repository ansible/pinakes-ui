import React from 'react';
import { Redirect, useRouteMatch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ExternalLinkAlt from '@patternfly/react-icons/dist/js/icons/external-link-alt-icon';

import useQuery from '../../../utilities/use-query';
import { ORDER_ROUTE } from '../../../constants/routes';
import ordersMessages from '../../../messages/orders.messages';
import { Card, CardBody } from '@patternfly/react-core';
import useFormatMessage from '../../../utilities/use-format-message';

const OrderLifecycle = () => {
  const formatMessage = useFormatMessage();
  const [, search] = useQuery([]);
  const { url } = useRouteMatch(ORDER_ROUTE);
  const orderDetailData = useSelector(
    ({ orderReducer: { orderDetail } }) => orderDetail || {}
  );
  const { order, orderItem } = orderDetailData;
  if (order.state !== 'Completed' && order.state !== 'Ordered') {
    return (
      <Redirect
        to={{
          pathname: url,
          search
        }}
      />
    );
  }

  return (
    <Card>
      <CardBody>
        <a
          href={orderItem.external_url}
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
