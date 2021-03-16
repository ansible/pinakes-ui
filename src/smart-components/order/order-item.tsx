import React, { Fragment, ReactNode } from 'react';
import { Label, Text, TextVariants } from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';

import CardIcon from '../../presentational-components/shared/card-icon';
import { getOrderIcon } from '../../helpers/shared/orders';
import CatalogLink from '../common/catalog-link';
import { ORDER_ROUTE } from '../../constants/routes';
import statesMessages, {
  getTranslatableState
} from '../../messages/states.messages';

import { TableText } from '@patternfly/react-table';
import orderStatusMapper from './order-status-mapper';
import { OrderDetail } from '../../redux/reducers/order-reducer';
import { FormatMessage, StringObject } from '../../types/common-types';

const createOrderItem = (
  item: OrderDetail,
  orderPlatform: string | undefined,
  orderPortfolio: string | undefined,
  formatMessage: FormatMessage
): { title: ReactNode }[] => {
  const orderItem = (item.orderItems[0] && item.orderItems[0]) || {};
  const searchParams: StringObject = {
    order: item.id,
    ...(orderItem.id ? { 'order-item': orderItem.id } : {}),
    ...(orderItem.portfolio_item_id
      ? { 'portfolio-item': orderItem.portfolio_item_id }
      : {}),
    ...(orderPlatform ? { platform: orderPlatform } : {}),
    ...(orderPortfolio ? { portfolio: orderPortfolio } : {})
  };
  const translatableState = getTranslatableState(item.state);
  return [
    {
      title: (
        <TableText>
          <CatalogLink pathname={ORDER_ROUTE} searchParams={searchParams}>
            {item.id}
          </CatalogLink>
        </TableText>
      )
    },
    {
      title: (
        <Fragment>
          <CardIcon
            height={60}
            src={getOrderIcon(item)}
            sourceId={orderPlatform}
          />
        </Fragment>
      )
    },
    item.orderName,
    item.owner,
    {
      title: (
        <Text className="pf-u-mb-0" component={TextVariants.small}>
          <DateFormat date={item.created_at} variant="relative" />
        </Text>
      )
    },
    {
      title: (
        <Text className="pf-u-mb-0" component={TextVariants.small}>
          <DateFormat
            date={item.orderItems[0] && item.orderItems[0].updated_at}
            variant="relative"
          />
        </Text>
      )
    },
    {
      title: (
        <TableText>
          <Label
            {...orderStatusMapper[item.state as keyof typeof orderStatusMapper]}
            variant="outline"
          >
            {formatMessage(statesMessages[translatableState])}
          </Label>
        </TableText>
      )
    }
  ];
};

export default createOrderItem;
