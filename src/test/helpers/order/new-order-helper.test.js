// TODO migrate all order helper test after order helper is fully refactored to TS
import * as OrderHelper from '../../../helpers/order/new-order-helper';
import * as UserLogin from '../../../helpers/shared/user-login';
import * as Routing from '../../../routing/catalog-history';

import { getOrderDetail } from '../../../helpers/order/order-helper';

describe('Order helper', () => {
  const orderMock = { id: 'order-id' };
  const orderItemsMock = { data: [{ id: 'order-item-id' }] };
  const portfolioItemMock = { id: 'portfolio-item-id' };
  const sourceMock = { id: 'source-id' };
  const progressMessagesMock = { id: 'progress-messages-id' };
  const portfolioMock = { id: 'portfolio-id' };
  const axiosInstance = UserLogin.getAxiosInstance();

  const axiosSpy = jest.spyOn(axiosInstance, 'get');

  afterEach(() => {
    axiosSpy.mockReset();
  });

  it('should fetch all data from fetchOrderDetailSequence', async () => {
    axiosSpy
      .mockResolvedValueOnce(orderMock)
      .mockResolvedValueOnce(orderItemsMock)
      .mockResolvedValueOnce(portfolioItemMock)
      .mockResolvedValueOnce(sourceMock)
      .mockResolvedValueOnce(progressMessagesMock)
      .mockResolvedValueOnce(portfolioMock);
    const response = await OrderHelper.fetchOrderDetailSequence('order-id');
    expect(response).toEqual([
      orderMock,
      orderItemsMock.data[0],
      portfolioItemMock,
      sourceMock,
      progressMessagesMock,
      portfolioMock
    ]);
  });

  it('should replace history to 404 page', async () => {
    const history = Routing.default;
    const spy = jest.spyOn(history, 'replace');
    axiosSpy
      .mockImplementationOnce(
        () => new Promise((_res, rej) => rej({ status: 404 }))
      )
      .mockResolvedValue({});

    await OrderHelper.fetchOrderDetailSequence('order-id');
    expect(spy).toHaveBeenCalledWith({
      pathname: '/404',
      state: { from: expect.any(Object) }
    });
  });

  it('should assign not found object on failed order sub requests', async () => {
    axiosSpy
      .mockResolvedValueOnce(orderMock)
      .mockImplementation(
        () => new Promise((_res, rej) => rej({ status: 404 }))
      );
    const response = await OrderHelper.fetchOrderDetailSequence('order-id');
    expect(response).toEqual([
      orderMock,
      {
        notFound: true,
        object: 'Order item'
      },
      {
        notFound: true,
        object: 'Product'
      },
      {
        notFound: true,
        object: 'Platform'
      },
      {
        notFound: true,
        object: 'Messages'
      },
      {
        notFound: true,
        object: 'Portfolio'
      }
    ]);
  });

  it('should pick sequential fetch if some order params are missing', async () => {
    const spy = jest.spyOn(OrderHelper, 'fetchOrderDetailSequence');
    axiosSpy.mockResolvedValue({ id: 'foo' });
    await getOrderDetail({ order: 'only-order', portfolio: null });
    expect(spy).toHaveBeenCalledWith('only-order');
    spy.mockRestore();
  });

  it('should pick parallel data fetch if all params keys are defined', async () => {
    const spy = jest.spyOn(OrderHelper, 'fetchOrderDetailSequence');
    axiosSpy.mockResolvedValue({ id: 'foo' });
    await getOrderDetail({ order: 'only-order', portfolio: 'portfolio-id' });
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});
