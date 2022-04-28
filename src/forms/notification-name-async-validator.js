import { fetchNotificationSettingByName } from '../helpers/notification/notification-helper';
import asyncDebounce from '../utilities/async-form-validator';
import formMessages from '../messages/form.messages';

const validateName = (name, id, intl) =>
  fetchNotificationSettingByName(name).then(({ data }) => {
    const notificationSetting = id
      ? data.find((ns) => name === ns.name && id !== ns.id)
      : data.find((ns) => name === ns.name);

    if (notificationSetting) {
      throw intl.formatMessage(formMessages.nameTaken);
    }
  });

export default asyncDebounce(validateName);
