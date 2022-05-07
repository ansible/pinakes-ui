import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from '@patternfly/react-core';
import NotificationSettingTableContext from './notification-setting-table-context';

export const SelectBox = ({ id }) => {
  const {
    selectedNotificationSettings,
    setSelectedNotificationSettings
  } = useContext(NotificationSettingTableContext);

  return (
    <Checkbox
      id={`select-${id}`}
      isChecked={selectedNotificationSettings.includes(id)}
      onChange={() => setSelectedNotificationSettings(id)}
    />
  );
};

SelectBox.propTypes = {
  id: PropTypes.string.isRequired
};

export const createRows = (data) =>
  data.map(({ id, name, notification_type }) => ({
    id,
    cells: [
      <React.Fragment key={`${id}-checkbox`}>
        <SelectBox id={id} />
      </React.Fragment>,
      name,
      notification_type
    ]
  }));
