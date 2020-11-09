import React from 'react';
import PropTypes from 'prop-types';

import {
  TextContent,
  Text,
  TextVariants,
  Grid,
  Card,
  CardBody,
  GridItem,
  Stack,
  StackItem
} from '@patternfly/react-core';

import ReactJsonView from 'react-json-view';
import ordersMessages from '../../../messages/orders.messages';
import { FormatMessage } from '../../../types/common-types';
import {
  OrderItem,
  ProgressMessage
} from '@redhat-cloud-services/catalog-client';

export interface ProgressMessagesParams {
  orderItem: OrderItem;
  progressMessages: ProgressMessage[];
  formatMessage: FormatMessage;
}

const ProgressMessages: React.ComponentType<ProgressMessagesParams> = ({
  orderItem,
  progressMessages,
  formatMessage
}) => {
  return (
    <Grid hasGutter>
      <GridItem md={12} lg={6} xl={4}>
        <Stack hasGutter>
          <StackItem>
            <Card>
              <CardBody>
                <TextContent>
                  <Text className="pf-u-mb-md" component={TextVariants.h2}>
                    {formatMessage(ordersMessages.orderItemParameters)}
                  </Text>
                </TextContent>
                {orderItem?.service_parameters && (
                  <ReactJsonView src={orderItem.service_parameters} />
                )}
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
            {<ReactJsonView src={progressMessages} />}
          </CardBody>
        </Card>
      </GridItem>
    </Grid>
  );
};

ProgressMessages.propTypes = {
  orderItem: PropTypes.object,
  progressMessages: PropTypes.object,
  formatMessage: PropTypes.object
};

export default ProgressMessages;
