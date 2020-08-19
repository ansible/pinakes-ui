import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { Modal } from '@patternfly/react-core';

import { ORDER_PROCESSES_ROUTE } from '../../constants/routes';
import createOrderProcessSchema from '../../forms/create-order-process.schema';
import {
  addOrderProcess,
  fetchOrderProcesses
} from '../../redux/actions/order-process-actions';
import FormRenderer from '../common/form-renderer';
import labelMessages from '../../messages/labels.messages';

const AddOrderProcess = () => {
  const dispatch = useDispatch();
  const { push } = useHistory();
  const intl = useIntl();

  const onCancel = () => push(ORDER_PROCESSES_ROUTE);

  const onSave = (values) => {
    onCancel();

    return dispatch(addOrderProcess(values, intl)).then(() =>
      dispatch(fetchOrderProcesses())
    );
  };

  return (
    <Modal
      isOpen
      onClose={onCancel}
      title={intl.formatMessage(labelMessages.create)}
      variant="small"
    >
      <FormRenderer
        onSubmit={onSave}
        onCancel={onCancel}
        schema={createOrderProcessSchema(intl)}
        templateProps={{ disableSubmit: ['validating', 'pristine'] }}
      />
    </Modal>
  );
};

export default AddOrderProcess;
