import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { clearNotifications } from '@redhat-cloud-services/frontend-components-notifications';

const OrderNotification = ({ id, dispatch }) => (
  <p>
    You can track the progress of Order # { id } in your <Link onClick={ () => dispatch(clearNotifications()) } to="/orders">Orders</Link> page.
  </p>
);

OrderNotification.propTypes = {
  id: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired
};

export default OrderNotification;
