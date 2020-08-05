import React from 'react';
import { act } from 'react-dom/test-utils';
import thunk from 'redux-thunk';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { shallowToJson } from 'enzyme-to-json';
import { MemoryRouter } from 'react-router-dom';
import promiseMiddleware from 'redux-promise-middleware';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications/';
import AddOrderProcessModal from '../../../smart-components/order-process/add-order-process-modal';

describe('<AddPortfolioModal />', () => {
  let initialProps;
  let initialState;
  const middlewares = [thunk, promiseMiddleware, notificationsMiddleware()];
  let mockStore;
  const ComponentWrapper = ({ store, children, initialEntries }) => (
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    </Provider>
  );

  beforeEach(() => {
    initialProps = {
      fetchOrderProcesses: jest.fn(),
      closeTarget: '/close-target'
    };
    initialState = {
      orderProcessReducer: {
        orderProcesses: { data: [] }
      }
    };
    mockStore = configureStore(middlewares);
  });

  it('should render correctly', async () => {
    const store = mockStore(initialState);
    let wrapper;
    await act(async () => {
      wrapper = shallow(
        <ComponentWrapper store={store} initialEntries={['/order-processes']}>
          <AddOrderProcessModal {...initialProps} />
        </ComponentWrapper>
      ).dive();
    });

    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
