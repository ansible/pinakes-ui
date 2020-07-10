import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { clearNotifications } from '@redhat-cloud-services/frontend-components-notifications/cjs/actions';
import { ORDER_ROUTE } from '../../constants/routes';
import { FormattedMessage } from 'react-intl';

const OrderNotification = ({
  id,
  dispatch,
  portfolioItemId,
  portfolioId,
  platformId,
  orderItemId
}) => (
  <FormattedMessage
    defaultMessage="You can track the progress of Order # {id} in your <link>Orders</link> page."
    id="notifications.order.success"
    values={{
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
    }}
  />
);

OrderNotification.propTypes = {
  id: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  portfolioItemId: PropTypes.string.isRequired,
  portfolioId: PropTypes.string.isRequired,
  platformId: PropTypes.string.isRequired,
  orderItemId: PropTypes.string.isRequired
};

export default OrderNotification;
