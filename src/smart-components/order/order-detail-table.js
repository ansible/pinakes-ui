import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button } from '@patternfly/react-core';
import { MessagesIcon } from '@patternfly/react-icons';
import StepLabel from './step-label';

const orderFailedStates = state => [ 'Failed', 'Denied' ].includes(state);

const OrderDetailTable = ({ orderId, onCancel, canCancel, requests, orderState }) => (
  <table className="requests-table">
    <thead>
      <tr>
        <th>
            Steps
        </th>
        <th>
            Performed by
        </th>
        <th>
            Date &amp; time
        </th>
        <th>
            Status
        </th>
        { canCancel && <th className="action-row"></th> }
      </tr>
    </thead>
    <tbody>
      { requests.map(({ reason, requester, updated_at, state, isFinished }, index) => (
        <tr key={ index } className={ `${isFinished ? 'finished' : ''} ${orderFailedStates(orderState) ? 'failed' : ''}` }>
          <td><StepLabel index={ index } text={ reason } /></td>
          <td>{ requester }</td>
          <td>{ updated_at }</td>
          <td>{ state }</td>
          { canCancel
            && <td>{ index === 0 && <Button id={ `cancel-order-${orderId}` } onClick={ onCancel } variant="secondary">Cancel</Button> }</td> }
        </tr>
      )) }
      <tr>
        <td>
          <Link to={ `/orders/${requests[0].orderItemId}/messages` }>
            <MessagesIcon /> Show progress messages
          </Link>
        </td>
      </tr>
    </tbody>
  </table>
);

OrderDetailTable.propTypes = {
  requests: PropTypes.arrayOf(PropTypes.shape({
    reason: PropTypes.string,
    requester: PropTypes.string,
    updated_at: PropTypes.string,
    state: PropTypes.oneOfType([ PropTypes.string, PropTypes.node ])
  })).isRequired,
  orderId: PropTypes.string.isRequired,
  orderState: PropTypes.string,
  onCancel: PropTypes.func,
  canCancel: PropTypes.bool
};

export default withRouter(OrderDetailTable);
