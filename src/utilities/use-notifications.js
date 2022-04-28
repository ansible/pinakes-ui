import { shallowEqual, useSelector } from 'react-redux';

const useNotification = (id) => {
  const { notificationSettings } = useSelector(
    ({ notificationSettingsReducer: { notificationSettings } }) => ({
      notificationSettings
    }),
    shallowEqual
  );

  return (
    notificationSettings &&
    notificationSettings.data &&
    notificationSettings.data.find((n) => n.id === id)
  );
};

export default useNotification;
