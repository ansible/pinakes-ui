import React from 'react';
import { act } from 'react-dom/test-utils';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { shallowToJson } from 'enzyme-to-json';
import { Button } from '@patternfly/react-core';
import { MemoryRouter, Route } from 'react-router-dom';
import promiseMiddleware from 'redux-promise-middleware';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications/';

import { CATALOG_API_BASE } from '../../../utilities/constants';
import OrderModal from '../../../smart-components/common/order-modal';
import { orderInitialState } from '../../../redux/reducers/order-reducer';
import { mockApi } from '../../../helpers/shared/__mocks__/user-login';

describe('<OrderModal />', () => {
  let initialProps;
  const middlewares = [thunk, promiseMiddleware, notificationsMiddleware()];
  let mockStore;
  let initialState;

  const OrderWrapper = ({ store, children, initialEntries = [] }) => (
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    </Provider>
  );

  beforeEach(() => {
    initialProps = {
      closeUrl: '/close',
      serviceData: {
        name: 'Foo',
        id: '1'
      }
    };
    mockStore = configureStore(middlewares);
    initialState = {
      portfolioReducer: {
        portfolioItem: {
          portfolioItem: {
            id: '321'
          }
        }
      },
      orderReducer: {
        ...orderInitialState,
        isLoading: true,
        servicePlans: [
          {
            id: 'service-plan-id',
            create_json_schema: {
              schema: {
                fields: [
                  {
                    name: 'airspeed',
                    component: 'text-field',
                    initialValue: 'foo'
                  }
                ]
              }
            }
          }
        ]
      },
      platformReducer: {
        platformIconMapping: {}
      }
    };
  });

  it('should render correctly', () => {
    const wrapper = shallow(
      <OrderWrapper store={mockStore(initialState)}>
        <OrderModal {...initialProps} />
      </OrderWrapper>
    );
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('should redirect back to close URL', async (done) => {
    const store = mockStore(initialState);

    mockApi
      .onGet(`${CATALOG_API_BASE}/portfolio_items/321/service_plans`)
      .replyOnce(200, { data: [{ id: '1' }] });

    let wrapper;

    await act(async () => {
      wrapper = mount(
        <OrderWrapper
          store={store}
          initialEntries={[
            '/portfolio/portfolio-item/order?source=source-id&portfolio=123&portfolio-item=321'
          ]}
        >
          <Route
            path="/portfolio/portfolio-item/order"
            render={(args) => <OrderModal {...initialProps} {...args} />}
          />
        </OrderWrapper>
      );
    });
    wrapper.update();

    wrapper
      .find(Button)
      .first()
      .simulate('click');
    expect(
      wrapper.find(MemoryRouter).instance().history.location.pathname
    ).toEqual('/close');
    done();
  });

  it('should submit data', async (done) => {
    expect.assertions(3);
    const store = mockStore(initialState);

    mockApi
      .onGet(`${CATALOG_API_BASE}/portfolio_items/321/service_plans`)
      .replyOnce(200, [{}]);

    // order endpoints
    mockApi.onPost(`${CATALOG_API_BASE}/orders`).replyOnce(200, { id: '321' });
    mockApi
      .onPost(`${CATALOG_API_BASE}/orders/321/order_items`)
      .replyOnce((req) => {
        expect(JSON.parse(req.data)).toEqual({
          count: 1,
          service_parameters: {
            airspeed: 'foo'
          },
          provider_control_parameters: {},
          portfolio_item_id: '321'
        });
        return [200];
      });
    mockApi
      .onPost(`${CATALOG_API_BASE}/orders/321/submit_order`)
      .replyOnce((req) => {
        expect(req).toBeTruthy();
        return [200, { id: '321' }];
      });

    let wrapper;

    await act(async () => {
      wrapper = mount(
        <OrderWrapper
          store={store}
          initialEntries={[
            '/portfolios/detail/123/product/321/order?source=source-id&portfolio=123&portfolio-item=321'
          ]}
        >
          <Route
            to="/portfolios/detail/:id/product/:portfolioItemId/order"
            render={(args) => <OrderModal {...initialProps} {...args} />}
          />
        </OrderWrapper>
      );
    });

    wrapper.update();
    await act(async () => {
      wrapper.find('form').simulate('submit');
    });
    expect(
      wrapper.find(MemoryRouter).instance().history.location.pathname
    ).toEqual('/close');
    done();
  });
});
