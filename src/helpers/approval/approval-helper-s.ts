import {
  Workflow,
  ResourceObject
} from '@redhat-cloud-services/approval-client';
import { getWorkflowApi, getAxiosInstance } from '../shared/user-login';
import { APPROVAL_API_BASE } from '../../utilities/constants';
import { defaultSettings, PaginationConfiguration } from '../shared/pagination';
import {
  ApiCollectionResponse,
  SelectOptions,
  InternalResourceObject
} from '../../types/common-types';

export const getApprovalWorkflows = (): Promise<ApiCollectionResponse<
  Workflow
>> => getAxiosInstance().get(`${APPROVAL_API_BASE}/workflows/`);

export const loadWorkflowOptions = (
  filterValue = '',
  initialLookup: string[] = []
): Promise<SelectOptions> => {
  const initialLookupQuery = initialLookup
    .map((workflow) => `id=${workflow}`)
    .join('&');

  return getAxiosInstance()
    .get(
      `${APPROVAL_API_BASE}/workflows/?search=${filterValue}&${initialLookupQuery ||
        ''}`
    )
    .then(({ results }) =>
      results.map(({ id, name }: Workflow) => ({ label: name, value: id }))
    );
};

export const linkWorkflow = (wf: string, resourceObject: ResourceObject) =>
  getAxiosInstance().post(
    `${APPROVAL_API_BASE}/workflows/${wf}/link/`,
    resourceObject
  );

export const unlinkWorkflow = (wf: string, resourceObject: ResourceObject) =>
  getAxiosInstance().post(
    `${APPROVAL_API_BASE}/workflows/${wf}/unlink/`,
    resourceObject
  );

export const updateWorkflows = (
  unlinkIds: string[],
  linkIds: string[],
  resourceObject: ResourceObject
): Promise<void[]> => {
  const unlinkPromises = unlinkIds
    ? unlinkIds.map((wf) => unlinkWorkflow(wf, resourceObject))
    : [];
  const linkPromises = linkIds
    ? linkIds.map((wf) => linkWorkflow(wf, resourceObject))
    : [];
  return (Promise.all([
    ...unlinkPromises,
    ...linkPromises
  ]) as unknown) as Promise<void[]>;
};

export const listWorkflowsForObject = (
  resourceObject: InternalResourceObject,
  pagination: PaginationConfiguration = {
    limit: defaultSettings.limit,
    offset: defaultSettings.offset
  },
  filter = ''
): Promise<ApiCollectionResponse<Workflow>> => {
  const objectQuery = `app_name=${resourceObject.appName}&object_type=${resourceObject.objectType}&object_id=${resourceObject.objectId}`;
  const paginationQuery = `&page_size=${
    pagination.limit
  }&page=${pagination.offset || 1}`;
  const filterQuery = `&filter[name][contains]=${filter}`;
  return getAxiosInstance().get(
    `${APPROVAL_API_BASE}/workflows?${objectQuery}${filterQuery}${paginationQuery}`
  );
};
