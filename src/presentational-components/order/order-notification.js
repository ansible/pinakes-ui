import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { clearNotifications } from '@redhat-cloud-services/frontend-components-notifications/cjs/actions';
import { ORDER_ROUTE } from '../../constants/routes';
import ordersMessages from '../../messages/orders.messages';
import useFormatMessage from '../../utilities/use-format-message';

const OrderNotification = ({
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
    link: (chunks) => (
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
  });
};

OrderNotification.propTypes = {
  id: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  portfolioItemId: PropTypes.string.isRequired,
  portfolioId: PropTypes.string.isRequired,
  platformId: PropTypes.string.isRequired,
  orderItemId: PropTypes.string.isRequired
};

export default OrderNotification;
