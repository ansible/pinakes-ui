/* eslint-disable react/prop-types */
import React, { useState, Fragment } from 'react';
import { ActionGroup, Button } from '@patternfly/react-core';
import { useDispatch } from 'react-redux';

import { cancelOrder } from '../../../redux/actions/order-actions-s';
import CancelOrderModal from '../cancel-order-modal';
import ordersMessages from '../../../messages/orders.messages';
import useFormatMessage from '../../../utilities/use-format-message';
import { PORTFOLIO_ITEM_ORDER_ROUTE } from '../../../constants/routes';
import useEnhancedHistory from '../../../utilities/use-enhanced-history';

const CANCELABLE_STATES = ['Approval Pending'];
const ORDERABLE_STATES = ['Completed'];

const canCancel = (state = '') => CANCELABLE_STATES.includes(state);

export interface OrderToolbarActions {
  state?: string;
  orderId: string;
  portfolioItemName: string;
  portfolioItemId: string;
  portfolioId: string;
  sourceId: string;
  orderable: boolean;
  icon_url: string;
}
const OrderToolbarActions: React.ComponentType<OrderToolbarActions> = ({
  state,
  orderId,
  portfolioItemName,
  portfolioItemId,
  portfolioId,
  sourceId,
  orderable = false,
  icon_url
}) => {
  const formatMessage = useFormatMessage();
  const dispatch = useDispatch();
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const history = useEnhancedHistory();
  const canReorder = () =>
    orderable && state && ORDERABLE_STATES.includes(state);

  const onReorder = (
    portfolioId: string,
    portfolioItemId: string,
    sourceId: string
  ) => {
    history.push({
      pathname: PORTFOLIO_ITEM_ORDER_ROUTE,
      search: `?portfolio=${portfolioId}&portfolio-item=${portfolioItemId}&source=${sourceId}`
    });
  };

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
            ouiaId="cancel-order-action"
          >
            {formatMessage(ordersMessages.cancelOrder)}
          </Button>
        )}
        {canReorder() && (
          <Button
            onClick={() => onReorder(portfolioId, portfolioItemId, sourceId)}
            isDisabled={!canReorder()}
            type="button"
            className="pf-u-mr-md"
            id="reorder-order-action"
            ouiaId="reorder-order-action"
          >
            {formatMessage(ordersMessages.reOrder)}
          </Button>
        )}
      </ActionGroup>
    </Fragment>
  );
};

export default OrderToolbarActions;
