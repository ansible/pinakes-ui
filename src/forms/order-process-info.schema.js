import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/dist/cjs/validator-types';

import debouncedValidatorName from './name-async-validator';
import formsMessages from '../messages/forms.messages';

const orderProcessInfoSchema = (intl, id) => [
  {
    component: componentTypes.TEXT_FIELD,
    name: 'name',
    isRequired: true,
    id: 'order-process-name',
    label: intl.formatMessage(formsMessages.orderProcessName),
    validate: [
      (value) => debouncedValidatorName(value, id, intl),
      {
        type: validatorTypes.REQUIRED,
        message: intl.formatMessage(formsMessages.enterOrderProcessName)
      }
    ]
  },
  {
    component: componentTypes.TEXTAREA,
    name: 'description',
    id: 'order-process-description',
    label: intl.formatMessage(formsMessages.description)
  }
];

export default orderProcessInfoSchema;
