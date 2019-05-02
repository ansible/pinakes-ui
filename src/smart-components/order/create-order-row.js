import React from 'react';
import { CheckCircleIcon, InProgressIcon, TimesCircleIcon } from '@patternfly/react-icons';

import { createDateString } from '../../helpers/shared/helpers';

const completedWhiteList = state => [ 'Order Completed', 'finished', 'Completed', 'approved' ].includes(state);
const failedList = state => [ 'Failed', 'denied', 'Denied' ].includes(state);

const countFinishedSteps = step => step.filter(({ state }) => !failedList(state) && completedWhiteList(state));

// const overrideOrderinitiated = (request = {}, orderItem = {}) => !failedList(orderItem.state) && completedWhiteList(request.state);

const iconsMapper  = name => ({
  finished: <span><CheckCircleIcon fill="#92D400" />&nbsp; Success</span>,
  'Order Completed': <CheckCircleIcon fill="#92D400" />,
  Completed: <span><CheckCircleIcon fill="#92D400" />&nbsp; Success</span>,
  approved: <span><CheckCircleIcon fill="#92D400" />&nbsp; Approved</span>,
  Failed: <span><TimesCircleIcon />&nbsp; Failed</span>,
  denied: <span><TimesCircleIcon />&nbsp; Denied</span>
})[name] || <span><InProgressIcon />&nbsp; Pending</span>;

const createTableRows = order => [{
  reason: 'Order initiated',
  requester: 'System',
  updated_at: order.orderItems[0] && createDateString(order.orderItems[0].updated_at || order.orderItems[0].created_at),
  state: 'finished',
  orderItemId: order.orderItems[0] && order.orderItems[0].id
}, {
  reason: 'Approval',
  requester: 'System',
  updated_at: order.requests[0] && createDateString(order.requests[0].updated_at || order.requests[0].created_at),
  state: order.requests[0] && order.requests[0].state,
  initialUpdate: order.requests[0] && (order.requests[0].updated_at || order.requests[0].created_at)
}, {
  reason: 'Provision',
  requester: 'System',
  updated_at: createDateString(order.ordered_at || order.created_at),
  state: order.state,
  initialUpdate: order.ordered_at || order.created_at
}, {
  reason: 'Order completed',
  requester: 'System',
  updated_at: createDateString(order.ordered_at || order.created_at),
  state: order.state,
  initialUpdate: order.ordered_at || order.created_at
}];

const createOrderRow = order => {
  const initialSteps = createTableRows(order);
  let finishedSteps = countFinishedSteps(initialSteps);
  const firstFailedIndex = initialSteps.findIndex(({ state }) => failedList(state));
  if (firstFailedIndex >= 0) {
    finishedSteps = finishedSteps.slice(0, firstFailedIndex);
  }

  const steps = initialSteps.map((item, index) => ({
    ...item,
    requester: index <= finishedSteps.length ? item.requester : null,
    state: index <= finishedSteps.length ? iconsMapper(item.state) : null,
    updated_at: index <= finishedSteps.length ? item.updated_at : null,
    isFinished: finishedSteps.length === index
  }));

  return { steps, finishedSteps };
};

export default createOrderRow;
