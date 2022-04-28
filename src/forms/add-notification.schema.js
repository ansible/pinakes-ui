import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import formMessages from '../messages/form.messages';
import debouncedValidatorName from './notification-name-async-validator';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';

const addNotificationSchema = (intl, id) => ({
  fields: [
    {
      component: componentTypes.TEXT_FIELD,
      name: 'name',
      isRequired: true,
      id: 'notification-title',
      label: intl.formatMessage(formMessages.notificationSettingName),
      validate: [
        (value) => debouncedValidatorName(value, id, intl),
        {
          type: validatorTypes.REQUIRED,
          message: intl.formatMessage(formMessages.enterNotificationSettingName)
        }
      ]
    },
    {
      component: componentTypes.TEXTAREA,
      name: 'description',
      id: 'notification-description',
      label: intl.formatMessage(formMessages.description)
    }
  ]
});

export default addNotificationSchema;
