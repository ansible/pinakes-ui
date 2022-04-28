import React from 'react';
import PropTypes from 'prop-types';
import { useLocation, useHistory } from 'react-router-dom';
import { Tabs, Tab, TabTitleText } from '@patternfly/react-core';

import apsTabsMessages from '../../messages/app-tabs.messages';
import { useIntl } from 'react-intl';

const approvalTabItems = [
  {
    eventKey: 0,
    message: apsTabsMessages.myRequests,
    name: '/approval/requests'
  },
  {
    eventKey: 1,
    message: apsTabsMessages.allRequests,
    name: '/approval/allrequests'
  },
  {
    eventKey: 2,
    message: apsTabsMessages.approvalProccess,
    name: '/approval/workflows'
  },
  {
    eventKey: 3,
    message: apsTabsMessages.templates,
    name: '/approval/templates'
  },
  {
    eventKey: 4,
    message: apsTabsMessages.notificationSettings,
    name: '/approval/notifications'
  }
];

export const AppTabs = ({ tabItems = approvalTabItems }) => {
  const intl = useIntl();
  const history = useHistory();
  const { pathname, search } = useLocation();
  const activeTab = tabItems.find(({ name }) => pathname.includes(name));
  const handleTabClick = (_event, tabIndex) =>
    history.push({ pathname: tabItems[tabIndex].name, search });

  return (
    <Tabs
      className="pf-u-mt-sm"
      activeKey={activeTab ? activeTab.eventKey : 0}
      onSelect={handleTabClick}
    >
      {tabItems.map((item) => (
        <Tab
          title={
            <TabTitleText>{intl.formatMessage(item.message)}</TabTitleText>
          }
          key={item.eventKey}
          eventKey={item.eventKey}
          name={item.name}
        />
      ))}
    </Tabs>
  );
};

AppTabs.propTypes = {
  tabItems: PropTypes.array
};
