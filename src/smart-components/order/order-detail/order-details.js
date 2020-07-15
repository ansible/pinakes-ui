import React from 'react';
import { useSelector } from 'react-redux';
import {
  TextContent,
  Text,
  TextVariants,
  TextList,
  TextListVariants,
  TextListItem,
  TextListItemVariants
} from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components/components/cjs/DateFormat';

import ReactJsonView from 'react-json-view';
import { useIntl } from 'react-intl';
import statesMessages from '../../../messages/states.messages';
import labelMessages from '../../../messages/labels.messages';
import ordersMessages from '../../../messages/orders.messages';

const OrderDetails = () => {
  const { formatMessage } = useIntl();
  const {
    order,
    platform,
    progressMessages,
    portfolio,
    orderItem
  } = useSelector(({ orderReducer: { orderDetail } }) => orderDetail);

  return (
    <TextContent>
      <Text component={TextVariants.h2}>
        {formatMessage(ordersMessages.orderDetails)}
      </Text>
      <TextList component={TextListVariants.dl}>
        <TextListItem component={TextListItemVariants.dt}>
          {formatMessage(ordersMessages.orderID)}
        </TextListItem>
        <TextListItem component={TextListItemVariants.dd}>
          {order.id}
        </TextListItem>
        <TextListItem component={TextListItemVariants.dt}>
          {formatMessage(statesMessages.ordered)}
        </TextListItem>
        <TextListItem component={TextListItemVariants.dd}>
          <DateFormat date={order.created_at} variant="relative" />
        </TextListItem>
        <TextListItem component={TextListItemVariants.dt}>
          {formatMessage(labelMessages.portfolio)}
        </TextListItem>
        <TextListItem component={TextListItemVariants.dd}>
          {portfolio?.name}
        </TextListItem>
        <TextListItem component={TextListItemVariants.dt}>
          {formatMessage(labelMessages.platform)}
        </TextListItem>
        <TextListItem component={TextListItemVariants.dd}>
          {platform?.name || undefined}
        </TextListItem>
      </TextList>
      <hr className="pf-c-divider" />
      <Text component={TextVariants.h2}>
        {formatMessage(ordersMessages.orderParameters)}
      </Text>
      {orderItem?.service_parameters && (
        <ReactJsonView src={orderItem.service_parameters} />
      )}
      <Text component={TextVariants.h2}>
        {formatMessage(ordersMessages.orderProgressMessages)}
      </Text>
      {progressMessages?.data && <ReactJsonView src={progressMessages.data} />}
    </TextContent>
  );
};

export default OrderDetails;
