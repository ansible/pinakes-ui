import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/dist/cjs/validator-types';
import Schema from '@data-driven-forms/react-form-renderer/dist/cjs/schema';

import labelMessages from '../messages/labels.messages';
import debouncedValidatorName from './name-async-validator';
import orderProcessesMessages from '../messages/order-processes.messages';
import setItemsSelectSchema from './set-portfolio-item.schema';
import { BEFORE_TYPE, AFTER_TYPE, RETURN_TYPE } from '../utilities/constants';
import { IntlShape } from 'react-intl';

/**
 * Creates a data-driven-form schema for adding an order processes
 * @param {object} intl React.intl with formatMessage function
 * @param {string} id Id of order process (when editing)
 */
const createOrderProcessSchema = (intl: IntlShape, id: string): Schema => {
  return {
    fields: [
      {
        component: componentTypes.RADIO,
        name: 'order-process-type',
        isRequired: true,
        id: 'order-process-type',
        label: intl.formatMessage(orderProcessesMessages.orderProcessType),
        options: [
          {
            label: 'ITSM',
            value: 'itsm'
          },
          {
            label: 'Return',
            value: 'return'
          }
        ]
      },
      {
        component: componentTypes.TEXT_FIELD,
        name: 'name',
        isRequired: true,
        id: 'order-process-name',
        label: intl.formatMessage(orderProcessesMessages.orderProcessName),
        validate: [
          (value: string) => debouncedValidatorName(value, id, intl),
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
      ...setItemsSelectSchema(BEFORE_TYPE, intl, {
        when: 'order-process-type',
        is: 'itsm'
      }),
      ...setItemsSelectSchema(AFTER_TYPE, intl, {
        when: 'order-process-type',
        is: 'itsm'
      }),
      ...setItemsSelectSchema(RETURN_TYPE, intl, {
        when: 'order-process-type',
        is: 'return'
      })
    ]
  };
};

export default createOrderProcessSchema;
