import React, { ReactNode } from 'react';
import {
  ExclamationCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  PlusCircleIcon
} from '@patternfly/react-icons';

const orderStatusMapper: {
  Completed: { icon: ReactNode; color: 'green' };
  Ordered: { icon: ReactNode; color: 'grey' };
  Failed: { icon: ReactNode; color: 'red' };
  Canceled: { icon: ReactNode; color: 'orange' };
  Created: { icon: ReactNode; color: 'grey' };
  'Approval Pending': { icon: ReactNode; color: 'blue' };
  Approved: { icon: ReactNode; color: 'green' };
} = {
  Completed: { icon: <CheckCircleIcon />, color: 'green' },
  'Approval Pending': {
    icon: <ClockIcon />,
    color: 'blue'
  },
  Ordered: { icon: <PlusCircleIcon />, color: 'grey' },
  Failed: { icon: <ExclamationCircleIcon />, color: 'red' },
  Canceled: { icon: <ExclamationTriangleIcon />, color: 'orange' },
  Created: { icon: <PlusCircleIcon />, color: 'grey' },
  Approved: { icon: <CheckCircleIcon />, color: 'green' }
};

export default orderStatusMapper;
