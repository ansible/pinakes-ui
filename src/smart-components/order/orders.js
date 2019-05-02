import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Grid, GridItem, DataList, Text, TextContent } from '@patternfly/react-core';
import { Section } from '@red-hat-insights/insights-frontend-components';

import OrderItem from './order-item';
import OrdersToolbar from './orders-toolbar';
import OrderMessagesModal from './order-messages-modal';
import { getLinkedOrders } from '../../redux/actions/order-actions';
import { fetchPortfolioItems } from '../../redux/actions/portfolio-actions';
import { OrderLoader } from '../../presentational-components/shared/loader-placeholders';

import './orders.scss';

const Orders = ({ getLinkedOrders, fetchPortfolioItems, isLoading, linkedOrders: { current, past }}) => {
  const [ dataListExpanded, setDataListExpanded ] = useState({});
  useEffect(() => {
    getLinkedOrders();
    fetchPortfolioItems();
  }, []);

  const handleDataItemToggle = id => setDataListExpanded(prevState => ({ ...prevState, [id]: !dataListExpanded[id] }));

  const renderDataListItems = (data, type = 'current') => data.map(({ id }, index) => (
    <OrderItem
      key={ id }
      index={ index }
      isExpanded={ dataListExpanded[id] }
      handleDataItemToggle={ handleDataItemToggle }
      type={ type }
    />
  ));

  if (isLoading) {
    return <OrderLoader />;
  }

  return (
    <Fragment>
      <Route path="/orders/:orderItemId/messages" component={ OrderMessagesModal } />
      <OrdersToolbar />
      <Section type="content">
        <Grid gutter="md">
          <GridItem>
            <TextContent>
              <Text component="h2">Current orders</Text>
            </TextContent>
            <DataList aria-label="current-orders">
              { renderDataListItems(current, 'current') }
            </DataList>
          </GridItem>
          <GridItem>
            <TextContent>
              <Text component="h2">Past orders</Text>
            </TextContent>
            <DataList aria-label="past-orders">
              { renderDataListItems(past, 'past') }
            </DataList>
          </GridItem>
        </Grid>
      </Section>
    </Fragment>
  );
};

const mapStateToProps = ({ orderReducer: { linkedOrders, isLoading }, portfolioReducer: { portfolioItems, isLoading: portfolioLoading }}) => ({
  linkedOrders,
  isLoading: isLoading || portfolioLoading,
  portfolioItems
});

const mapDispatchToProps = dispatch => bindActionCreators({
  getLinkedOrders,
  fetchPortfolioItems
}, dispatch);

Orders.propTypes = {
  linkedOrders: PropTypes.shape({
    current: PropTypes.arrayOf(PropTypes.object).isRequired,
    past: PropTypes.arrayOf(PropTypes.object).isRequired
  }).isRequired,
  isLoading: PropTypes.bool,
  getLinkedOrders: PropTypes.func.isRequired,
  fetchPortfolioItems: PropTypes.func.isRequired,
  portfolioItems: PropTypes.array.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Orders);
