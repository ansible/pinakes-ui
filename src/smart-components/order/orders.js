import React, { Fragment, useState } from 'react';
import { Route, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Grid, GridItem, DataList, Tabs, Tab } from '@patternfly/react-core';
import { Section } from '@redhat-cloud-services/frontend-components';

import OrderMessagesModal from './order-messages-modal';
import ToolbarRenderer from '../../toolbar/toolbar-renderer';
import createOrdersToolbarSchema from '../../toolbar/schemas/orders-toolbar.schema';

import './orders.scss';
import OrdersList from './orders-list';

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
                <OrdersList
                  type="openOrders"
                  dataListExpanded={ dataListExpanded }
                  handleDataItemToggle={ handleDataItemToggle }
                />
              </DataList>
            ) } />
            <Route exact path="/orders/closed" render={ () => (
              <DataList aria-label="past-orders">
                <OrdersList
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
  location: PropTypes.shape({ pathname: PropTypes.string.isRequired }).isRequired
};

export default withRouter(Orders);
