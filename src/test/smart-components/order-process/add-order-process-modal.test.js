import React from 'react';
import { act } from 'react-dom/test-utils';
import thunk from 'redux-thunk';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { shallowToJson } from 'enzyme-to-json';
import { MemoryRouter } from 'react-router-dom';
import promiseMiddleware from 'redux-promise-middleware';
import notificationsMiddleware from '@redhat-cloud-services/frontend-components-notifications/notificationsMiddleware';
import AddOrderProcessModal from '../../../smart-components/order-process/add-order-process-modal';
import { Button } from '@patternfly/react-core';
import { ORDER_PROCESSES_ROUTE } from '../../../constants/routes';
import * as validator from '../../../forms/name-async-validator';
import * as helpers from '../../../helpers/order-process/order-process-helper';
import * as actions from '../../../redux/actions/order-process-actions';

describe('<AddOrderProcess />', () => {
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
    initialProps = {};
    initialState = {
      orderProcessReducer: {
        orderProcesses: {
          data: [
            { id: '123', name: 'foo', description: 'bar' },
            {
              id: '456',
              name: 'PrePostTest',
              description: 'PrePost',
              before_portfolio_item_id: 'pre',
              after_portfolio_item_id: 'post',
              return_portfolio_item_it: ''
            }
          ]
        }
      }
    };
    mockStore = configureStore(middlewares);

    // mock async validator so no timers are used
    validator.default = jest.fn().mockImplementation(() => '');
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

  it('should close correctly', async () => {
    helpers.addOrderProcess = jest
      .fn()
      .mockImplementation(() => Promise.resolve('ok'));
    actions.fetchOrderProcesses = jest.fn();
    const store = mockStore(initialState);

    let wrapper = {};
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={store} initialEntries={['/order-processes']}>
          <AddOrderProcessModal {...initialProps} />
        </ComponentWrapper>
      );
    });
    wrapper.update();

    await act(async () => {
      wrapper
        .find(Button)
        .first()
        .simulate('click');
    });
    wrapper.update();

    expect(
      wrapper.find(MemoryRouter).instance().history.location.pathname
    ).toEqual(ORDER_PROCESSES_ROUTE);
  });

  it('should submit new order process form correctly', async () => {
    helpers.addOrderProcess = jest
      .fn()
      .mockImplementation(() => Promise.resolve('ok'));
    actions.fetchOrderProcesses = jest.fn();

    const store = mockStore(initialState);
    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={store} initialEntries={['/order-processes']}>
          <AddOrderProcessModal {...initialProps} />
        </ComponentWrapper>
      );
    });
    wrapper.update();

    await act(async () => {
      const nameField = wrapper.find('input').at(2);
      nameField.instance().value = 'some-name';
      nameField.simulate('change');
    });
    wrapper.update();

    const id = null;
    const intl = expect.any(Object);
    expect(validator.default).toHaveBeenCalledWith('some-name', id, intl);

    await act(async () => {
      const descriptionField = wrapper.find('textarea');
      descriptionField.instance().value = 'some-description';
      descriptionField.simulate('change');
    });
    wrapper.update();

    await act(async () => {
      wrapper.find('form').simulate('submit');
    });
    wrapper.update();

    expect(helpers.addOrderProcess).toHaveBeenCalledWith({
      description: 'some-description',
      name: 'some-name'
    });
    expect(actions.fetchOrderProcesses).toHaveBeenCalled();
  });

  it('should display the order process type radio buttons', async () => {
    helpers.addOrderProcess = jest
      .fn()
      .mockImplementation(() => Promise.resolve('ok'));
    actions.fetchOrderProcesses = jest.fn();

    const store = mockStore(initialState);
    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={store} initialEntries={['/order-processes']}>
          <AddOrderProcessModal {...initialProps} />
        </ComponentWrapper>
      );
    });
    wrapper.update();

    await act(async () => {
      const itsmField = wrapper.find('input').at(0);
      expect(itsmField.instance().value).toBe('itsm');
    });

    await act(async () => {
      const returnField = wrapper.find('input').at(1);
      expect(returnField.instance().value).toBe('return');
    });
  });

  it('should edit order process correctly', async () => {
    helpers.updateOrderProcess = jest
      .fn()
      .mockImplementation(() => Promise.resolve('ok'));
    actions.fetchOrderProcesses = jest.fn();

    const store = mockStore(initialState);
    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper
          store={store}
          initialEntries={['/order-processes?order_process=123']}
        >
          <AddOrderProcessModal edit {...initialProps} />
        </ComponentWrapper>
      );
    });
    wrapper.update();

    const id = '123';
    const intl = expect.any(Object);
    expect(validator.default).toHaveBeenCalledWith('foo', id, intl);

    await act(async () => {
      const descriptionField = wrapper.find('textarea');
      descriptionField.instance().value = 'some-description';
      descriptionField.simulate('change');
    });
    wrapper.update();

    await act(async () => {
      wrapper.find('form').simulate('submit');
    });
    wrapper.update();

    expect(helpers.updateOrderProcess).toHaveBeenCalledWith(
      '123',
      {
        description: 'bar',
        id: '123',
        name: 'foo'
      },
      {
        description: 'some-description',
        id: '123',
        name: 'foo',
        order_process_type: 'itsm'
      }
    );
    expect(actions.fetchOrderProcesses).toHaveBeenCalled();
  });
});
