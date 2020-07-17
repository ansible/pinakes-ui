import React from 'react';
import PropTypes from 'prop-types';

import { Title } from '@patternfly/react-core';
import { useIntl } from 'react-intl';
import ordersMessages from '../../../messages/orders.messages';

const OrderDetailTitle = ({ orderId }) => {
  const { formatMessage } = useIntl();
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
