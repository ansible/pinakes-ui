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
import { Schema } from '@data-driven-forms/react-form-renderer';
import { CatalogRootState } from '../../types/redux';
import { OrderProcess } from '@redhat-cloud-services/catalog-client';
import { fetchOrderProcess } from '../../helpers/order-process/order-process-helper';

export interface OrderProcessWithType extends OrderProcess {
  order_process_type: string;
}

interface OrderProcessModalState {
  initialValues?: Partial<OrderProcessWithType>;
  schema?: Schema;
  isLoading: boolean;
}

interface OrderProcessModalStateAction {
  type: 'loaded';
  initialValues: Partial<OrderProcessWithType>;
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
    if (!loadedProcess && order_process) {
      fetchOrderProcess(order_process).then((data) => {
        return stateDispatch({
          type: 'loaded',
          initialValues: {
            ...data,
            order_process_type: (data as OrderProcess).return_portfolio_item_id
              ? 'return'
              : 'itsm'
          },
          schema: createOrderProcessSchema(
            intl,

            (data as OrderProcess).id || ''
          )
        });
      });
    } else if (typeof loadedProcess !== 'undefined') {
      stateDispatch({
        type: 'loaded',
        initialValues: {
          ...loadedProcess,
          order_process_type: loadedProcess.return_portfolio_item_id
            ? 'return'
            : 'itsm'
        },
        schema: createOrderProcessSchema(intl, loadedProcess.id!)
      });
    }
  }, []);

  const onCancel = () => push(ORDER_PROCESSES_ROUTE);

  const onSave = (values: Partial<OrderProcess>) => {
    console.log('Debug - onSave - data, values', data, values);
    const submitAction = edit
      ? () =>
          updateOrderProcess(
            order_process,
            data,
            { name: '', description: '', ...values },
            intl
          )
      : () => addOrderProcess(values, intl);
    onCancel();

    return dispatch(submitAction() as Promise<void>).then(() =>
      dispatch(fetchOrderProcesses())
    );
  };

  if (edit && !data) {
    return null;
  }
  console.log('Debug - initialValues: ', initialValues);
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
        onSubmit={onSave}
        onCancel={onCancel}
        schema={createOrderProcessSchema(intl, order_process)}
        initialValues={initialValues}
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
