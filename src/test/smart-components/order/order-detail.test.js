import React from 'react';
import { act } from 'react-dom/test-utils';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';
import notificationsMiddleware from '@redhat-cloud-services/frontend-components-notifications';
import { MemoryRouter } from 'react-router-dom';
import { mount } from 'enzyme';
import { IntlProvider } from 'react-intl';

import OrderDetail from '../../../smart-components/order/order-detail/order-detail';
/**
 * this import is required in order to use the mocked API instance even though we are not mocking any calls
 */
import '../../../helpers/shared/__mocks__/user-login';

describe('<OrderDetail />', () => {
  describe('missing order data', () => {
    const middlewares = [thunk, promiseMiddleware, notificationsMiddleware()];
    const mockStore = configureStore(middlewares);
    const initialState = {
      breadcrumbsReducer: {
        fragments: []
      },
      platformReducer: {
        platformIconMapping: {}
      },
      orderReducer: {
        orderDetail: {
          portfolioItem: {
            notFound: true,
            object: 'Product'
          },
          platform: {
            notFound: true,
            object: 'Platform'
          },
          portfolio: {
            notFound: true,
            object: 'Portfolio'
          },
          order: {
            id: 'order-id',
            state: 'Created'
          },
          orderItem: {},
          progressMessages: {}
        }
      }
    };
    const OrderComponent = ({
      store,
      initialEntries = [
        '/order?order=order-id&portfolio-item=undefined&order-item=undefined&platform=undefined&portfolio=undefined'
      ]
    }) => (
      <IntlProvider locale="en">
        <Provider store={store}>
          <MemoryRouter initialEntries={initialEntries}>
            <OrderDetail />
          </MemoryRouter>
        </Provider>
      </IntlProvider>
    );

    it('should render the component in the approval tab with missing order detail data', async () => {
      const store = mockStore(initialState);
      let wrapper;
      await act(async () => {
        wrapper = mount(
          <OrderComponent
            store={store}
            initialEntries={[
              '/orders/order/approval?order=order-id&portfolio-item=undefined&order-item=undefined&platform=undefined&portfolio=undefined'
            ]}
          />
        );
      });
      await act(async () => {
        wrapper.update();
      });
      wrapper.update();
      expect(wrapper.find('div#creating-approval-request')).toHaveLength(1);
    });
  });
});
