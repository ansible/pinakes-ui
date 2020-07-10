import React from 'react';
import PropTypes from 'prop-types';

import { Title } from '@patternfly/react-core';
import { FormattedMessage } from 'react-intl';

const OrderDetailTitle = ({ portfolioItemName, orderId }) => (
  <Title headingLevel="h1" size="3xl">
    <FormattedMessage
      id="orders.order.detail.title"
      defaultMessage="{portfolioItemName} - Order # {orderId}"
      values={{
        portfolioItemName,
        orderId
      }}
    />
  </Title>
);

OrderDetailTitle.propTypes = {
  portfolioItemName: PropTypes.string.isRequired,
  orderId: PropTypes.string.isRequired
};

export default OrderDetailTitle;
