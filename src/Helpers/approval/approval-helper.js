import { APROVAL_API_BASE } from '../../Utilities/Constants';

export const getApprovalWorkflow = () => fetch(`${APROVAL_API_BASE}/workflows`).then(data => data.json());
