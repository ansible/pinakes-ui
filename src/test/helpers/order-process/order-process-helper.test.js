// TODO migrate all order helper test after order helper is fully refactored to TS
import * as UserLogin from '../../../helpers/shared/user-login';
import * as Routing from '../../../routing/catalog-history';
import {
  addOrderProcess,
  listOrderProcesses
} from '../../../helpers/order-process/order-process-helper';
import { getOrderProcessApi } from '../../../helpers/shared/user-login';

describe('Order process helper', () => {
  const orderProcessMock = {
    id: 'order-id',
    name: 'order-process-name',
    description: 'order-process-description'
  };
  const axiosInstance = UserLogin.getAxiosInstance();

  const axiosPostSpy = jest.spyOn(axiosInstance, 'post');
  const axiosSpy = jest.spyOn(axiosInstance, 'get');
  afterEach(() => {
    axiosSpy.mockReset();
  });

  it('should fetch all data from listOrderProcesses', async () => {
    axiosSpy.mockResolvedValueOnce(orderProcessMock);
    const response = await listOrderProcesses();
    expect(response).toEqual(orderProcessMock);
  });

  it('should not call after order process if not specified', () => {
    const spy = jest.spyOn(getOrderProcessApi(), 'addOrderProcessAfterItem');
    axiosPostSpy.mockResolvedValue({ id: 'foo' });
    addOrderProcess({
      name: 'new order',
      description: 'new order description'
    });
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should not call before order process if not specified', () => {
    const spy = jest.spyOn(getOrderProcessApi(), 'addOrderProcessBeforeItem');
    axiosPostSpy.mockResolvedValue({ id: 'foo' });
    addOrderProcess({
      name: 'new order',
      description: 'new order description'
    });
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});
