import { fetchOrderProcessByName } from '../helpers/order-process/order-process-helper';
import asyncFormValidator from '../utilities/async-form-validator';
import formMessages from '../messages/form.messages';

const validateName = (name, id, intl) => fetchOrderProcessByName(name)
.then(({ data }) => {
  const order_process = id ?
    data.find(op => name === op.name && id !== op.id)
    : data.find(op => name === op.name);

  if (order_process) {
    throw intl.formatMessage(formMessages.nameTaken);
  }
});

export default asyncFormValidator(validateName);
