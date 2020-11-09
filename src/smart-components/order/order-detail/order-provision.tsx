import React, { useEffect, useState } from 'react';
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
  expandable,
  ICell,
  IExtraData,
  IRowData,
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
  OrderItemStateEnum,
  ProgressMessage
} from '@redhat-cloud-services/catalog-client';
import { FormatMessage } from '../../../types/common-types';
import { DateFormat } from '@redhat-cloud-services/frontend-components/components/cjs/DateFormat';
import ProgressMessages from './progress-messages';

export interface RowType {
  orderItem: OrderItem;
  progressMessages: ProgressMessage[];
  formatMessage: FormatMessage;
}

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

  const columns: Array<ICell> = [
    { title: 'Updated', cellFormatters: [expandable] },
    { title: 'Type' },
    { title: 'Activity' },
    { title: 'State' }
  ];

  const createOrderItemMainRow = (
    item: OrderItem,
    orderItemName: string,
    formatMessage: FormatMessage
  ): {
    isOpen: boolean;
    cells: (
      | { title: any }
      | { title: any }
      | { title: any }
      | { title: any }
    )[];
  } => {
    const translatableState = getTranslatableState(
      item.state as OrderItemStateEnum
    );
    return {
      isOpen: false,
      cells: [
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
      ]
    };
  };

  const createOrderItemExpandedRow = (
    item: OrderItem,
    progressMessages: ProgressMessage[],
    formatMessage: FormatMessage,
    key: number
  ): { parent: number; cells: { title: any }[] } => {
    return {
      parent: key * 2,
      cells: [
        {
          title: (
            <ProgressMessages
              orderItem={item}
              progressMessages={progressMessages}
              formatMessage={formatMessage}
            />
          )
        }
      ]
    };
  };

  const createRows = (): {
    id?: string;
    isOpen?: boolean;
    parent?: number;
    cells: { title: any }[];
  }[] =>
    orderProvision.orderItems.reduce(
      (
        acc: {
          id?: string;
          isOpen?: boolean;
          parent?: number;
          cells: { title: any }[];
        }[],
        item: OrderItem,
        key
      ) => {
        return [
          ...acc,
          createOrderItemMainRow(item, `Order item ${item.id}`, formatMessage),
          createOrderItemExpandedRow(
            item,
            Object.values(orderProvision.progressMessages).filter(
              (message) => message.order_item_id === item.id
            ),
            formatMessage,
            key
          )
        ];
      },
      []
    );

  const [rows, setRows] = useState<
    {
      id?: string;
      isOpen?: boolean;
      parent?: number;
      cells: { title: any }[];
    }[]
  >(createRows());

  useEffect((): void => {
    console.log('Debug - setRows: rows', rows);
    setRows(createRows());
  }, [orderProvision.orderItems]);

  const setOpen = (
    data: {
      id?: string;
      isOpen?: boolean;
      parent?: number;
      cells: { title: any }[];
    }[],
    itemId: string
  ) =>
    data.map((row) => {
      return row.id === itemId
        ? {
            ...row,
            isOpen: !row.isOpen
          }
        : {
            ...row
          };
    });

  const onCollapse = (
    event: React.MouseEvent,
    rowIndex: number,
    isOpen: boolean,
    rowData: IRowData,
    extraData: IExtraData
  ): void => {
    console.log(
      'Debug - rowData, extraData, isOpen, rows',
      rowData,
      extraData,
      isOpen,
      rows
    );
    const u_rows = setOpen(rows, id);
    setRows(u_rows);
    console.log('Debug - new rows', rows);
  };

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
              onCollapse={onCollapse}
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
