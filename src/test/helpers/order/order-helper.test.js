import { getAxiosInstance } from '../../../helpers/shared/user-login';
import { getOrders } from '../../../helpers/order/order-helper';
import { CATALOG_API_BASE } from '../../../utilities/constants';

describe('Order helper', () => {
  const getSpy = jest.spyOn(getAxiosInstance(), 'get').mockImplementation(
    (url) =>
      new Promise((res, rej) => {
        if (url.includes('/order_items/detail-order-item')) {
          return res({
            id: 'detail-order-item'
          });
        }

        if (url.includes('/portfolio_items/detail-portfolio-item')) {
          return rej({
            status: 404
          });
        }

        if (url.includes('/sources/source-detail')) {
          return rej({
            status: 400
          });
        }

        if (url.includes('/order_items/detail-order-item/progress_messages')) {
          return rej({
            status: 400
          });
        }

        if (url.includes('/portfolios/detail-portfolio')) {
          return rej({
            status: 404
          });
        }

        if (url.includes('/orders/detail-order')) {
          return res({
            id: 'detail-order'
          });
        }

        if (url.includes('/orders')) {
          return res({
            data: [
              {
                id: 'order-id'
              }
            ]
          });
        }

        if (url.includes('/order_items')) {
          return res({
            data: [
              {
                id: 'order-item-id',
                portfolio_item_id: 'portfolio-item-id'
              }
            ]
          });
        }

        if (url.includes('/portfolio-items')) {
          return res({
            data: [
              {
                id: 'portfolio-item-id'
              }
            ]
          });
        }

        return res({
          data: []
        });
      })
  );
  afterEach(() => {
    getSpy.mockReset();
  });
  it('should create correct queries for and data structure getOrders endpoint', () => {
    const expectedData = {
      portfolioItems: { data: [] },
      data: [{ id: 'order-id', orderItems: [] }]
    };

    return getOrders().then((data) => {
      expect(getSpy).toHaveBeenNthCalledWith(
        1,
        `${CATALOG_API_BASE}/orders?&limit=50&offset=0`
      );
      expect(getSpy).toHaveBeenNthCalledWith(
        2,
        `${CATALOG_API_BASE}/order_items?filter[order_id][]=order-id`
      );
      expect(getSpy).toHaveBeenNthCalledWith(
        3,
        `${CATALOG_API_BASE}/portfolio_items?filter[id][]=portfolio-item-id`
      );
      expect(data).toEqual(expectedData);
    });
  });
});
