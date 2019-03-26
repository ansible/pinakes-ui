import { APPROVAL_API_BASE } from '../../Utilities/Constants';

export const getApprovalWorkflows = () => fetch(`${APPROVAL_API_BASE}/workflows`).then(data => data.json());
