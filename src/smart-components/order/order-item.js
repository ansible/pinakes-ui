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
  TextVariants,
  Tooltip,
  TooltipPosition
} from '@patternfly/react-core';
import { Link } from 'react-router-dom';

import CardIcon from '../../presentational-components/shared/card-icon';
import { getOrderIcon, getOrderPortfolioName, getOrderPlatformId } from '../../helpers/shared/orders';
import { createOrderedLabel, createUpdatedLabel, createDateString } from '../../helpers/shared/helpers';
import { ExclamationCircleIcon } from '@patternfly/react-icons';

const OrderItem = ({ item }) => {
  const portfolioItems = useSelector(({ portfolioReducer: { portfolioItems: { data }}}) => data);

  const orderedAt = createOrderedLabel(new Date(item.created_at));
  const updatedAt = createUpdatedLabel(item.orderItems);
  const { orderPlatform, orderPortfolio } = getOrderPlatformId(item, portfolioItems);

  const orderItem = item.orderItems[0] && item.orderItems[0] || {};
  const searchParam = `?order-item=${orderItem.id}&portfolio-item=${orderItem.portfolio_item_id}&platform=${orderPlatform}&portfolio=${orderPortfolio}`; // eslint-disable-line max-len
  return (
    <React.Fragment>
      <DataListItem aria-labelledby={ `${item.id}-expand` } className="data-list-expand-fix">
        <DataListItemRow>
          <DataListItemCells
            dataListCells={ [
              <DataListCell key="1" className="cell-grow">
                <Split gutter="sm">
                  <SplitItem>
                    <CardIcon height={ 60 } src={ getOrderIcon(item) } platformId={ orderPlatform }/>
                  </SplitItem>
                  <SplitItem>
                    <TextContent>
                      <Grid gutter="sm" style={ { gridGap: 16 } }>
                        <GridItem>
                          <Level>
                            <LevelItem>
                              <Text
                                style={ { marginBottom: 0 } }
                                component={ TextVariants.h5 }
                              >
                                <Link to={ {
                                  pathname: `orders/${item.id}`,
                                  search: searchParam
                                } }>{ `${getOrderPortfolioName(item, portfolioItems)} # ${item.id}` }</Link>
                              </Text>
                            </LevelItem>
                            <LevelItem>
                              <Link to={ {
                                pathname: `orders/${item.id}/approval`,
                                search: searchParam
                              } }>
                                { item.state === 'Failed' && <ExclamationCircleIcon className="pf-u-mr-sm" fill="#C9190B" /> }
                                { item.state }
                              </Link>
                            </LevelItem>
                          </Level>
                        </GridItem>
                        <GridItem>
                          <Level>
                            <LevelItem>
                              <Tooltip enableFlip position={ TooltipPosition.top } content={ <span>{ createDateString(item.created_at) }</span> }>
                                <Text
                                  style={ { marginBottom: 0 } }
                                  component={ TextVariants.small }
                                >
                                  { orderedAt }
                                </Text>
                              </Tooltip>
                            </LevelItem>
                            <LevelItem>
                              <Text
                                style={ { marginBottom: 0 } }
                                component={ TextVariants.small }
                              >
                                Ordered by { item.owner }
                              </Text>
                            </LevelItem>
                            <LevelItem>
                              <Tooltip
                                enableFlip
                                position={ TooltipPosition.top }
                                content={ <span>{ createDateString(item.orderItems[0] && item.orderItems[0].updated_at) }</span> }
                              >
                                <Text
                                  style={ { marginBottom: 0 } }
                                  component={ TextVariants.small }
                                >
                                  { updatedAt }
                                </Text>
                              </Tooltip>
                            </LevelItem>
                          </Level>
                        </GridItem>
                      </Grid>
                    </TextContent>
                  </SplitItem>
                </Split>
              </DataListCell>
            ] }
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
