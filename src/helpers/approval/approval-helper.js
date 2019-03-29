import { APPROVAL_API_BASE } from '../../utilities/constants';

export const getApprovalWorkflows = () => fetch(`${APPROVAL_API_BASE}/workflows`).then(data => data.json());
