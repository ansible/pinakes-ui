import React from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab } from '@patternfly/react-core';
import { useHistory, useLocation } from 'react-router-dom';

const AppTabs = ({ tabItems }) => {
  const history = useHistory();
  const location = useLocation();
  const activeTab = tabItems.find(({ name }) => location.pathname.includes(name));
  const handleTabClick = (_event, tabIndex) => history.push(tabItems[tabIndex].name);

  return (
    <Tabs activeKey={ activeTab ? activeTab.eventKey : 0 } onSelect={ handleTabClick }>
      { tabItems.map((item) => <Tab title={ item.title } key={ item.eventKey } eventKey={ item.eventKey } name={ item.name }/>) }
    </Tabs>
  );
};

AppTabs.propTypes = {
  tabItems: PropTypes.array.isRequired
};

export default AppTabs;

