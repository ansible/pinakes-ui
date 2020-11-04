import React, { ReactNode, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Bullseye,
  Card,
  CardBody,
  Flex,
  Label,
  Spinner,
  Text,
  TextContent,
  TextVariants,
  Title
} from '@patternfly/react-core';

import {
  Table,
  TableBody,
  TableHeader,
  TableText
} from '@patternfly/react-table';

import InfoIcon from '@patternfly/react-icons/dist/js/icons/info-icon';
import { fetchOrderProvision } from '../../../redux/actions/order-actions';
import ordersMessages from '../../../messages/orders.messages';
import useFormatMessage from '../../../utilities/use-format-message';
import { CatalogRootState } from '../../../types/redux';
import {
  OrderDetail,
  OrderProvisionType
} from '../../../redux/reducers/order-reducer';
import statesMessages, {
  getTranslatableState
} from '../../../messages/states.messages';
import orderStatusMapper from '../order-status-mapper';
import {
  OrderItem,
  OrderItemStateEnum
} from '@redhat-cloud-services/catalog-client';
import { FormatMessage } from '../../../types/common-types';
import { DateFormat } from '@redhat-cloud-services/frontend-components/components/cjs/DateFormat';

/**
 * We are using type conversion of **request as StringObject** because the generated client does not have correct states listed
 * Probably a discrepancy inside the OpenAPI spec
 */

const isEmpty = (orderProvision?: OrderProvisionType) =>
  !orderProvision ||
  !orderProvision.orderItems ||
  orderProvision.orderItems.length === 0;

const OrderProvision: React.ComponentType = () => {
  const formatMessage = useFormatMessage();
  const [isFetching, setIsFetching] = useState(true);
  const dispatch = useDispatch();
  const { order } = useSelector<CatalogRootState, OrderDetail>(
    ({ orderReducer: { orderDetail } }) => orderDetail
  );

  const orderProvision = useSelector<CatalogRootState, OrderProvisionType>(
    ({ orderReducer: { orderProvision } }) => orderProvision
  );
  useEffect(() => {
    setIsFetching(true);
    Promise.all([dispatch(fetchOrderProvision(order.id))]).then(() =>
      setIsFetching(false)
    );
  }, []);

  if (order.state === 'Failed' && isEmpty(orderProvision)) {
    return (
      <Bullseye id="no-order-provision">
        <Flex direction={{ default: 'column' }} grow={{ default: 'grow' }}>
          <Bullseye>
            <InfoIcon size="xl" />
          </Bullseye>
          <Bullseye>
            <Title headingLevel="h1" size="2xl">
              {formatMessage(ordersMessages.noOrderProvision)}
            </Title>
          </Bullseye>
        </Flex>
      </Bullseye>
    );
  }

  const capitalize = (str: any) => str?.charAt(0).toUpperCase() + str?.slice(1);

  const columns = [
    { title: 'Updated' },
    { title: 'Type' },
    { title: 'Activity' },
    { title: 'State' }
  ];

  const createOrderItemRow = (
    item: OrderItem,
    orderItemName: string,
    formatMessage: FormatMessage
  ): { title: ReactNode }[] => {
    const translatableState = getTranslatableState(
      item.state as OrderItemStateEnum
    );
    return [
      {
        title: (
          <Text className="pf-u-mb-0" component={TextVariants.small}>
            <DateFormat date={item.updated_at} type="exact" />
          </Text>
        )
      },
      {
        title: (
          <Text className="pf-u-mb-0" component={TextVariants.small}>
            <TableText>{capitalize(item.process_scope)}</TableText>
          </Text>
        )
      },
      {
        title: (
          <Text className="pf-u-mb-0" component={TextVariants.small}>
            <TableText>{orderItemName}</TableText>
          </Text>
        )
      },

      {
        title: (
          <TableText>
            <Label
              {...orderStatusMapper[
                item.state as keyof typeof orderStatusMapper
              ]}
              variant="outline"
            >
              {formatMessage(statesMessages[translatableState])}
            </Label>
          </TableText>
        )
      }
    ];
  };

  const rows = orderProvision.orderItems.map((item) => {
    //const { orderProgressMessages } = getOrderProgressMessage(item);
    const orderItemName = `Order item ${item.id}`;
    const testOrder = createOrderItemRow(item, orderItemName, formatMessage);
    console.log('Debug - testOrder:', testOrder);
    return testOrder;
  });

  console.log('Debug - orderProvision.orderItems, rows: ', rows);
  return (
    <TextContent>
      {isFetching ? (
        <Bullseye>
          <Flex direction={{ default: 'column' }} grow={{ default: 'grow' }}>
            <Bullseye id="fetching-order-provision">
              <Title headingLevel="h1" size="xl">
                {formatMessage(ordersMessages.fetchingOrderProvision)}
              </Title>
            </Bullseye>
            <Bullseye>
              <Spinner size="xl" />
            </Bullseye>
          </Flex>
        </Bullseye>
      ) : (
        <Card>
          <CardBody>
            <Text className="pf-u-mb-md" component={TextVariants.h2}>
              {formatMessage(ordersMessages.activity)}
            </Text>
            <Table
              aria-label="Order provisioning activity"
              cells={columns}
              rows={rows}
            >
              <TableHeader />
              <TableBody />
            </Table>
          </CardBody>
        </Card>
      )}
    </TextContent>
  );
};

export default OrderProvision;
