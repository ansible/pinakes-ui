import React from 'react';
import PropTypes from 'prop-types';

import { Title } from '@patternfly/react-core';
import { useIntl } from 'react-intl';
import ordersMessages from '../../../messages/orders.messages';

const OrderDetailTitle = ({ portfolioItemName, orderId }) => {
  const { formatMessage } = useIntl();
  return (
    <Title headingLevel="h1" size="3xl">
      {formatMessage(ordersMessages.compositeTitle, {
        id: orderId,
        name: portfolioItemName
      })}
    </Title>
  );
};

OrderDetailTitle.propTypes = {
  portfolioItemName: PropTypes.string.isRequired,
  orderId: PropTypes.string.isRequired
};

export default OrderDetailTitle;
