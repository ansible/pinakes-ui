import * as UserLogin from '../../../helpers/shared/user-login';
import * as ServicePlanHelper from '../../../helpers/order/service-plan-helper-s';
import { getAxiosInstance } from '../../../helpers/shared/user-login';
import { mockApi } from '../../../helpers/shared/__mocks__/user-login';
import { CATALOG_API_BASE } from '../../../utilities/constants';

describe('Service Plan helper', () => {
  const servicePlanMock = {
    id: 'service-plan-id',
    name: 'service-plan-name'
  };
  const axiosInstance = UserLogin.getAxiosInstance();

  const axiosPostSpy = jest.spyOn(axiosInstance, 'post');
  const axiosPatchSpy = jest.spyOn(axiosInstance, 'patch');
  const axiosSpy = jest.spyOn(axiosInstance, 'get');
  afterEach(() => {
    axiosSpy.mockReset();
  });

  it('should call fetch the service plans', async () => {
    axiosSpy.mockResolvedValueOnce(servicePlanMock);
    const response = await ServicePlanHelper.getServicePlans();
    expect(response).toEqual(servicePlanMock);
  });

  it('should call patchServicePlanModified', () => {
    ServicePlanHelper.patchServicePlanModified('1', {
      name: 'service plan',
      schema: { fields: [{ field: 'test schema' }] }
    });
    expect(axiosPatchSpy).toHaveBeenCalledWith(
      `${CATALOG_API_BASE}/service_plans/1/`,
      {
        name: 'service plan',
        schema: { fields: [{ field: 'test schema' }] }
      }
    );
  });

  it('should call resetServicePlanModified', () => {
    ServicePlanHelper.resetServicePlanModified('1', {
      name: 'service plan',
      schema: { fields: [{ field: 'test schema' }] }
    });
    expect(axiosPostSpy).toHaveBeenCalledWith(
      `${CATALOG_API_BASE}/service_plans/1/reset/`
    );
  });
});
