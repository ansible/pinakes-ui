import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { clearNotifications } from '@redhat-cloud-services/frontend-components-notifications/cjs/actions';
import { ORDER_ROUTE } from '../../constants/routes';

const OrderNotification = ({
  id,
  dispatch,
  portfolioItemId,
  portfolioId,
  platformId,
  orderItemId
}) => (
  <Fragment>
    You can track the progress of Order # {id} in your{' '}
    <Link
      onClick={() => dispatch(clearNotifications())}
      to={{
        pathname: ORDER_ROUTE,
        search: `?order=${id}&order-item=${orderItemId}&portfolio-item=${portfolioItemId}&platform=${platformId}&portfolio=${portfolioId}`
      }}
    >
      Orders
    </Link>{' '}
    page.
  </Fragment>
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
