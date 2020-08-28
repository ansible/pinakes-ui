import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/dist/cjs/validator-types';

import labelMessages from '../messages/labels.messages';
import debouncedValidatorName from './name-async-validator';
import orderProcessesMessages from '../messages/order-processes.messages';
import setItemsSelectSchema from './set-portfolio-item.schema';
import { BEFORE_TYPE, AFTER_TYPE } from '../utilities/constants';

/**
 * Creates a data-driven-form schema for adding an order processes
 * @param {object} intl React.intl with formatMessage function
 * @param {string} id Id of order process (when editing)
 */
const createOrderProcessSchema = (intl, id) => {
  return {
    fields: [
      {
        component: componentTypes.TEXT_FIELD,
        name: 'name',
        isRequired: true,
        id: 'order-process-name',
        label: intl.formatMessage(orderProcessesMessages.orderProcessName),
        validate: [
          (value) => debouncedValidatorName(value, id, intl),
          {
            type: validatorTypes.REQUIRED,
            message: intl.formatMessage(
              orderProcessesMessages.enterOrderProcessName
            )
          }
        ]
      },
      {
        component: componentTypes.TEXTAREA,
        name: 'description',
        id: 'order-process-description',
        label: intl.formatMessage(labelMessages.description)
      },
      ...setItemsSelectSchema(BEFORE_TYPE, intl),
      ...setItemsSelectSchema(AFTER_TYPE, intl)
    ]
  };
};

export default createOrderProcessSchema;
