import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  DataListCell,
  DataListContent,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  DataListToggle,
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

import OrderSteps from './order-steps';
import OrderDetailTable from './order-detail-table';
import CardIcon from '../../presentational-components/shared/card-icon';
import { getOrderIcon, getOrderPortfolioName, getOrderPlatformId } from '../../helpers/shared/orders';
import { createOrderedLabel, createUpdatedLabel, createDateString } from '../../helpers/shared/helpers';
import createOrderRow from './create-order-row';
import { cancelOrder } from '../../redux/actions/order-actions';

const UNCANCELABLE_STATES = [ 'Completed', 'Failed' ];

const canCancel = state => !UNCANCELABLE_STATES.includes(state);

class OrderItem extends Component {
  shouldComponentUpdate({ isExpanded }) {
    return isExpanded !== this.props.isExpanded;
  }

  render() {
    const { item, isExpanded, handleDataItemToggle, portfolioItems, cancelOrder } = this.props;
    const { finishedSteps, steps } = createOrderRow(item);
    const orderedAt = createOrderedLabel(new Date(item.created_at));
    const updatedAt = createUpdatedLabel(item.orderItems);
    return (
      <DataListItem aria-labelledby={ `${item.id}-expand` } isExpanded={ isExpanded } className="data-list-expand-fix">
        <DataListItemRow>
          <DataListToggle
            id={ item.id }
            aria-label={ `${item.id}-expand` }
            aria-labelledby={ `${item.id}-expand` }
            onClick={ () => handleDataItemToggle(item.id) }
            isExpanded={ isExpanded }
          />
          <DataListItemCells
            dataListCells={ [
              <DataListCell key="1" className="cell-grow">
                <Split gutter="sm">
                  <SplitItem>
                    <CardIcon src={ getOrderIcon(item) } platformId={ getOrderPlatformId(item, portfolioItems) }/>
                  </SplitItem>
                  <SplitItem>
                    <TextContent>
                      <Grid gutter="sm" style={ { gridGap: 8 } }>
                        <GridItem>
                          <Text
                            style={ { marginBottom: 0 } }
                            component={ TextVariants.h5 }
                          >
                            { `${getOrderPortfolioName(item, portfolioItems)} # ${item.id}` }
                          </Text>
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
                                content={ <span>{ createDateString(item.updated_at || item.ordered_at) }</span> }
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
              </DataListCell>,
              <DataListCell key="2" style={ { alignSelf: item.state === 'Completed' ? 'flex-end' : 'center' } }>
                { item.state === 'Completed'
                  ? (
                    <div style={ { minWidth: 200, textAlign: 'end' } }>
                      <a href={ item.orderItems && item.orderItems[0].external_url } target="_blank" rel="noopener noreferrer">
                        Manage product
                      </a>
                    </div>)
                  : <OrderSteps requests={ finishedSteps } />
                }
              </DataListCell>
            ] }
          />
        </DataListItemRow>
        <DataListContent aria-label={ `${item.id}-content` } isHidden={ !isExpanded }>
          { isExpanded && (
            <div>
              <OrderDetailTable
                canCancel={ canCancel(item.state) }
                requests={ steps }
                orderState={ item.state }
                orderItem={ item.orderItems && item.orderItems[0] }
                onCancel={ () => cancelOrder(item.id) }
              />
            </div>
          ) }
        </DataListContent>
      </DataListItem>
    );
  }
}

OrderItem.displayName = 'OrderItem';

OrderItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    ordered_at: PropTypes.string.isRequired,
    orderItems: PropTypes.array.isRequired
  }).isRequired,
  isExpanded: PropTypes.bool,
  handleDataItemToggle: PropTypes.func.isRequired,
  portfolioItems: PropTypes.array.isRequired
};

OrderItem.defaultProps = {
  isExpanded: false
};

const mapStateToProps = ({ orderReducer: { linkedOrders }, portfolioReducer: { portfolioItems }}, { index, type }) => ({
  item: linkedOrders[type][index],
  portfolioItems: portfolioItems.data
});

const mapDispatchToProps = dispatch => bindActionCreators({
  cancelOrder
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(OrderItem);

