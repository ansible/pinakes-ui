/* eslint-disable react/prop-types */
import React, { useState, Fragment } from 'react';
import { ActionGroup, Button } from '@patternfly/react-core';
import { useDispatch } from 'react-redux';

import { cancelOrder } from '../../../redux/actions/order-actions';
import CancelOrderModal from '../cancel-order-modal';
import ordersMessages from '../../../messages/orders.messages';
import useFormatMessage from '../../../utilities/use-format-message';

const CANCELABLE_STATES = ['Approval Pending'];

const canCancel = (state = '') => CANCELABLE_STATES.includes(state);

export interface OrderToolbarActions {
  state?: string;
  orderId: string;
  portfolioItemName: string;
}
const OrderToolbarActions: React.ComponentType<OrderToolbarActions> = ({
  state,
  orderId,
  portfolioItemName
}) => {
  const formatMessage = useFormatMessage();
  const dispatch = useDispatch();
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  return (
    <Fragment>
      <CancelOrderModal
        onClose={() => setCancelModalOpen(false)}
        isOpen={cancelModalOpen}
        cancelOrder={() => {
          setCancelModalOpen(false);
          dispatch(cancelOrder(orderId));
        }}
        name={portfolioItemName}
      />
      <ActionGroup>
        {canCancel(state) && (
          <Button
            onClick={() => setCancelModalOpen(true)}
            isDisabled={!canCancel(state)}
            type="button"
            className="pf-u-mr-md"
            id="cancel-order-action"
          >
            {formatMessage(ordersMessages.cancelOrder)}
          </Button>
        )}
      </ActionGroup>
    </Fragment>
  );
};

export default OrderToolbarActions;
