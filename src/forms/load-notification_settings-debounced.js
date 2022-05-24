import asyncDebounce from '../utilities/async-form-validator';
import { fetchNotificationSettings } from '../helpers/notification/notification-helper';

export default asyncDebounce(fetchNotificationSettings);
