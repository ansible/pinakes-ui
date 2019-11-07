import React, { Fragment, useEffect } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Grid, GridItem, Tabs, Tab } from '@patternfly/react-core';
import { Section } from '@redhat-cloud-services/frontend-components';

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
  useEffect(() => {
    insights.chrome.appNavClick({ id: 'orders', secondaryNav: true });
  }, []);

  const activeTab = tabItems.find(({ name }) => pathname.includes(name));
  const handleTabClick = (_event, tabIndex) => push(`/orders${tabItems[tabIndex].name}`);

  const OrderTabs = () => (
    <Tabs className="pf-u-mt-md" activeKey={ activeTab ? activeTab.eventKey : 0 } onSelect={ handleTabClick }>
      { tabItems.map((item) => <Tab title={ item.title } key={ item.eventKey } eventKey={ item.eventKey } name={ item.name }/>) }
    </Tabs>
  );
  return (
    <Fragment>
      <ToolbarRenderer schema={ createOrdersToolbarSchema({ Tabs: OrderTabs }) } />
      <Section type="content">
        <Grid gutter="md">
          <GridItem>
            <Switch>
              <Route path="/orders/closed" render={ () => (
                <OrdersList
                  type="closedOrders"
                />
              ) } />
              <Route path={ [ '/orders', '/orders/open' ] } render={ () => (
                <OrdersList
                  type="openOrders"
                />
              ) } />
            </Switch>
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
