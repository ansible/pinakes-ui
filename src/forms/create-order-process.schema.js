import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/dist/cjs/validator-types';

import formsMessages from '../messages/forms.messages';
import labelMessages from '../messages/labels.messages';
import debouncedValidatorName from './name-async-validator';

/**
 * Creates a data-driven-form schema for adding an order processes
 * @param openApiSchema
 * @param name
 */
const createOrderProcessSchema = (intl, id) => {
  return {
    fields: [
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
        label: intl.formatMessage(labelMessages.description)
      }
    ]
  };
};

export default createOrderProcessSchema;
