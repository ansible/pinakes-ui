import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { ADD_ORDER_PROCESS_ROUTE } from '../../../constants/routes';
import FormRenderer from '../../common/form-renderer';
import createOrderProcessSchema from '../../../forms/create-order-process.schema';
import {
  fetchOrderProcesses,
  createOrderProcess
} from '../../../redux/actions/order-process-actions';

const AddOrderProcess = () => {
  const dispatch = useDispatch();
  const { push } = useHistory();
  const intl = useIntl();

  const onSave = (values) => {
    push(ADD_ORDER_PROCESS_ROUTE);
    return dispatch(createOrderProcess(values, intl)).then(() =>
      dispatch(fetchOrderProcesses())
    );
  };

  const onCancel = () => push(ADD_ORDER_PROCESS_ROUTE);

  return (
    <FormRenderer
      showFormControls={false}
      onSubmit={onSave}
      onCancel={onCancel}
      schema={createOrderProcessSchema(intl)}
    />
  );
};

export default AddOrderProcess;
