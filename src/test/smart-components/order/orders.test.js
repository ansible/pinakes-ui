import React from 'react';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import configureStore from 'redux-mock-store' ;
import { shallowToJson } from 'enzyme-to-json';
import { MemoryRouter } from 'react-router-dom';
import promiseMiddleware from 'redux-promise-middleware';
import { orderInitialState } from '../../../redux/reducers/order-reducer';
import { notificationsMiddleware } from '@red-hat-insights/insights-frontend-components/components/Notifications';

import Orders from '../../../smart-components/order/orders';
import { CATALOG_API_BASE } from '../../../Utilities/Constants';

describe('<Orders />', () => {

  let initialProps;
  const middlewares = [ thunk, promiseMiddleware(), notificationsMiddleware() ];
  let mockStore;
  let initialState;
  const orders = [{
    id: 'order-1',
    created_at: new Date(),
    state: 'ordered'
  }];

  const ComponentWrapper = ({ store, children }) => (
    <Provider store={ store }>
      <MemoryRouter>
        { children }
      </MemoryRouter>
    </Provider>
  );

  beforeEach(() => {
    initialProps = {};
    mockStore = configureStore(middlewares);
    initialState = { orderReducer: orderInitialState };
  });

  it('should render correctly', () => {
    const store = mockStore(initialState);
    const wrapper = shallow(<Orders store={ store } { ...initialProps } />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('should render correctly in loading state', () => {
    const store = mockStore(initialState);
    const wrapper = shallow(<Orders store={ store } { ...initialProps } isLoading />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('should fetch orders data on component mount', (done) => {
    expect.assertions(1);
    const store = mockStore({ ...initialState, orderReducer: { ...initialState.orderReducer, orders }});
    apiClientMock.get(`${CATALOG_API_BASE}/orders`, mockOnce((req, res) => {
      expect(req).toBeTruthy();
      return res.status(200).body({ data: orders });
    }));

    mount(<ComponentWrapper store={ store }><Orders { ...initialProps } /></ComponentWrapper>);
    setImmediate(() => {
      done();
    });
  });

  it('should switch between tabs', (done) => {
    const store = mockStore({ ...initialState, orderReducer: { ...initialState.orderReducer, orders }});
    apiClientMock.get(`${CATALOG_API_BASE}/orders`, mockOnce((req, res) => {
      expect(req).toBeTruthy();
      return res.status(200).body({ data: orders });
    }));

    const wrapper = mount(<ComponentWrapper store={ store }><Orders { ...initialProps } /></ComponentWrapper>);
    setImmediate(() => {
      wrapper.find('button.pf-c-tabs__button').last().simulate('click');
      wrapper.update();
      expect(wrapper.find(Orders).children().instance().state.activeTabKey).toEqual(1);
      done();
    });
  });

  it('should expand data list', (done) => {
    const store = mockStore({ ...initialState, orderReducer: { ...initialState.orderReducer, orders }});
    apiClientMock.get(`${CATALOG_API_BASE}/orders`, mockOnce((req, res) => {
      expect(req).toBeTruthy();
      return res.status(200).body({ data: orders });
    }));

    const wrapper = mount(<ComponentWrapper store={ store }><Orders { ...initialProps } /></ComponentWrapper>);
    setImmediate(() => {
      wrapper.update();
      wrapper.find('.pf-c-data-list__toggle').first().simulate('click');
      expect(wrapper.find(Orders).children().instance().state.dataListExpanded).toEqual({ 'order-1': true });
      done();
    });
  });
});
