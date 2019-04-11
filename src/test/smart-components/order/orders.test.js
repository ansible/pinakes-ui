import React from 'react';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import configureStore from 'redux-mock-store' ;
import { shallowToJson } from 'enzyme-to-json';
import { MemoryRouter } from 'react-router-dom';
import promiseMiddleware from 'redux-promise-middleware';
import { DataList, DataListContent } from '@patternfly/react-core';

import Orders from '../../../smart-components/order/orders';
import { orderInitialState } from '../../../redux/reducers/order-reducer';
import OrderDetailTable from '../../../smart-components/order/order-detail-table';
import { portfoliosInitialState } from '../../../redux/reducers/portfolio-reducer';
import { CATALOG_API_BASE, APPROVAL_API_BASE } from '../../../utilities/constants';
import { notificationsMiddleware } from '@red-hat-insights/insights-frontend-components/components/Notifications';

describe('<Orders />', () => {

  let initialProps;
  const middlewares = [ thunk, promiseMiddleware(), notificationsMiddleware() ];
  let mockStore;
  let initialState;
  const linkedOrders = {
    current: [{
      id: 'order-1',
      created_at: new Date(),
      state: 'ordered',
      requests: [],
      orderItems: []
    }],
    past: []
  };

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
    initialState = { orderReducer: { ...orderInitialState, isLoading: false }, portfolioReducer: { ...portfoliosInitialState, isLoading: false }};
  });

  afterEach(() => {
    fetchMock.reset();
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
    const store = mockStore({ ...initialState, orderReducer: { ...initialState.orderReducer, linkedOrders }});
    apiClientMock.get(`${CATALOG_API_BASE}/orders`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${APPROVAL_API_BASE}/requests`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${CATALOG_API_BASE}/portfolio_items`, mockOnce({ body: { data: []}}));
    fetchMock.getOnce(`${CATALOG_API_BASE}/order_items`, { data: []});

    const wrapper = mount(<ComponentWrapper store={ store }><Orders { ...initialProps } /></ComponentWrapper>);
    setImmediate(() => {
      expect(wrapper.find(DataList)).toHaveLength(2);
      done();
    });
  });

  it('should expand data list', (done) => {
    const store = mockStore({ ...initialState, orderReducer: { ...initialState.orderReducer, linkedOrders }});
    apiClientMock.get(`${CATALOG_API_BASE}/orders`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${APPROVAL_API_BASE}/requests`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${CATALOG_API_BASE}/portfolio_items`, mockOnce({ body: { data: []}}));
    fetchMock.getOnce(`${CATALOG_API_BASE}/order_items`, { data: []});

    const wrapper = mount(<ComponentWrapper store={ store }><Orders { ...initialProps } /></ComponentWrapper>);
    setImmediate(() => {
      wrapper.update();
      expect(wrapper.find(DataListContent).props().isHidden).toEqual(true);
      wrapper.find('.pf-c-data-list__toggle').first().simulate('click');
      expect(wrapper.find(DataListContent).props().isHidden).toEqual(false);
      expect(wrapper.find(OrderDetailTable)).toHaveLength(1);
      done();
    });
  });
});
