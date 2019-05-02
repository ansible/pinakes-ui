import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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
import { getOrderIcon, getOrderPortfolioName } from '../../helpers/shared/orders';
import { createOrderedLabel, createUpdatedLabel, createDateString } from '../../helpers/shared/helpers';
import createOrderRow from './create-order-row';

class OrderItem extends Component {
  shouldComponentUpdate({ isExpanded }) {
    return isExpanded !== this.props.isExpanded;
  }

  render() {
    const { item, isExpanded, handleDataItemToggle, portfolioItems } = this.props;
    const { finishedSteps, steps } = createOrderRow(item);
    const orderedAt = createOrderedLabel(new Date(item.ordered_at));
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
                    <CardIcon src={ getOrderIcon(item) } />
                  </SplitItem>
                  <SplitItem isMain>
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
                              <Tooltip enableFlip position={ TooltipPosition.top } content={ <span>{ createDateString(item.ordered_at) }</span> }>
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
              <DataListCell key="2" style={ { alignSelf: 'center' } }>
                <OrderSteps requests={ finishedSteps } />
              </DataListCell>
            ] }
          />
        </DataListItemRow>
        <DataListContent aria-label={ `${item.id}-content` } isHidden={ !isExpanded }>
          { isExpanded && <OrderDetailTable requests={ steps } /> }
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
  portfolioItems
});

export default connect(mapStateToProps)(OrderItem);

