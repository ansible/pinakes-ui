import React from 'react';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import configureStore from 'redux-mock-store' ;
import { shallowToJson } from 'enzyme-to-json';
import { Button } from '@patternfly/react-core';
import { MemoryRouter, Route } from 'react-router-dom';
import promiseMiddleware from 'redux-promise-middleware';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications/';

import dummySchema from './order-mock-form-schema';
import { CATALOG_API_BASE } from '../../../utilities/constants';
import FormRenderer from '../../../smart-components/common/form-renderer';
import { orderInitialState } from '../../../redux/reducers/order-reducer';
import OrderServiceFormStepConfiguration from '../../../smart-components/order/order-service-form-step-configuration';

const servicePlansResponse = {
  ...dummySchema,
  type: 'object'
};

const providerControlParametersResponse = {
  title: 'OpenShift control parameters',
  description: 'OpenShift provider control parameters',
  type: 'object',
  properties: {
    namespace: {
      type: 'string',
      title: 'OpenShift Project',
      enum: [
        'default',
        'freddy',
        'install-test',
        'iqe-test',
        'kube-public',
        'kube-service-catalog',
        'kube-system',
        'management-infra',
        'metering-hccm',
        'nc-test',
        'nc-test2'
      ]
    }
  }
};

describe('<OrderServiceFormStepConfiguration />', () => {
  let initialProps;
  const middlewares = [ thunk, promiseMiddleware(), notificationsMiddleware() ];
  let mockStore;
  let initialState;

  const ComponentWrapper = ({ store, children, initialEntries = []}) => (
    <Provider store={ store }>
      <MemoryRouter initialEntries={ initialEntries }>
        { children }
      </MemoryRouter>
    </Provider>
  );

  beforeEach(() => {
    initialProps = {
      closeUrl: '/close',
      id: '1',
      serviceData: {
        name: 'Foo',
        id: '1'
      }
    };
    mockStore = configureStore(middlewares);
    initialState = {
      orderReducer: {
        ...orderInitialState,
        isLoading: false,
        servicePlans: [ servicePlansResponse ],
        serviceData: {
          name: 'Foo',
          id: '1'
        }
      }
    };
  });

  it('should render correctly', () => {
    const wrapper = shallow(<OrderServiceFormStepConfiguration { ...initialProps } />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('should load data and render order form', (done) => {
    const store = mockStore(initialState);

    apiClientMock.get(`${CATALOG_API_BASE}/portfolio_items/1/service_plans`, mockOnce({ body: [ servicePlansResponse ]}));
    apiClientMock.get(`${CATALOG_API_BASE}/portfolio_items/1/provider_control_parameters`, mockOnce({ body: providerControlParametersResponse }));

    const wrapper = mount(
      <ComponentWrapper store={ store } initialEntries={ [ '/foo' ] }>
        <Route path="/foo" render={ (...args) => <OrderServiceFormStepConfiguration { ...initialProps } { ...args } /> } />
      </ComponentWrapper>
    );

    setImmediate(() => {
      wrapper.update();
      expect(wrapper.find(FormRenderer)).toHaveLength(1);
      done();
    });
  });

  it('should submit data', (done) => {
    expect.assertions(3);
    const store = mockStore(initialState);

    apiClientMock.get(`${CATALOG_API_BASE}/portfolio_items/1/service_plans`, mockOnce({ body: [ servicePlansResponse ]}));
    apiClientMock.get(`${CATALOG_API_BASE}/portfolio_items/1/provider_control_parameters`, mockOnce({ body: providerControlParametersResponse }));

    // order endpoints
    apiClientMock.post(`${CATALOG_API_BASE}/orders`, mockOnce({ body: { id: '231' }}));
    apiClientMock.post(`${CATALOG_API_BASE}/orders/231/order_items`, mockOnce((req, res) => {
      expect(JSON.parse(req.body())).toEqual({
        count: 1,
        service_parameters: {
          airspeed: '',
          int_value: 5,
          quest: '',
          username: ''
        },
        service_plan_ref: '911153',
        provider_control_parameters: {},
        portfolio_item_id: '1' });
      return res.status(200);
    }));
    apiClientMock.post(`${CATALOG_API_BASE}/orders/231/submit_order`, mockOnce((req, res) => {
      expect(req).toBeTruthy();
      return res.status(200).body({ id: '231' });
    }));

    const wrapper = mount(
      <ComponentWrapper store={ store } initialEntries={ [ '/foo' ] }>
        <Route path="/foo" render={ (...args) => <OrderServiceFormStepConfiguration { ...initialProps } { ...args } /> } />
      </ComponentWrapper>
    );

    setImmediate(() => {
      wrapper.update();
      wrapper.find(Button).last().simulate('click');
      setImmediate(() => {
        expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual('/close');
        done();
      });
    });
  });
});
