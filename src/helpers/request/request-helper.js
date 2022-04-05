import { getAxiosInstance } from '../shared/user-login';
import { APPROVAL_API_BASE } from '../../utilities/constants';
import { defaultSettings } from '../shared/pagination';

const sortPropertiesMapper = (property) => ({
  'request-id': 'id',
  opened: 'created_at',
  requester: 'requester_name',
  status: 'state'
}[property] || property
);

const filterQuery = (filterValue) => {
  const query = [];
  if (filterValue.name) {
    query.push(`filter[name][contains_i]=${filterValue.name}`);
  }

  if (filterValue.requester) {
    query.push(`filter[requester_name][contains_i]=${filterValue.requester}`);
  }

  if (filterValue.decision) {
    filterValue.decision.forEach(dec => {
      query.push(`filter[decision][eq][]=${dec}`);
    });
  }

  return query.join('&');
};

export function fetchRequests(filter = {}, pagination = defaultSettings, persona = undefined, sortBy) {
  const personaQuery = persona ? `&persona=${persona}` : '';
  const paginationQuery = `&page_size=${Math.max(pagination.limit, 10)}&page=${pagination.offset || 1}`;
  const sortQuery = `&sort_by=${sortPropertiesMapper(sortBy.property)}:${sortBy.direction}`;
  const fetchUrl = `${APPROVAL_API_BASE}/requests/?${personaQuery}&${filterQuery(filter)}${paginationQuery}${sortQuery}`;
  return getAxiosInstance()({ method: 'get', url: fetchUrl });
}

export const fetchRequestTranscript = (requestId) => getAxiosInstance().get(`${APPROVAL_API_BASE}/requests/${requestId}/?extra=true`);

export const fetchRequestContent = (id) => {
  const fetchUrl = `${APPROVAL_API_BASE}/requests/${id}/content`;
  return getAxiosInstance()({ method: 'get', url: fetchUrl });
};

export async function fetchRequestWithSubrequests(id, persona) {
  const requestData = await fetchRequestTranscript(id, persona);
  return requestData;
}

export const createRequestAction = (requestId, actionIn) => getAxiosInstance().post(`${APPROVAL_API_BASE}/requests/${requestId}/actions/`, actionIn);
