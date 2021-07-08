import React from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ExternalLinkAlt from '@patternfly/react-icons/dist/js/icons/external-link-alt-icon';

import useQuery from '../../../utilities/use-query';
import ordersMessages from '../../../messages/orders.messages';
import {
  Card,
  CardBody,
  Stack,
  StackItem,
  Text,
  TextContent,
  TextVariants
} from '@patternfly/react-core';
import useFormatMessage from '../../../utilities/use-format-message';
import { OrderDetail } from '../../../redux/reducers/order-reducer';
import { CatalogRootState } from '../../../types/redux';
import ReactJsonView from 'react-json-view';
import { stateToDisplay } from '../../../helpers/shared/helpers';

const OrderLifecycle: React.ComponentType = () => {
  const formatMessage = useFormatMessage();
  const [, search] = useQuery([]);
  const { pathname } = useLocation();
  const orderDetailData = useSelector<CatalogRootState, OrderDetail>(
    ({ orderReducer: { orderDetail } }) => orderDetail || {}
  );
  const { order, orderItem } = orderDetailData;
  if (stateToDisplay(order.state)) {
    return (
      <Redirect
        to={{
          pathname,
          search
        }}
      />
    );
  }

  return (
    <Stack hasGutter>
      {orderItem?.artifacts && Object.keys(orderItem.artifacts)?.length > 0 && (
        <StackItem>
          <Card>
            <CardBody>
              <TextContent>
                <Text className="pf-u-mb-md" component={TextVariants.h2}>
                  {formatMessage(ordersMessages.artifacts)}
                </Text>
              </TextContent>
              <ReactJsonView src={orderItem.artifacts} />
            </CardBody>
          </Card>
        </StackItem>
      )}
    </Stack>
  );
};

export default OrderLifecycle;
