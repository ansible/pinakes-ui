import React from 'react';
import {
  ADMIN_PERSONA,
  APPROVAL_ADMIN_PERSONA,
  isStandalone
} from '../../helpers/shared/approval-helpers';
import RequestsList from './requests-list';
import routes from '../../constants/approval-routes';

const AllRequests = () => {
  return (
    <RequestsList
      persona={isStandalone() ? ADMIN_PERSONA : APPROVAL_ADMIN_PERSONA}
      indexpath={routes.allrequest}
    />
  );
};

export default AllRequests;
