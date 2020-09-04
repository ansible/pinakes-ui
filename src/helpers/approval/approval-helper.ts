import {
  Workflow,
  ResourceObject
} from '@redhat-cloud-services/approval-client';
import { getWorkflowApi, getAxiosInstance } from '../shared/user-login';
import { APPROVAL_API_BASE } from '../../utilities/constants';
import { defaultSettings } from '../shared/pagination';
import {
  ApiCollectionResponse,
  SelectOptions,
  InternalResourceObject
} from '../../types/common-types';

export const getApprovalWorkflows = (): Promise<ApiCollectionResponse<
  Workflow
>> =>
  (getWorkflowApi().listWorkflows() as unknown) as Promise<
    ApiCollectionResponse<Workflow>
  >;

export const loadWorkflowOptions = (
  filterValue = '',
  initialLookup: string[] = []
): Promise<SelectOptions> => {
  const initialLookupQuery = initialLookup
    .map((workflow) => `filter[id][]=${workflow}`)
    .join('&');

  return getAxiosInstance()
    .get(
      `${APPROVAL_API_BASE}/workflows?filter[name][contains]=${filterValue}&${initialLookupQuery ||
        ''}`
    )
    .then(({ data }) =>
      data.map(({ id, name }: Workflow) => ({ label: name, value: id }))
    );
};

export const updateWorkflows = (
  unlinkIds: string[],
  linkIds: string[],
  resourceObject: ResourceObject
): Promise<void[]> => {
  const unlinkPromises = unlinkIds
    ? unlinkIds.map((wf) => getWorkflowApi().unlinkWorkflow(wf, resourceObject))
    : [];
  const linkPromises = linkIds
    ? linkIds.map((wf) => getWorkflowApi().linkWorkflow(wf, resourceObject))
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
  const paginationQuery = `&limit=${pagination.limit}&offset=${pagination.offset}`;
  const filterQuery = `&filter[name][contains]=${filter}`;
  return getAxiosInstance().get(
    `${APPROVAL_API_BASE}/workflows?${objectQuery}${filterQuery}${paginationQuery}`
  );
};
