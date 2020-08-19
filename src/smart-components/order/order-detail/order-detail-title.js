import React from 'react';
import PropTypes from 'prop-types';

import { Title } from '@patternfly/react-core';
import ordersMessages from '../../../messages/orders.messages';
import useFormatMessage from '../../../utilities/use-format-message';

const OrderDetailTitle = ({ orderId }) => {
  const formatMessage = useFormatMessage();
  return (
    <Title headingLevel="h1" size="3xl">
      {formatMessage(ordersMessages.detailTitle, {
        id: orderId
      })}
    </Title>
  );
};

OrderDetailTitle.propTypes = {
  orderId: PropTypes.string.isRequired
};

export default OrderDetailTitle;
