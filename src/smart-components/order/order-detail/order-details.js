import React from 'react';
import { useSelector } from 'react-redux';
import { TextContent, Text, TextVariants, TextList, TextListVariants, TextListItem, TextListItemVariants } from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components';

import ReactJsonView from 'react-json-view';

const OrderDetails = () => {
  const {
    order,
    platform,
    progressMessages,
    portfolio,
    orderItem
  } = useSelector(({ orderReducer: { orderDetail }}) => orderDetail);

  return (
    <TextContent>
      <Text component={ TextVariants.h2 }>
          Order details
      </Text>
      <TextList component={ TextListVariants.dl }>
        <TextListItem component={ TextListItemVariants.dt }>Request ID</TextListItem>
        <TextListItem component={ TextListItemVariants.dd }>{ order.id }</TextListItem>
        <TextListItem component={ TextListItemVariants.dt }>Ordered</TextListItem>
        <TextListItem component={ TextListItemVariants.dd }><DateFormat date={ order.created_at } variant="relative"/></TextListItem>
        <TextListItem component={ TextListItemVariants.dt }>Portfolio</TextListItem>
        <TextListItem component={ TextListItemVariants.dd }>{ portfolio.name }</TextListItem>
        <TextListItem component={ TextListItemVariants.dt }>Platform</TextListItem>
        <TextListItem component={ TextListItemVariants.dd }>{ platform.name }</TextListItem>
      </TextList>
      <hr className="pf-c-divider" />
      <Text component={ TextVariants.h2 }>
        Order parameters
      </Text>
      <ReactJsonView src={ orderItem.service_parameters } />
      <Text component={ TextVariants.h2 }>
        Progress messages
      </Text>
      <ReactJsonView src={ progressMessages.data } />
    </TextContent>
  );
};

export default OrderDetails;
