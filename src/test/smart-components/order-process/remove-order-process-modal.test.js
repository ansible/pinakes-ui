import React from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { mount, shallow } from 'enzyme';
import { MemoryRouter, Route } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';
import thunk from 'redux-thunk';
import notificationsMiddleware from '@redhat-cloud-services/frontend-components-notifications';
import RemoveOrderProcessModal from '../../../smart-components/order-process/remove-order-process-modal';
import { Modal, Text, Title } from '@patternfly/react-core';
import { CATALOG_API_BASE } from '../../../utilities/constants';
import { ORDER_PROCESSES_ROUTE } from '../../../constants/routes';
import { shallowToJson } from 'enzyme-to-json';
import { mockApi } from '../../../helpers/shared/__mocks__/user-login';

describe('<RemoveOrderProcessModal />', () => {
  let initialState;
  let initialProps;
  const middlewares = [thunk, promiseMiddleware, notificationsMiddleware()];
  let mockStore;
  const ComponentWrapper = ({ store, children, initialEntries }) => (
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    </Provider>
  );

  beforeEach(() => {
    initialProps = {
      fetchData: jest.fn(),
      resetSelectedOrderProcesses: jest.fn()
    };
    initialState = {
      orderProcessReducer: {
        orderProcesses: { data: [{ id: '123', name: 'Order process test' }] }
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
          <RemoveOrderProcessModal {...initialProps} />
        </ComponentWrapper>
      ).dive();
    });

    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('should not render the remove order process modal', async () => {
    const store = mockStore(initialState);
    let wrapper;
    await act(async () => {
      wrapper = shallow(
        <ComponentWrapper store={store} initialEntries={['/order-processes']}>
          <RemoveOrderProcessModal {...initialProps} />
        </ComponentWrapper>
      );
    });
    expect(wrapper.find(Modal)).toHaveLength(0);
  });

  it('should render the order process removal modal - single', () => {
    const store = mockStore(initialState);
    let wrapper;
    wrapper = mount(
      <ComponentWrapper store={store} initialEntries={['?order_process=123']}>
        <RemoveOrderProcessModal {...initialProps} />
      </ComponentWrapper>
    );
    expect(wrapper.find(Modal)).toHaveLength(1);
    expect(
      wrapper
        .find(Title)
        .first()
        .text()
    ).toEqual('Delete order process?');
    expect(
      wrapper
        .find(Text)
        .first()
        .text()
    ).toEqual('Order process test will be removed.');
  });

  it('should render the order process modal - single - not in table', async () => {
    mockApi
      .onGet(`${CATALOG_API_BASE}/order_processes/235`)
      .replyOnce(200, { id: '235', name: 'Fetched order process' });

    let wrapper;
    const store = mockStore(initialState);

    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={store} initialEntries={['?order_process=235']}>
          <RemoveOrderProcessModal {...initialProps} />
        </ComponentWrapper>
      );
    });
    wrapper.update();

    expect(wrapper.find(Modal)).toHaveLength(1);
    expect(
      wrapper
        .find(Title)
        .first()
        .text()
    ).toEqual('Delete order process?');
    expect(
      wrapper
        .find(Text)
        .first()
        .text()
    ).toEqual('Fetched order process will be removed.');
  });

  it('should render the order process modal - multi', () => {
    const store = mockStore(initialState);
    const wrapper = mount(
      <ComponentWrapper store={store}>
        <RemoveOrderProcessModal {...initialProps} ids={['123', '456']} />
      </ComponentWrapper>
    );
    expect(wrapper.find(Modal)).toHaveLength(1);
    expect(
      wrapper
        .find(Title)
        .first()
        .text()
    ).toEqual('Delete order processes?');
    expect(
      wrapper
        .find(Text)
        .first()
        .text()
    ).toEqual('2 order processes will be removed.');
  });

  it('should render the order process modal and call the cancel callback', () => {
    const store = mockStore(initialState);
    const wrapper = mount(
      <ComponentWrapper store={store} initialEntries={['/remove']}>
        <Route
          to="/remove"
          render={(props) => (
            <RemoveOrderProcessModal
              {...props}
              ids={['123']}
              {...initialProps}
            />
          )}
        />
      </ComponentWrapper>
    );
    wrapper.update();
    expect(wrapper.find(Modal)).toHaveLength(1);

    wrapper.find('button#cancel-remove-order-process').simulate('click');
    wrapper.update();
    expect(
      wrapper.find(MemoryRouter).instance().history.location.pathname
    ).toEqual(ORDER_PROCESSES_ROUTE);
  });

  it('should remove one order process and redirect to the processes list', async (done) => {
    expect.assertions(2);
    const store = mockStore(initialState);
    mockApi
      .onDelete(`${CATALOG_API_BASE}/order_processes/123`)
      .replyOnce((req, res) => {
        expect(req).toBeTruthy();
        return res.status(200);
      });

    const wrapper = mount(
      <ComponentWrapper store={store} initialEntries={['/remove']}>
        <Route
          to="/remove"
          render={(props) => (
            <RemoveOrderProcessModal
              {...props}
              ids={['123']}
              {...initialProps}
            />
          )}
        />
      </ComponentWrapper>
    );
    wrapper.update();

    await act(async () => {
      wrapper.find('button#submit-remove-order-process').simulate('click');
    });
    wrapper.update();

    expect(
      wrapper.find(MemoryRouter).instance().history.location.pathname
    ).toEqual('/order-processes');

    done();
  });

  it('should remove multiple order processes and redirect to the processes list', async (done) => {
    expect.assertions(3);
    const store = mockStore(initialState);
    mockApi
      .onDelete(`${CATALOG_API_BASE}/order_processes/123`)
      .replyOnce((req, res) => {
        expect(req).toBeTruthy();
        return res.status(200);
      });
    mockApi
      .onDelete(`${CATALOG_API_BASE}/order_processes/456`)
      .replyOnce((req, res) => {
        expect(req).toBeTruthy();
        return res.status(200);
      });

    const wrapper = mount(
      <ComponentWrapper store={store} initialEntries={['/remove']}>
        <Route
          to="/remove"
          render={(props) => (
            <RemoveOrderProcessModal
              {...props}
              ids={['123', '456']}
              {...initialProps}
            />
          )}
        />
      </ComponentWrapper>
    );
    wrapper.update();

    await act(async () => {
      wrapper.find('button#submit-remove-order-process').simulate('click');
    });
    wrapper.update();
    expect(
      wrapper.find(MemoryRouter).instance().history.location.pathname
    ).toEqual('/order-processes');

    done();
  });
});
