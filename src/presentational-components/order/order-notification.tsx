import React, { ComponentType, ReactElement, ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { clearNotifications } from '@redhat-cloud-services/frontend-components-notifications/redux';
import { ORDER_ROUTE } from '../../constants/routes';
import ordersMessages from '../../messages/orders.messages';
import useFormatMessage from '../../utilities/use-format-message';
import { Dispatch } from 'redux';

export interface OrderNotificationProps {
  id: string;
  dispatch: Dispatch;
  portfolioItemId: string;
  portfolioId: string;
  platformId: string;
  orderItemId: string;
}

const OrderNotification: ComponentType<OrderNotificationProps> = ({
  id,
  dispatch,
  portfolioItemId,
  portfolioId,
  platformId,
  orderItemId
}) => {
  const formatMessage = useFormatMessage();
  return formatMessage(ordersMessages.orderSuccess, {
    id,
    // eslint-disable-next-line react/display-name
    link: (chunks: ReactNode | ReactNode[]) => (
      <Link
        onClick={() => dispatch(clearNotifications())}
        to={{
          pathname: ORDER_ROUTE,
          search: `?order=${id}&order-item=${orderItemId}&portfolio-item=${portfolioItemId}&platform=${platformId}&portfolio=${portfolioId}`
        }}
      >
        {chunks}
      </Link>
    )
  }) as ReactElement;
};

export default OrderNotification;
