import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import formMessages from '../messages/form.messages';
import debouncedValidatorName from './approval-name-async-validator';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';
import notificationMessages from "../messages/notification.messages";
import loadNotificationTypesOptions from "./load-notification_types-debounced";
import templateMessages from "../messages/templates.messages";

const addTemplateSchema = (intl, id) => ({
  fields: [
    {
      component: componentTypes.TEXT_FIELD,
      name: 'title',
      isRequired: true,
      id: 'template-title',
      label: intl.formatMessage(formMessages.templateTitle),
      validate: [
        (value) => debouncedValidatorName(value, id, intl),
        {
          type: validatorTypes.REQUIRED,
          message: intl.formatMessage(formMessages.enterTemplateTitle)
        }
      ]
    },
    {
      component: componentTypes.TEXTAREA,
      name: 'description',
      id: 'template-description',
      label: intl.formatMessage(formMessages.description)
    },
    {
      component: componentTypes.SELECT,
      label: intl.formatMessage(templateMessages.processMethod),
      name: 'process_method',
      simpleValue: true,
      loadOptions: loadNotificationSettings
    },
    {
      component: componentTypes.SELECT,
      label: intl.formatMessage(templateMessages.signalMethod),
      name: 'signal_method',
      simpleValue: true,
      loadOptions: loadNotificationSettings
    }
  ]
});

export default addTemplateSchema;
