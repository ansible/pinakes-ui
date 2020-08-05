import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { Modal } from '@patternfly/react-core';
import { ORDER_PROCESSES_ROUTE } from '../../constants/routes';
import createOrderProcessSchema from '../../forms/create-order-process.schema';
import formsMessages from '../../messages/forms.messages';
import {
  addOrderProcess,
  fetchOrderProcesses
} from '../../redux/actions/order-process-actions';
import FormRenderer from '../common/form-renderer';

const AddOrderProcess = () => {
  const dispatch = useDispatch();
  const { push } = useHistory();
  const intl = useIntl();

  const onSave = (values) => {
    push(ORDER_PROCESSES_ROUTE);

    return dispatch(addOrderProcess(values, intl)).then(() =>
      dispatch(fetchOrderProcesses())
    );
  };

  const onCancel = () => push(ORDER_PROCESSES_ROUTE);

  return (
    <Modal
      isOpen
      onClose={onCancel}
      title={intl.formatMessage(formsMessages.createOrderProcessTitle)}
      variant="small"
    >
      <FormRenderer
        onSubmit={onSave}
        onCancel={onCancel}
        schema={createOrderProcessSchema(intl)}
        disableSubmit={['validating']}
      />
    </Modal>
  );
};

export default AddOrderProcess;
