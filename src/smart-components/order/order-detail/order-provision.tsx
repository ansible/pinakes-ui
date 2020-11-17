import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Bullseye,
  Card,
  CardBody,
  Flex,
  Spinner,
  Text,
  TextContent,
  TextVariants,
  Title
} from '@patternfly/react-core';

import {
  expandable,
  ICell,
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
import UserContext from '../../../user-context';
import { hasPermission } from '../../../helpers/shared/helpers';

export interface RowType {
  id?: string;
  parent?: number;
  isOpen?: boolean;
  cells: { title: any }[];
}

export interface ExpandedRowType {
  parent: number;
  isOpen: boolean;
  cells: { title: any }[];
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
  const { permissions: userPermissions } = useContext(UserContext);
  const showProgressMessages = hasPermission(userPermissions, [
    'catalog:order_processes:link'
  ]);

  if (!isFetching && isEmpty(orderProvision)) {
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
    {
      title: 'Updated',
      cellFormatters: showProgressMessages ? [expandable] : []
    },
    { title: 'Type' },
    { title: 'Activity' },
    { title: '' }
  ];

  const createOrderItemMainRow = (
    item: OrderItem,
    formatMessage: FormatMessage
  ): RowType => {
    const translatableState = getTranslatableState(
      item.state as OrderItemStateEnum
    );
    return {
      id: item.id,
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
              <TableText>
                {capitalize(
                  item.process_scope ||
                    formatMessage(ordersMessages.defaultOrderItemType)
                )}
              </TableText>
            </Text>
          )
        },
        {
          title: (
            <Text className="pf-u-mb-0" component={TextVariants.small}>
              <TableText>{item.name}</TableText>
            </Text>
          )
        },
        {
          title: (
            <TableText>
              <TextContent
                style={{
                  color:
                    orderStatusMapper[
                      item.state as keyof typeof orderStatusMapper
                    ].color
                }}
              >
                {
                  orderStatusMapper[
                    item.state as keyof typeof orderStatusMapper
                  ].icon
                }
                &nbsp;
                {formatMessage(statesMessages[translatableState])}
              </TextContent>
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
  ): RowType => {
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

  const createOrderRow = (
    item: OrderItem,
    formatMessage: FormatMessage,
    key: number
  ): RowType[] => {
    const orderRow = [createOrderItemMainRow(item, formatMessage)];
    if (
      showProgressMessages &&
      orderProvision.progressMessageItems &&
      orderProvision.progressMessageItems.length > 0
    ) {
      const progressMessageItem = orderProvision.progressMessageItems.find(
        (msgItem) => msgItem.orderItemId === item.id
      );
      if (progressMessageItem) {
        orderRow.push(
          createOrderItemExpandedRow(
            item,
            progressMessageItem.progressMessages,
            formatMessage,
            key
          )
        );
      }
    }

    return orderRow;
  };

  const createRows = (): RowType[] =>
    orderProvision.orderItems.reduce((acc: RowType[], item: OrderItem, key) => {
      const row = createOrderRow(item, formatMessage, key);
      return [...acc, ...row];
    }, []);

  const [rows, setRows] = useState<RowType[]>(createRows());

  useEffect(() => {
    setIsFetching(true);
    Promise.all([dispatch(fetchOrderProvision(order.id))]).then(() =>
      setIsFetching(false)
    );
  }, []);

  useEffect((): void => {
    setRows(createRows());
  }, [orderProvision?.orderItems]);

  const setOpen = (data: RowType[], rowId: any) =>
    data.map((row) =>
      row.id === rowId
        ? {
            ...row,
            isOpen: !row.isOpen
          }
        : {
            ...row
          }
    );

  const onCollapse = (
    event: React.MouseEvent,
    rowIndex: number,
    isOpen: boolean,
    rowData: IRowData
  ): void => {
    const u_rows = setOpen(rows, rowData.id);
    setRows(u_rows);
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
              onCollapse={showProgressMessages ? onCollapse : undefined}
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
