import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
  Grid,
  GridItem,
  Level,
  LevelItem,
  Text,
  TextContent,
  TextVariants
} from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components/components/cjs/DateFormat';
import { ExclamationCircleIcon } from '@patternfly/react-icons';

import CardIcon from '../../presentational-components/shared/card-icon';
import {
  getOrderIcon,
  getOrderPortfolioName,
  getOrderPlatformId
} from '../../helpers/shared/orders';
import CatalogLink from '../common/catalog-link';
import {
  ORDER_ROUTE,
  ORDER_APPROVAL_ROUTE,
  ORDER_LIFECYCLE_ROUTE
} from '../../constants/routes';
import { TableCell } from '../../presentational-components/styled-components/table';

const routeMapper = {
  'Approval Pending': ORDER_APPROVAL_ROUTE,
  Completed: ORDER_LIFECYCLE_ROUTE
};

const OrderItem = memo(
  ({ item }) => {
    const { orderPlatform, orderPortfolio, orderName } = useSelector(
      ({
        portfolioReducer: {
          portfolioItems: { data }
        }
      }) => {
        const { orderPlatform, orderPortfolio } = getOrderPlatformId(
          item,
          data
        );
        return {
          orderPlatform,
          orderPortfolio,
          orderName: getOrderPortfolioName(item, data)
        };
      }
    );
    const orderItem = (item.orderItems[0] && item.orderItems[0]) || {};
    const searchParams = {
      order: item.id,
      'order-item': orderItem.id,
      'portfolio-item': orderItem.portfolio_item_id,
      platform: orderPlatform,
      portfolio: orderPortfolio
    };
    return (
      <tr
        aria-labelledby={`${item.id}-expand`}
        className="data-list-expand-fix"
      >
        <TableCell shrink className="pf-u-pl-xl-on-md">
          <CardIcon
            height={60}
            src={getOrderIcon(item)}
            sourceId={orderPlatform}
          />
        </TableCell>
        <TableCell>
          <TextContent>
            <Grid hasGutter className="pf-u-gg-md">
              <GridItem>
                <Level className="flex-no-wrap">
                  <LevelItem>
                    <Text className="pf-u-mb-0" component={TextVariants.h5}>
                      <CatalogLink
                        pathname={ORDER_ROUTE}
                        searchParams={searchParams}
                      >
                        {orderName} - Order # {item.id}
                      </CatalogLink>
                    </Text>
                  </LevelItem>
                  <LevelItem className="flex-item-no-wrap">
                    <CatalogLink
                      pathname={routeMapper[item.state] || ORDER_ROUTE}
                      searchParams={searchParams}
                    >
                      {item.state === 'Failed' && (
                        <ExclamationCircleIcon className="pf-u-mr-sm icon-danger-fill" />
                      )}
                      {item.state}
                    </CatalogLink>
                  </LevelItem>
                </Level>
              </GridItem>
              <GridItem>
                <Level>
                  <LevelItem>
                    <Text className="pf-u-mb-0" component={TextVariants.small}>
                      Ordered&nbsp;
                      <DateFormat date={item.created_at} variant="relative" />
                    </Text>
                  </LevelItem>
                  <LevelItem>
                    <Text className="pf-u-mb-0" component={TextVariants.small}>
                      Ordered by {item.owner}
                    </Text>
                  </LevelItem>
                  <LevelItem>
                    <Text className="pf-u-mb-0" component={TextVariants.small}>
                      Last updated&nbsp;
                      <DateFormat
                        date={
                          item.orderItems[0] && item.orderItems[0].updated_at
                        }
                        variant="relative"
                      />
                    </Text>
                  </LevelItem>
                </Level>
              </GridItem>
            </Grid>
          </TextContent>
        </TableCell>
      </tr>
    );
  },
  (prevProps, nextProps) => prevProps.id === nextProps.id
);

OrderItem.propTypes = {
  item: PropTypes.object.isRequired
};

export default OrderItem;
