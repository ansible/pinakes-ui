import React from 'react';
import { useSelector } from 'react-redux';
import {
  TextContent,
  Text,
  TextVariants,
  TextList,
  TextListVariants,
  TextListItem,
  TextListItemVariants,
  Grid,
  Card,
  CardBody,
  GridItem,
  Stack,
  StackItem
} from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';

import ReactJsonView from 'react-json-view';
import statesMessages from '../../../messages/states.messages';
import labelMessages from '../../../messages/labels.messages';
import ordersMessages from '../../../messages/orders.messages';
import useFormatMessage from '../../../utilities/use-format-message';
import { OrderDetail } from '../../../redux/reducers/order-reducer';
import { CatalogRootState } from '../../../types/redux';

const OrderDetails: React.ComponentType = () => {
  const formatMessage = useFormatMessage();
  const {
    order,
    platform,
    progressMessages,
    portfolio,
    orderItem
  } = useSelector<CatalogRootState, OrderDetail>(
    ({ orderReducer: { orderDetail } }) => orderDetail
  );

  return (
    <Grid hasGutter>
      <GridItem md={12} lg={6} xl={4}>
        <Stack hasGutter>
          <StackItem>
            <Card>
              <CardBody>
                <TextContent>
                  <Text className="pf-u-mb-md" component={TextVariants.h2}>
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
                </TextContent>
              </CardBody>
            </Card>
          </StackItem>
          <StackItem>
            <Card>
              <CardBody>
                <TextContent>
                  <Text className="pf-u-mb-md" component={TextVariants.h2}>
                    {formatMessage(ordersMessages.orderParameters)}
                  </Text>
                </TextContent>
                <TextContent className="overflow-wrap">
                  {orderItem?.service_parameters && (
                    <ReactJsonView src={orderItem.service_parameters} />
                  )}
                </TextContent>
              </CardBody>
            </Card>
          </StackItem>
        </Stack>
      </GridItem>
      <GridItem md={12} lg={6} xl={8}>
        <Card>
          <CardBody>
            <TextContent>
              <Text className="pf-u-mb-md" component={TextVariants.h2}>
                {formatMessage(ordersMessages.orderProgressMessages)}
              </Text>
            </TextContent>
            {progressMessages?.data && (
              <ReactJsonView src={progressMessages.data} />
            )}
          </CardBody>
        </Card>
      </GridItem>
    </Grid>
  );
};

export default OrderDetails;
