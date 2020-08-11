import React, { Fragment } from 'react';
import { Label, Text, TextVariants } from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components/components/cjs/DateFormat';
import {
  ExclamationCircleIcon,
  InfoCircleIcon,
  CheckCircleIcon
} from '@patternfly/react-icons';

import CardIcon from '../../presentational-components/shared/card-icon';
import { getOrderIcon } from '../../helpers/shared/orders';
import CatalogLink from '../common/catalog-link';
import {
  ORDER_ROUTE,
  ORDER_APPROVAL_ROUTE,
  ORDER_LIFECYCLE_ROUTE
} from '../../constants/routes';
import statesMessages, {
  getTranslatableState
} from '../../messages/states.messages';
import ordersMessages from '../../messages/orders.messages';

import { TableText } from '@patternfly/react-table';

const routeMapper = {
  'Approval Pending': ORDER_APPROVAL_ROUTE,
  Completed: ORDER_LIFECYCLE_ROUTE
};

const labelProps = {
  Completed: { icon: <CheckCircleIcon />, color: 'green' },
  'Approval Pending': {
    icon: <InfoCircleIcon />,
    color: 'blue'
  },
  Ordered: { icon: <InfoCircleIcon />, color: 'blue' },
  Failed: { icon: <ExclamationCircleIcon />, color: 'red' }
};

/**
 * Create order row definition for react tabular table
 * @param {Object} item order object
 * @param {Object} orderPlatform order source data
 * @param {Object} orderPortfolio order portfolio data
 * @param {function} formatMessage translation function
 */
const createOrderItem = (
  item,
  orderPlatform,
  orderPortfolio,
  formatMessage
) => {
  const orderItem = (item.orderItems[0] && item.orderItems[0]) || {};
  const searchParams = {
    order: item.id,
    'order-item': orderItem.id,
    'portfolio-item': orderItem.portfolio_item_id,
    platform: orderPlatform,
    portfolio: orderPortfolio
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
          {formatMessage(ordersMessages.lastUpdated)}
          &nbsp;
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
          <CatalogLink
            pathname={routeMapper[item.state] || ORDER_ROUTE}
            searchParams={searchParams}
          >
            <Label {...labelProps[item.state]} variant="outline">
              {formatMessage(statesMessages[translatableState])}
            </Label>
          </CatalogLink>
        </TableText>
      )
    }
  ];
};

export default createOrderItem;
