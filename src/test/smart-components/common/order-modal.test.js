import React from 'react';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import configureStore from 'redux-mock-store' ;
import { shallowToJson } from 'enzyme-to-json';
import { Button } from '@patternfly/react-core';
import { MemoryRouter, Route } from 'react-router-dom';
import promiseMiddleware from 'redux-promise-middleware';
import { notificationsMiddleware } from '@red-hat-insights/insights-frontend-components/components/Notifications';

import dummySchema from '../order/order-mock-form-schema';
import { CATALOG_API_BASE } from '../../../Utilities/Constants';
import OrderModal from '../../../smart-components/common/order-modal';
import { orderInitialState } from '../../../redux/reducers/order-reducer';

describe('<OrderModal />', () => {
  let initialProps;
  const middlewares = [ thunk, promiseMiddleware(), notificationsMiddleware() ];
  let mockStore;
  let initialState;

  const OrderWrapper = ({ store, children, initialEntries = []}) => (
    <Provider store={ store }>
      <MemoryRouter initialEntries={ initialEntries }>
        { children }
      </MemoryRouter>
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
      orderReducer: {
        ...orderInitialState,
        serviceData: {
          name: 'Foo',
          id: '1'
        }
      }
    };
  });

  it('should render correctly', () => {
    const wrapper = shallow(<OrderModal { ...initialProps } />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('should redirect back to close URL', (done) => {
    const store = mockStore(initialState);

    apiClientMock.get(`${CATALOG_API_BASE}/portfolio_items/1/service_plans`, mockOnce({
      body: [ dummySchema ]
    }));

    fetchMock.getOnce(`${CATALOG_API_BASE}/portfolio_items/1/provider_control_parameters`, {
      required: [ 'namespace' ],
      type: 'object',
      properties: {
        namespace: {
          title: 'Namespace',
          enum: [ '1', '2', '3', '4' ]
        }
      }
    });

    const wrapper = mount(
      <OrderWrapper store={ store } initialEntries={ [ '/foo/url' ] }>
        <Route to="/foo/url" render={ args => <OrderModal { ...initialProps } { ...args } /> }  />
      </OrderWrapper>
    );

    setImmediate(() => {
      wrapper.find(Button).first().simulate('click');
      expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual('/close');
      done();
    });
  });
});

