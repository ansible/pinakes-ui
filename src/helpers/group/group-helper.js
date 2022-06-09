import { getAxiosInstance } from '../shared/user-login';
import { APPROVAL_API_BASE } from '../../utilities/approval-constants';

export const fetchFilterApprovalGroups = (filterValue) => {
  const filterQuery = `&name=${filterValue}`;
  return getAxiosInstance()
    .get(
      `${APPROVAL_API_BASE}/groups/?role=approval-approver&role=approval-admin${
        filterValue && filterValue.length > 0 ? filterQuery : ''
      }`
    )
    .then(({ data }) =>
      data && data.length > 0
        ? data.map(({ id, name }) => ({ label: name, value: id }))
        : undefined
    );
};
