import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { Modal } from '@patternfly/react-core';

import { ORDER_PROCESSES_ROUTE } from '../../constants/routes';
import createOrderProcessSchema from '../../forms/create-order-process.schema';
import {
  addOrderProcess,
  fetchOrderProcesses,
  updateOrderProcess
} from '../../redux/actions/order-process-actions';
import FormRenderer from '../common/form-renderer';
import labelMessages from '../../messages/labels.messages';
import useQuery from '../../utilities/use-query';
import orderProcessesMessages from '../../messages/order-processes.messages';

const AddOrderProcess = ({ edit }) => {
  const dispatch = useDispatch();
  const [{ order_process }] = useQuery(['order_process']);
  const data = useSelector(
    ({
      orderProcessReducer: {
        orderProcesses: { data }
      }
    }) => (edit ? data.find(({ id }) => id === order_process) : {})
  );
  const { push } = useHistory();
  const intl = useIntl();

  const onCancel = () => push(ORDER_PROCESSES_ROUTE);

  const onSave = (values) => {
    const submitAction = edit
      ? () => updateOrderProcess(order_process, values, intl)
      : () => addOrderProcess(values, intl);
    onCancel();

    return dispatch(submitAction()).then(() => dispatch(fetchOrderProcesses()));
  };

  if (edit && !data) {
    return null;
  }

  const initialValues = { name: data.name, description: data.description };

  return (
    <Modal
      isOpen
      onClose={onCancel}
      title={intl.formatMessage(
        edit
          ? orderProcessesMessages.updateOrderProcess
          : orderProcessesMessages.createOrderProcess
      )}
      variant="small"
    >
      <FormRenderer
        initialValues={initialValues}
        onSubmit={onSave}
        onCancel={onCancel}
        schema={createOrderProcessSchema(intl, order_process)}
        templateProps={{
          submitLabel: edit
            ? intl.formatMessage(labelMessages.save)
            : intl.formatMessage(labelMessages.create),
          disableSubmit: ['validating', 'pristine']
        }}
      />
    </Modal>
  );
};

AddOrderProcess.propTypes = {
  edit: PropTypes.bool
};

AddOrderProcess.defaultProps = {
  edit: false
};

export default AddOrderProcess;
