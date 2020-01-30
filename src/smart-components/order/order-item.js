import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  Grid,
  GridItem,
  Level,
  LevelItem,
  Split,
  SplitItem,
  Text,
  TextContent,
  TextVariants
} from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components';
import { ExclamationCircleIcon } from '@patternfly/react-icons';

import CardIcon from '../../presentational-components/shared/card-icon';
import {
  getOrderIcon,
  getOrderPortfolioName,
  getOrderPlatformId
} from '../../helpers/shared/orders';
import CatalogLink from '../common/catalog-link';
import { ORDER_ROUTE, ORDER_APPROVAL_ROUTE } from '../../constants/routes';

const OrderItem = ({ item }) => {
  const { orderPlatform, orderPortfolio, orderName } = useSelector(
    ({
      portfolioReducer: {
        portfolioItems: { data }
      }
    }) => {
      const { orderPlatform, orderPortfolio } = getOrderPlatformId(item, data);
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
    <React.Fragment>
      <DataListItem
        aria-labelledby={`${item.id}-expand`}
        className="data-list-expand-fix"
      >
        <DataListItemRow>
          <DataListItemCells
            dataListCells={[
              <DataListCell key="1" className="cell-grow">
                <Split gutter="sm">
                  <SplitItem>
                    <CardIcon
                      height={60}
                      src={getOrderIcon(item)}
                      sourceId={orderPlatform}
                    />
                  </SplitItem>
                  <SplitItem>
                    <TextContent>
                      <Grid gutter="sm" className="pf-u-gg-md">
                        <GridItem>
                          <Level>
                            <LevelItem>
                              <Text
                                className="pf-u-mb-0"
                                component={TextVariants.h5}
                              >
                                <CatalogLink
                                  pathname={ORDER_ROUTE}
                                  searchParams={searchParams}
                                >
                                  {orderName} # {item.id}
                                </CatalogLink>
                              </Text>
                            </LevelItem>
                            <LevelItem>
                              <CatalogLink
                                pathname={ORDER_APPROVAL_ROUTE}
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
                              <Text
                                className="pf-u-mb-0"
                                component={TextVariants.small}
                              >
                                <DateFormat
                                  date={item.created_at}
                                  variant="relative"
                                />
                              </Text>
                            </LevelItem>
                            <LevelItem>
                              <Text
                                style={{ marginBottom: 0 }}
                                component={TextVariants.small}
                              >
                                Ordered by {item.owner}
                              </Text>
                            </LevelItem>
                            <LevelItem>
                              <Text
                                className="pf-u-mb-0"
                                component={TextVariants.small}
                              >
                                <DateFormat
                                  date={
                                    item.orderItems[0] &&
                                    item.orderItems[0].updated_at
                                  }
                                  variant="relative"
                                />
                              </Text>
                            </LevelItem>
                          </Level>
                        </GridItem>
                      </Grid>
                    </TextContent>
                  </SplitItem>
                </Split>
              </DataListCell>
            ]}
          />
        </DataListItemRow>
      </DataListItem>
    </React.Fragment>
  );
};

OrderItem.propTypes = {
  item: PropTypes.object.isRequired
};

export default OrderItem;
