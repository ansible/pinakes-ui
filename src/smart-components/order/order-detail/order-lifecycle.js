import React from 'react';
import { Redirect, useRouteMatch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ExternalLinkAlt from '@patternfly/react-icons/dist/js/icons/external-link-alt-icon';

import useQuery from '../../../utilities/use-query';
import { ORDER_ROUTE } from '../../../constants/routes';
import { useIntl } from 'react-intl';
import ordersMessages from '../../../messages/orders.messages';

const OrderLifecycle = () => {
  const { formatMessage } = useIntl();
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
    <div>
      <a
        href={orderItem.external_url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {formatMessage(ordersMessages.lifecycleLink)}
        &nbsp;
        <ExternalLinkAlt />
      </a>
    </div>
  );
};

export default OrderLifecycle;
