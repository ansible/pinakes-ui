import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { ActionGroup, Button } from '@patternfly/react-core';
import { useDispatch } from 'react-redux';

import { cancelOrder } from '../../../redux/actions/order-actions';
import CancelOrderModal from '../cancel-order-modal';

const CANCELABLE_STATES = ['Approval Pending'];

const canCancel = (state) => CANCELABLE_STATES.includes(state);

const OrderToolbarActions = ({ state, orderId, portfolioItemName }) => {
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
        <Button
          onClick={() => setCancelModalOpen(true)}
          isDisabled={!canCancel(state)}
          type="button"
          className="pf-u-mr-md"
          id="cancel-order-action"
        >
          Cancel order
        </Button>
        <Button isDisabled type="button">
          Reorder
        </Button>
      </ActionGroup>
    </Fragment>
  );
};

OrderToolbarActions.propTypes = {
  state: PropTypes.string,
  orderId: PropTypes.string.isRequired,
  portfolioItemName: PropTypes.string.isRequired
};

export default OrderToolbarActions;
