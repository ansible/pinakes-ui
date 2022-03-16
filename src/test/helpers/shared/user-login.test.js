import {
  getAxiosInstance,
  initUnauthorizedInterceptor
} from '../../../helpers/shared/user-login';

describe('Interceptors', () => {
  describe('unauthorizedInterceptor', () => {
    initUnauthorizedInterceptor();
    const oldWindowLocation = window.location;

    beforeAll(() => {
      delete window.location;

      window.location = Object.defineProperties(
        {},
        {
          ...Object.getOwnPropertyDescriptors(oldWindowLocation),
          replace: {
            configurable: true,
            value: jest.fn()
          }
        }
      );
    });
    afterAll(() => {
      window.location = oldWindowLocation;
    });

    it('should throw error if response status is other then 403', () => {
      const res = {
        response: { status: 502 }
      };
      const axios = getAxiosInstance();
      try {
        axios.interceptors.response.handlers[0].rejected(res);
      } catch (rejectedRes) {
        expect(rejectedRes).toMatchObject(res);
      }
    });

    it('it should redirect to the unauthorized page if response status is 403', () => {
      const axios = getAxiosInstance();
      const rejectedRes = axios.interceptors.response.handlers[0].rejected({
        response: {
          status: 403
        }
      });
      expect(global.location.replace).toBeCalledWith('/ui/catalog/403');
    });
  });
});
