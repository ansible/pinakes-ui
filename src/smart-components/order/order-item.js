import React from 'react';
import PropTypes from 'prop-types';
import {
  DataListCell,
  DataListContent,
  DataListItem,
  DataListToggle,
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

import OrderSteps from './order-steps';
import OrderDetailTable from './order-detail-table';
import CardIcon from '../../presentational-components/shared/card-icon';
import { getOrderIcon, getOrderPortfolioName } from '../../helpers/shared/orders';
import { createOrderedLabel, createUpdatedLabel, createDateString } from '../../helpers/shared/helpers';

const completedWhiteList = state => [ 'Order Completed', 'finished' ].includes(state);

const countFinishedSteps = step => step.filter(({ state }) => completedWhiteList(state));

const createTableRows = order => [{
  reason: 'Order initiated',
  requester: 'System',
  updated_at: order.orderItems[0] && createDateString(order.orderItems[0].updated_at || order.orderItems[0].created_at),
  state: order.orderItems[0] && order.orderItems[0].state
}, {
  reason: 'Approval',
  requester: 'System',
  updated_at: order.requests[0] && createDateString(order.requests[0].updated_at || order.requests[0].created_at),
  state: order.requests[0] && order.requests[0].state
}, {
  reason: 'Provision',
  requester: 'System',
  updated_at: createDateString(order.ordered_at || order.created_at),
  state: order.state
}, {
  reason: 'Approval',
  requester: 'System',
  updated_at: createDateString(order.ordered_at || order.created_at),
  state: order.state
}];

const OrderItem = ({ item, isExpanded, handleDataItemToggle, portfolioItems }) => {
  const initialSteps = createTableRows(item);
  const finishedSteps = countFinishedSteps(initialSteps);
  const steps = initialSteps.map((item, index) => ({
    ...item,
    state: index < finishedSteps.length ? item.state : null
  }));

  return (
    <DataListItem aria-labelledby={ `${item.id}-expand` } isExpanded={ isExpanded } className="data-list-expand-fix">
      <DataListToggle
        id={ item.id }
        aria-label={ `${item.id}-expand` }
        aria-labelledby={ `${item.id}-expand` }
        onClick={ () => handleDataItemToggle(item.id) }
        isExpanded={ isExpanded }
      />
      <DataListCell className="cell-grow">
        <Split gutter="md">
          <SplitItem>
            <CardIcon src={ getOrderIcon(item) } />
          </SplitItem>
          <SplitItem isMain>
            <TextContent>
              <Grid gutter="sm" style={ { gridGap: 16 } }>
                <GridItem>
                  <Text
                    style={ { marginBottom: 0 } }
                    component={ TextVariants.h5 }
                  >
                    { getOrderPortfolioName(item, portfolioItems) }
                  </Text>
                </GridItem>
                <GridItem>
                  <Level>
                    <LevelItem>
                      <Text
                        style={ { marginBottom: 0 } }
                        component={ TextVariants.small }
                      >
                        { `${createOrderedLabel(new Date(item.ordered_at))}` }
                      </Text>
                    </LevelItem>
                    <LevelItem>
                      <Text
                        style={ { marginBottom: 0 } }
                        component={ TextVariants.small }
                      >
                            Ordered by
                      </Text>
                    </LevelItem>
                    <LevelItem>
                      <Text
                        style={ { marginBottom: 0 } }
                        component={ TextVariants.small }
                      >
                        { `${createUpdatedLabel(item.orderItems)}` }
                      </Text>
                    </LevelItem>
                  </Level>
                </GridItem>
              </Grid>
            </TextContent>
          </SplitItem>
        </Split>
      </DataListCell>
      <DataListCell style={ { alignSelf: 'center' } }>
        <OrderSteps requests={ finishedSteps } />
      </DataListCell>
      <DataListContent style={ { paddingLeft: 0, paddingRight: 0 } } aria-label={ `${item.id}-content` } isHidden={ !isExpanded }>
        <OrderDetailTable requests={ steps } />
      </DataListContent>
    </DataListItem>
  );};

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

export default OrderItem;

