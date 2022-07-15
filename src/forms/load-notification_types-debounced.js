import asyncDebounce from '../utilities/async-form-validator';
import { fetchNotificationTypes } from '../helpers/notification/notification-helper';

export default asyncDebounce(fetchNotificationTypes);
