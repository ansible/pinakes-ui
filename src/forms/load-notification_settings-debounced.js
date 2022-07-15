import asyncDebounce from '../utilities/async-form-validator';
import { fetchNotificationSettingsOptions } from '../helpers/notification/notification-helper';

export default asyncDebounce(fetchNotificationSettingsOptions);
