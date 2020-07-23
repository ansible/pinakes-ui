import React from 'react';
import { act } from 'react-dom/test-utils';
import thunk from 'redux-thunk';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { shallowToJson } from 'enzyme-to-json';
import { MemoryRouter, Route } from 'react-router-dom';
import promiseMiddleware from 'redux-promise-middleware';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications/';

import { CATALOG_API_BASE } from '../../../utilities/constants';
import { FETCH_ORDER_PROCESSES } from '../../../redux/action-types';
import OrderProcesses from '../../../smart-components/order-process/order-processes';
import { mockApi } from '../../../helpers/shared/__mocks__/user-login';
import { ORDER_PROCESSES_ROUTE } from '../../../utilities/constants';
import { DataList } from '@patternfly/react-core';
import TableEmptyState from '../../../presentational-components/shared/table-empty-state';

describe('<OrderProcesses />', () => {
  let initialProps;
  let initialState;
  const middlewares = [thunk, promiseMiddleware, notificationsMiddleware()];
  let mockStore;

  const ComponentWrapper = ({ store, initialEntries = ['/foo'], children }) => (
    <Provider store={store} value={{ userPermissions: [] }}>
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    </Provider>
  );

  beforeEach(() => {
    initialProps = {
      id: '123'
    };
    initialState = {
      breadcrumbsReducer: { fragments: [] },
      orderProcessReducer: {
        orderProcesses: {
          data: [
            {
              id: '123',
              name: 'bar',
              description: 'description',
              created_at: 'foo',
              metadata: {
                user_capabilities: {
                  read: true,
                  show: true
                },
                statistics: {}
              }
            }
          ],
          meta: {
            limit: 50,
            offset: 0
          }
        }
      }
    };
    mockStore = configureStore(middlewares);
  });

  it('should render correctly', () => {
    const store = mockStore(initialState);
    const wrapper = shallow(
      <ComponentWrapper store={store} initialEntries={['/order-processes']}>
        <OrderProcesses {...initialProps} store={store} />
      </ComponentWrapper>
    ).find(OrderProcesses);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('should mount and fetch data', async (done) => {
    const store = mockStore(initialState);

    mockApi
      .onGet(
        `${CATALOG_API_BASE}/order_processes?filter[name][contains_i]=&limit=50&offset=0`
      )
      .replyOnce(200, { data: [{ name: 'Foo', id: '11' }] });
    const expectedActions = [
      {
        type: `${FETCH_ORDER_PROCESSES}_PENDING`
      },
      expect.objectContaining({
        type: `${FETCH_ORDER_PROCESSES}_FULFILLED`
      })
    ];

    await act(async () => {
      mount(
        <ComponentWrapper store={store} initialEntries={['/order-processes']}>
          <Route
            path="/order-processes"
            render={(args) => <OrderProcesses {...initialProps} {...args} />}
          />
        </ComponentWrapper>
      );
    });

    expect(store.getActions()).toEqual(expectedActions);
    done();
  });

  it.skip('should mount and display order processes', async (done) => {
    const store = mockStore(initialState);

    mockApi
      .onGet(
        `${CATALOG_API_BASE}/order_processes?filter[name][contains_i]=&limit=50&offset=0`
      )
      .replyOnce(200, {
        data: [
          { name: 'Foo', description: 'A test', id: '11', created_at: 'time' }
        ]
      });

    mockApi
      .onGet(
        `${CATALOG_API_BASE}/order_processes?filter[name][contains_i]=nothing&limit=50&offset=0`
      )
      .replyOnce((req) => {
        expect(req).toBeTruthy();
        done();
        return [200, { data: [] }];
      });

    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={store} initialEntries={['/order-processes']}>
          <Route
            path="/order-processes"
            render={(args) => <OrderProcesses {...initialProps} {...args} />}
          />
        </ComponentWrapper>
      );
    });

    wrapper.update();
    expect(wrapper.find('tr')).toHaveLength(2);
  });

  it('should render in loading state', async (done) => {
    const store = mockStore({
      ...initialState,
      orderProcessReducer: {
        ...initialState.orderProcessReducer,
        isLoading: true,
        orderProcesses: { data: [], meta: { limit: 50, offset: 0 } }
      }
    });
    mockApi
      .onGet(
        `${CATALOG_API_BASE}/order_processes?filter[name][contains_i]=&limit=50&offset=0`
      )
      .replyOnce(200, { data: [{ name: 'Foo', id: '11' }] });
    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={store} initialEntries={['/order-processes']}>
          <Route
            exact
            path="/order-processes"
            render={(props) => <OrderProcesses {...initialProps} {...props} />}
          />
        </ComponentWrapper>
      );
    });

    expect(wrapper.find(DataList)).toHaveLength(1);
    done();
  });

  it.skip('should sort', async () => {
    expect.assertions(3);
    mockApi
      .onGet(
        `${CATALOG_API_BASE}/order_processes?filter%5Bname%5D%5Bcontains_i%5D=&limit=50&offset=0&sort_by=name%3Aasc`
      )
      .replyOnce(200, {
        data: [{ name: 'Foo', id: '11', description: 'A test' }]
      });
    const store = mockStore(initialState);

    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={store}>
          <Route path={ORDER_PROCESSES_ROUTE} component={OrderProcesses} />
        </ComponentWrapper>
      );
    });
    wrapper.update();

    mockApi
      .onGet(
        `${CATALOG_API_BASE}/order_processes/?filter%5Bname%5D%5Bcontains_i%5D=&limit=50&offset=0&sort_by=name%3Aasc`
      )
      .replyOnce(200, { data: [{ name: 'Foo', id: '11', description: '' }] });

    await act(async () => {
      wrapper
        .find('button')
        .at(3)
        .simulate('click'); // name column
    });
    wrapper.update();

    mockApi
      .onGet(
        `${CATALOG_API_BASE}/order_processes/?filter%5Bname%5D%5Bcontains_i%5D=&limit=50&offset=0&sort_by=description%3Aasc`
      )
      .replyOnce(200, { data: [{ name: 'Foo', id: '11', description: '' }] });

    await act(async () => {
      wrapper
        .find('button')
        .at(2)
        .simulate('click'); // description column
    });
    wrapper.update();
  });

  it.skip('should filter and clear the filter', async () => {
    jest.useFakeTimers();
    expect.assertions(2);

    const orderProcessTest = {
      id: 'so',
      name: 'foo'
    };

    mockApi
      .onGet(
        `${CATALOG_API_BASE}/order_processes?filter[name][contains_i]=&limit=50&offset=0&sort_by=name%3Aasc`
      )
      .replyOnce({
        status: 200,
        body: {
          meta: { count: 1, limit: 50, offset: 0 },
          data: [orderProcessTest]
        }
      });
    const store = mockStore(initialState);

    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={store}>
          <Route path={ORDER_PROCESSES_ROUTE} component={OrderProcesses} />
        </ComponentWrapper>
      );
    });
    wrapper.update();

    mockApi
      .onGet(
        `${CATALOG_API_BASE}/order_processes/?filter%5Bname%5D%5Bcontains_i%5D=some-name&limit=50&offset=0&sort_by=name%3Aasc`
      )
      .replyOnce((req, res) => {
        expect(req.url().query).toEqual({
          'filter[name][contains_i]': 'some-name',
          limit: '50',
          offset: '0',
          sort_by: 'name:asc'
        });
        return res.status(200).body({
          meta: { count: 1, limit: 50, offset: 0 },
          data: [orderProcessTest]
        });
      });

    await act(async () => {
      wrapper
        .find('input')
        .first()
        .instance().value = 'some-name';
      wrapper
        .find('input')
        .first()
        .simulate('change');
    });
    wrapper.update();

    await act(async () => {
      jest.runAllTimers();
    });
    wrapper.update();

    mockApi
      .onGet(
        `${CATALOG_API_BASE}/order_processes/?filter%5Bname%5D%5Bcontains_i%5D=&limit=50&offset=0&sort_by=name%3Aasc`
      )
      .replyOnce((req, res) => {
        expect(req.url().query).toEqual({
          'filter[name][contains_i]': '',
          limit: '50',
          offset: '0',
          sort_by: 'name:asc'
        });
        return res.status(200).body({
          meta: { count: 1, limit: 50, offset: 0 },
          data: [orderProcessTest]
        });
      });

    await act(async () => {
      wrapper
        .find('.ins-c-chip-filters')
        .find('button')
        .last()
        .simulate('click');
    });
    wrapper.update();

    await act(async () => {
      jest.runAllTimers();
    });
    wrapper.update();

    jest.useRealTimers();
  });

  it('should render table empty state', async () => {
    mockApi
      .onGet(
        `${CATALOG_API_BASE}/order_processes/?filter%5Bname%5D%5Bcontains_i%5D=&limit=50&offset=0&sort_by=name%3Aasc`
      )
      .replyOnce({
        status: 200,
        body: {
          meta: { count: 0, limit: 50, offset: 0 },
          data: []
        }
      });
    const store = mockStore({
      ...initialState,
      orderProcessReducer: {
        ...initialState.orderProcessReducer,
        isLoading: true,
        orderProcesses: { data: [], meta: { limit: 50, offset: 0 } }
      }
    });
    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={store}>
          <Route path={ORDER_PROCESSES_ROUTE} component={OrderProcesses} />
        </ComponentWrapper>
      );
    });
    wrapper.update();

    expect(wrapper.find(TableEmptyState)).toHaveLength(1);
  });

  it.skip('should paginate requests', async () => {
    jest.useFakeTimers();
    expect.assertions(2);

    mockApi
      .onGet(
        `${CATALOG_API_BASE}/order_processes/?filter%5Bname%5D%5Bcontains_i%5D=&limit=50&offset=0&sort_by=name%3Aasc`
      )
      .replyOnce({
        status: 200,
        body: {
          meta: { count: 40, limit: 50, offset: 0 },
          data: []
        }
      });
    const store = mockStore(initialState);

    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={store}>
          <Route path={ORDER_PROCESSES_ROUTE} component={OrderProcesses} />
        </ComponentWrapper>
      );
    });
    wrapper.update();

    mockApi
      .onGet(
        `${CATALOG_API_BASE}/order_processes?filter%5Bname%5D%5Bcontains_i%5D=&limit=10&offset=0&sort_by=name%3Aasc`
      )
      .replyOnce((req, res) => {
        expect(req.url().query).toEqual({
          'filter[name][contains_i]': '',
          limit: '10',
          offset: '0',
          sort_by: 'name:asc'
        });
        return res.status(200).body({
          meta: { count: 40, limit: 10, offset: 0 },
          data: []
        });
      });

    await act(async () => {
      wrapper
        .find('.pf-c-options-menu__toggle-button')
        .first()
        .simulate('click');
    });
    wrapper.update();
    await act(async () => {
      wrapper
        .find('menu-item')
        .first()
        .simulate('click');
    });
    wrapper.update();
    await act(async () => {
      jest.runAllTimers();
    });
    wrapper.update();

    mockApi
      .onGet(
        `${CATALOG_API_BASE}/order_processes/?filter%5Bname%5D%5Bcontains_i%5D=&limit=10&offset=10&sort_by=name%3Aasc`
      )
      .replyOnce((req, res) => {
        expect(req.url().query).toEqual({
          'filter[name][contains_i]': '',
          limit: '10',
          offset: '10',
          sort_by: 'name:asc'
        });
        return res.status(200).body({
          meta: { count: 40, limit: 10, offset: 10 },
          data: []
        });
      });

    await act(async () => {
      wrapper
        .find('.pf-c-pagination__nav')
        .first()
        .find('button')
        .last()
        .simulate('click');
    });
    wrapper.update();
    await act(async () => {
      jest.runAllTimers();
    });
    wrapper.update();

    jest.useRealTimers();
  });
});
