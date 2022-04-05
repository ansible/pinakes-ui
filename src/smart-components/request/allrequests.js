import React from 'react';
import { ADMIN_PERSONA, APPROVAL_ADMIN_PERSONA, isStandalone } from '../../helpers/shared/helpers';
import RequestsList from './requests-list';
import routes from '../../constants/routes';

const AllRequests = () => (
  <RequestsList
    persona={ isStandalone() ? ADMIN_PERSONA : APPROVAL_ADMIN_PERSONA }
    indexpath={ routes.allrequest }
  />
);

export default AllRequests;
