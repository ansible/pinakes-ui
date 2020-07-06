import React from 'react';
import PropTypes from 'prop-types';

import { Title } from '@patternfly/react-core';

const OrderDetailTitle = ({ portfolioItemName, orderId }) => (
  <Title headingLevel="h1" size="3xl">
    {portfolioItemName} - Order # {orderId}
  </Title>
);

OrderDetailTitle.propTypes = {
  portfolioItemName: PropTypes.string.isRequired,
  orderId: PropTypes.string.isRequired
};

export default OrderDetailTitle;
