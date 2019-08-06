import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Route, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Grid, GridItem, DataList, Tabs, Tab } from '@patternfly/react-core';
import { Section } from '@redhat-cloud-services/frontend-components';

import OrderItem from './order-item';
import OrderMessagesModal from './order-messages-modal';
import ToolbarRenderer from '../../toolbar/toolbar-renderer';
import { getLinkedOrders } from '../../redux/actions/order-actions';
import { fetchPortfolioItems } from '../../redux/actions/portfolio-actions';
import createOrdersToolbarSchema from '../../toolbar/schemas/orders-toolbar.schema';
import { OrderLoader } from '../../presentational-components/shared/loader-placeholders';

import './orders.scss';

const tabItems = [{
  eventKey: 0,
  title: 'Open',
  name: '/open'
}, {
  eventKey: 1,
  title: 'Closed',
  name: '/closed'
}];

const Orders = ({
  history: { push },
  location: { pathname },
  getLinkedOrders,
  fetchPortfolioItems,
  isLoading,
  linkedOrders: { current, past }}
) => {
  const [ dataListExpanded, setDataListExpanded ] = useState({});
  const activeTab = tabItems.find(({ name }) => pathname.includes(name));
  const handleTabClick = (_event, tabIndex) => push(`/orders${tabItems[tabIndex].name}`);

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

  const OrderTabs = () => (
    <Tabs className="pf-u-mt-md" activeKey={ activeTab ? activeTab.eventKey : 0 } onSelect={ handleTabClick }>
      { tabItems.map((item) => <Tab title={ item.title } key={ item.eventKey } eventKey={ item.eventKey } name={ item.name }/>) }
    </Tabs>
  );

  return (
    <Fragment>
      <ToolbarRenderer schema={ createOrdersToolbarSchema({ Tabs: OrderTabs }) } />
      <Route path="/orders/:orderItemId/messages" component={ OrderMessagesModal } />

      <Section type="content">
        <Grid gutter="md">
          <GridItem>
            <Route exact path={ [ '/orders', '/orders/open' ] } render={ () => (
              <DataList aria-label="current-orders">
                { renderDataListItems(current, 'current') }
              </DataList>
            ) } />
            <Route exact path="/orders/closed" render={ () => (
              <DataList aria-label="past-orders">
                { renderDataListItems(past, 'past') }
              </DataList>
            ) } />
          </GridItem>
        </Grid>
      </Section>
    </Fragment>
  );
};

const mapStateToProps = ({ orderReducer: { linkedOrders, isLoading }, portfolioReducer: { portfolioItems, isLoading: portfolioLoading }}) => ({
  linkedOrders,
  isLoading: isLoading || portfolioLoading,
  portfolioItems: portfolioItems.data
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
  portfolioItems: PropTypes.array.isRequired,
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  location: PropTypes.shape({ pathname: PropTypes.string.isRequired }).isRequired
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Orders));
