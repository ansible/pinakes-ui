import { getWorkflowApi, getAxiosInstance } from '../shared/user-login';
import { APPROVAL_API_BASE } from '../../utilities/constants';

export const getApprovalWorkflows = () => getWorkflowApi().listWorkflows();

export const loadWorkflowOptions = (filterValue = '') =>
  getAxiosInstance().get(`${APPROVAL_API_BASE}/workflows${filterValue.length > 0
    ? `/?filter[name][contains]=${filterValue}`
    : ''}`)
  .then(({ data }) => data.map(({ id, name }) => ({ label: name, value: id })));
