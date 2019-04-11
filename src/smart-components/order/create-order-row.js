import React from 'react';
import { CheckIcon, InProgressIcon } from '@patternfly/react-icons';
import { createDateString } from '../../helpers/shared/helpers';

const completedWhiteList = state => [ 'Order Completed', 'finished' ].includes(state);

const countFinishedSteps = step => step.filter(({ state }) => completedWhiteList(state));

const iconsMapper  = name => ({
  finished: <CheckIcon />,
  'Order Completed': <CheckIcon />
})[name] || <span><InProgressIcon /> &nbsp; Pending</span>;

const createTableRows = order => [{
  reason: 'Order initiated',
  requester: 'System',
  updated_at: order.orderItems[0] && createDateString(order.orderItems[0].updated_at || order.orderItems[0].created_at),
  state: order.orderItems[0] && order.orderItems[0].state
}, {
  reason: 'Approval',
  requester: 'System',
  updated_at: order.requests[0] && createDateString(order.requests[0].updated_at || order.requests[0].created_at),
  state: order.requests[0] && order.requests[0].state
}, {
  reason: 'Provision',
  requester: 'System',
  updated_at: createDateString(order.ordered_at || order.created_at),
  state: order.state
}, {
  reason: 'Order completed',
  requester: 'System',
  updated_at: createDateString(order.ordered_at || order.created_at),
  state: order.state
}];

const createOrderRow = order => {
  const initialSteps = createTableRows(order);
  const finishedSteps = countFinishedSteps(initialSteps);
  const steps = initialSteps.map((item, index) => ({
    ...item,
    requester: index <= finishedSteps.length ? item.requester : null,
    state: index <= finishedSteps.length ? iconsMapper(item.state) : null,
    updated_at: index <= finishedSteps.length ? item.updated_at : null,
    isFinished: index === finishedSteps.length - 1
  }));

  return { steps, finishedSteps };
};

export default createOrderRow;
