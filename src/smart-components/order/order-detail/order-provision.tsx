import React, { Fragment, useEffect, useState } from 'react';
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
  ISortBy,
  sortable,
  SortByDirection,
  Table,
  TableBody,
  TableHeader
} from '@patternfly/react-table';

import { DateFormat } from '@redhat-cloud-services/frontend-components/components/cjs/DateFormat';
import InfoIcon from '@patternfly/react-icons/dist/js/icons/info-icon';
import { fetchOrderProvision } from '../../../redux/actions/order-actions';
import ordersMessages from '../../../messages/orders.messages';
import statesMessages from '../../../messages/states.messages';
import useFormatMessage from '../../../utilities/use-format-message';
import { AnyObject, ApiCollectionResponse } from '../../../types/common-types';
import {
  Order,
  OrderItem,
  OrderItemStateEnum
} from '@redhat-cloud-services/catalog-client';
import { CatalogRootState } from '../../../types/redux';
import { CheckCircleIcon } from '@patternfly/react-icons';
import { OrderProvisionPayload } from '../../../helpers/order/new-order-helper';
import {OrderDetail, OrderProvisionType} from '../../../redux/reducers/order-reducer';

/**
 * We are using type conversion of **request as StringObject** because the generated client does not have correct states listed
 * Probably a discrepancy inside the OpenAPI spec
 */

const rowOrder = ['updated_at', 'id', 'state'];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const checkItems = async (
  fetchItems: () => Promise<ApiCollectionResponse<any>>
) => {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const result = await fetchItems();
    if (result?.data.length > 0) {
      return 'Finished';
    }

    await delay(3000);
  }
};

const isEmpty = (orderProvision?: OrderProvisionType) =>
  !orderProvision ||
  !orderProvision.orderItems ||
  orderProvision.orderItems.length === 0;

const OrderProvision: React.ComponentType = () => {
  const formatMessage = useFormatMessage();
  const dispatch = useDispatch();
  const [sortBy, setSortBy] = useState<ISortBy>({});
  const { order } = useSelector<CatalogRootState, OrderDetail>(
    ({ orderReducer: { orderDetail } }) => orderDetail
  );

  const orderProvision = useSelector<CatalogRootState, OrderProvisionType>(
    ({ orderReducer: { orderProvision } }) => orderProvision
  );
  useEffect(() => {
    if (order.state !== 'Failed' && order?.id && isEmpty(orderProvision)) {
      checkItems(() =>
        dispatch(
          (fetchOrderProvision(order.id) as unknown) as Promise<
            ApiCollectionResponse<OrderProvisionPayload>
          >
        )
      );
    }
  }, []);

  const handleSort = (
    _e: React.SyntheticEvent,
    index: number,
    direction: SortByDirection
  ) => setSortBy({ index, direction });

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

  const columns = [
    { title: 'Updated', transforms: [sortable] },
    { title: 'Name', transforms: [sortable] },
    'Status'
  ];

  const rows = orderProvision?.orderItems
    ? orderProvision?.orderItems
        .map((item: OrderItem) =>
          rowOrder.map((key) => {
            if (key === 'state') {
              return (
                <Fragment>
                  {(item as OrderItem)[key] ===
                    OrderItemStateEnum.Completed && (
                    <Fragment>
                      <CheckCircleIcon color="var(--pf-global--success-color--100)" />
                      &nbsp;
                    </Fragment>
                  )}
                  {formatMessage(
                    statesMessages[
                      ((item as OrderItem)[
                        key
                      ] as unknown) as keyof typeof statesMessages
                    ]
                  )}
                </Fragment>
              );
            }

            if (key === 'updated_at') {
              /**
               * The fragment here is required other wise the super smart PF table will delete the first React element
               */
              return (
                <Fragment>
                  <DateFormat date={(item as OrderItem)[key]} type="exact" />
                </Fragment>
              );
            }

            return (item as AnyObject)[key];
          })
        )
        .sort((a: AnyObject, b: AnyObject) =>
          a[sortBy.index!] < b[sortBy.index!]
            ? -1
            : a[sortBy.index!] < b[sortBy.index!]
            ? 1
            : 0
        ) || []
    : [];

  return (
    <TextContent>
      {isEmpty(orderProvision) ? (
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
              onSort={handleSort}
              sortBy={sortBy}
              cells={columns}
              rows={
                sortBy.direction === SortByDirection.asc ? rows : rows.reverse()
              }
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
