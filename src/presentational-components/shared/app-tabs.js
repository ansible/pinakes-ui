import React from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab } from '@patternfly/react-core';
import { useLocation } from 'react-router-dom';
import useEnhancedHistory from '../../utilities/use-enhanced-history';

const AppTabs = ({ tabItems }) => {
  const { push } = useEnhancedHistory();
  const { pathname, search } = useLocation();
  const activeTab = tabItems.find(({ name }) => pathname.includes(name));
  const handleTabClick = (_event, tabIndex) =>
    push({ pathname: tabItems[tabIndex].name, search });

  return (
    <Tabs
      activeKey={activeTab ? activeTab.eventKey : 0}
      onSelect={handleTabClick}
    >
      {tabItems.map((item) => (
        <Tab
          title={item.title}
          key={item.eventKey}
          eventKey={item.eventKey}
          name={item.name}
          disabled={item.disabled}
        />
      ))}
    </Tabs>
  );
};

AppTabs.propTypes = {
  tabItems: PropTypes.array.isRequired
};

export default AppTabs;
