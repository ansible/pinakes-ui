import { getWorkflowApi } from '../shared/user-login';

export const getApprovalWorkflows = () => getWorkflowApi().listWorkflows();
