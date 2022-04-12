import React from 'react';
import { ADMIN_PERSONA } from '../../helpers/shared/approval-helpers';
import RequestsList from './requests-list';
import routes from '../../constants/approval-routes';

const AllRequests = () => {
  return <RequestsList persona={ADMIN_PERSONA} indexpath={routes.allrequest} />;
};

export default AllRequests;
