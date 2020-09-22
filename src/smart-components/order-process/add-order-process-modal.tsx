/* eslint-disable react/prop-types */
import React, { useReducer, useEffect, Reducer } from 'react';
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
import { OrderProcess } from '@redhat-cloud-services/catalog-client';
import { Schema } from '@data-driven-forms/react-form-renderer';
import { CatalogRootState } from '../../types/redux';
import { Full } from '../../types/common-types';

interface OrderProcessModalState {
  initialValues?: Partial<OrderProcess>;
  schema?: Schema;
  isLoading: boolean;
}

interface OrderProcessModalStateAction {
  type: 'loaded';
  initialValues: Partial<OrderProcess>;
  schema: Schema;
}
const reducer = (
  state: OrderProcessModalState,
  { type, initialValues, schema }: OrderProcessModalStateAction
) => {
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

export interface AddOrderProcessProps {
  edit?: boolean;
}
const AddOrderProcess: React.ComponentType<AddOrderProcessProps> = ({
  edit = false
}) => {
  const dispatch = useDispatch();
  const [{ order_process }] = useQuery(['order_process']);
  const data = useSelector<CatalogRootState, Partial<OrderProcess> | undefined>(
    ({
      orderProcessReducer: {
        orderProcesses: { data }
      }
    }) => (edit ? data.find(({ id }) => id === order_process) : {})
  );
  const { push } = useEnhancedHistory({ keepHash: true });
  const intl = useIntl();
  const loadedProcess = useOrderProcess(order_process);

  const [{ initialValues }, stateDispatch] = useReducer<
    Reducer<OrderProcessModalState, OrderProcessModalStateAction>
  >(reducer, {
    isLoading: true
  });

  useEffect(() => {
    if (!loadedProcess && loadedProcess !== undefined) {
      (fetchOrderProcess(order_process) as Promise<Full<OrderProcess>>).then(
        (data) =>
          stateDispatch({
            type: 'loaded',
            initialValues: data,
            schema: createOrderProcessSchema(intl, data.id)
          })
      );
    } else if (typeof loadedProcess !== 'undefined') {
      stateDispatch({
        type: 'loaded',
        initialValues: loadedProcess,
        schema: createOrderProcessSchema(intl, loadedProcess.id!)
      });
    }
  }, []);

  const onCancel = () => push(ORDER_PROCESSES_ROUTE);

  const onSave = (values: Partial<OrderProcess>) => {
    const submitAction = edit
      ? () => updateOrderProcess(order_process, values, intl)
      : () => addOrderProcess(values, intl);
    onCancel();

    return dispatch(submitAction() as Promise<void>).then(() =>
      dispatch(fetchOrderProcesses())
    );
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

export default AddOrderProcess;
