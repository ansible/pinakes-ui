import { IntlShape } from 'react-intl';
import { fetchOrderProcessByName } from '../helpers/order-process/order-process-helper';
import asyncFormValidator from '../utilities/async-form-validator';
import formsMessages from '../messages/forms.messages';

const validateName = (name: string, id: string, intl: IntlShape) =>
  fetchOrderProcessByName(name).then(({ data }) => {
    const order_process = id
      ? data.find((op) => name === op.name && id !== op.id)
      : data.find((op) => name === op.name);

    if (order_process) {
      throw intl.formatMessage(formsMessages.nameTaken);
    }
  });

export default asyncFormValidator(validateName);
