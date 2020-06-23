import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { clearNotifications } from '@redhat-cloud-services/frontend-components-notifications/cjs/actions';
import { ORDERS_ROUTE } from '../../constants/routes';

const OrderNotification = ({ id, dispatch }) => (
  <Fragment>
    You can track the progress of Order # {id} in your{' '}
    <Link onClick={() => dispatch(clearNotifications())} to={ORDERS_ROUTE}>
      Orders
    </Link>{' '}
    page.
  </Fragment>
);

OrderNotification.propTypes = {
  id: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired
};

export default OrderNotification;
