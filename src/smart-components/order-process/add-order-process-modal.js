import React, { useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
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
import useEnhancedHistory from '../../utilities/use-enhanced-history';
import useOrderProcess from '../../utilities/use-order-process';
import { fetchOrderProcess } from '../../redux/actions/order-process-actions';

const reducer = (state, { type, initialValues, schema }) => {
  switch (type) {
    case 'loaded':
      return {
        ...state,
        initialValues,
        schema,
        isLoading: false
      };
    default:
      return state;
  }
};

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
  const { push } = useEnhancedHistory({ keepHash: true });
  const intl = useIntl();
  const loadedProcess = useOrderProcess(order_process);

  const [{ initialValues }, stateDispatch] = useReducer(reducer, {
    isLoading: true
  });

  useEffect(() => {
    if (!loadedProcess && loadedProcess !== undefined) {
      fetchOrderProcess(order_process).then((data) =>
        stateDispatch({
          type: 'loaded',
          initialValues: data,
          schema: createOrderProcessSchema(intl, data.id)
        })
      );
    } else if (loadedProcess !== undefined) {
      stateDispatch({
        type: 'loaded',
        initialValues: loadedProcess,
        schema: createOrderProcessSchema(intl, loadedProcess.id)
      });
    }
  }, []);

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
