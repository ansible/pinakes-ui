import React from 'react';
import { act } from 'react-dom/test-utils';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications/';

import OrderDetail from '../../../smart-components/order/order-detail/order-detail';
import { MemoryRouter } from 'react-router-dom';
import { mount } from 'enzyme';
import {
  mockApi,
  mockGraphql
} from '../../../helpers/shared/__mocks__/user-login';
import {
  CATALOG_API_BASE,
  SOURCES_API_BASE
} from '../../../utilities/constants';

/**
 *   'order-item',
  'portfolio-item',
  'platform',
  'portfolio',
  'order'
 */

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
      <Provider store={store}>
        <MemoryRouter initialEntries={initialEntries}>
          <OrderDetail />
        </MemoryRouter>
      </Provider>
    );

    it('should render the component in the approval tab with missing order detail data', async () => {
      mockGraphql.onPost(`${SOURCES_API_BASE}/graphql`).replyOnce(200, {
        data: {
          application_types: [
            {
              sources: [
                {
                  id: '1',
                  name: 'Source 1'
                }
              ]
            }
          ]
        }
      });
      mockApi
        .onGet(`${CATALOG_API_BASE}/orders/order-id`)
        .replyOnce(200, {})
        .onGet(`${CATALOG_API_BASE}/order_items/undefined`)
        .replyOnce(404, {}, {}) // arguments -> status, body, headers
        .onGet(`${CATALOG_API_BASE}/portfolio_items/undefined`)
        .replyOnce(404, {}, {})
        .onGet(`${CATALOG_API_BASE}/order_items/undefined/approval_requests`)
        .replyOnce(404, {}, {})
        .onGet(`${CATALOG_API_BASE}/order_items/undefined/progress_messages`)
        .replyOnce(404, {}, {});
      const store = mockStore(initialState);
      let wrapper;
      await act(async () => {
        wrapper = mount(
          <OrderComponent
            store={store}
            initialEntries={[
              '/order/approval?order=order-id&portfolio-item=undefined&order-item=undefined&platform=undefined&portfolio=undefined'
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
