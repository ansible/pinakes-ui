import React, { Fragment, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Route, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Grid, GridItem, DataList, Tabs, Tab } from '@patternfly/react-core';
import { Section } from '@redhat-cloud-services/frontend-components';

import OrderItem from './order-item';
import OrderMessagesModal from './order-messages-modal';
import ToolbarRenderer from '../../toolbar/toolbar-renderer';
import { fetchPlatforms } from '../../redux/actions/platform-actions';
import { fetchOpenOrders, fetchCloseOrders } from '../../redux/actions/order-actions';
import createOrdersToolbarSchema from '../../toolbar/schemas/orders-toolbar.schema';
import { OrderLoader } from '../../presentational-components/shared/loader-placeholders';

import './orders.scss';
import { fetchPortfolioItems } from '../../redux/actions/portfolio-actions';

const tabItems = [{
  eventKey: 0,
  title: 'Open',
  name: '/open'
}, {
  eventKey: 1,
  title: 'Closed',
  name: '/closed'
}];

const OrderType = ({ type, dataListExpanded, handleDataItemToggle }) => {
  const [ isFetching, setFetching ] = useState(true);
  const { data } = useSelector(({ orderReducer }) => orderReducer[type]);
  const dispatch = useDispatch();
  useEffect(() => {
    let ordersRequest;
    if (type === 'openOrders') {
      ordersRequest = fetchOpenOrders;
    } else {
      ordersRequest = fetchCloseOrders;
    }

    Promise.all([ dispatch(fetchPortfolioItems()), dispatch(ordersRequest()), dispatch(fetchPlatforms()) ])
    .then(() => setFetching(false));
  }, []);
  if (isFetching) {
    return <OrderLoader />;
  }

  return data.map(({ id }, index) => (
    <OrderItem
      key={ id }
      index={ index }
      isExpanded={ dataListExpanded[id] }
      handleDataItemToggle={ handleDataItemToggle }
      type={ type }
    />
  ));
};

const Orders = ({
  history: { push },
  location: { pathname }
}) => {
  const [ dataListExpanded, setDataListExpanded ] = useState({});
  const activeTab = tabItems.find(({ name }) => pathname.includes(name));
  const handleTabClick = (_event, tabIndex) => push(`/orders${tabItems[tabIndex].name}`);

  const handleDataItemToggle = id => setDataListExpanded(prevState => ({ ...prevState, [id]: !dataListExpanded[id] }));

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
                <OrderType
                  type="openOrders"
                  dataListExpanded={ dataListExpanded }
                  handleDataItemToggle={ handleDataItemToggle }
                />
              </DataList>
            ) } />
            <Route exact path="/orders/closed" render={ () => (
              <DataList aria-label="past-orders">
                <OrderType
                  type="closedOrders"
                  dataListExpanded={ dataListExpanded }
                  handleDataItemToggle={ handleDataItemToggle }
                />
              </DataList>
            ) } />
          </GridItem>
        </Grid>
      </Section>
    </Fragment>
  );
};

Orders.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  location: PropTypes.shape({ pathname: PropTypes.string.isRequired }).isRequired,
  fetchPlatforms: PropTypes.func.isRequired
};

export default withRouter(Orders);
