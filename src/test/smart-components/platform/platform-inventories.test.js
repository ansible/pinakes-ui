import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import promiseMiddleware from 'redux-promise-middleware';
import { Route, MemoryRouter } from 'react-router-dom';
import notificationsMiddleware from '@redhat-cloud-services/frontend-components-notifications/notificationsMiddleware';
import { mount, shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import PlatformInventories from '../../../smart-components/platform/platform-inventories';
import {
  CATALOG_INVENTORY_API_BASE,
  APPROVAL_API_BASE
} from '../../../utilities/constants';
import { FETCH_PLATFORM_INVENTORIES } from '../../../redux/action-types';
import { platformInitialState } from '../../../redux/reducers/platform-reducer';
import { approvalInitialState } from '../../../redux/reducers/approval-reducer';
import EditApprovalWorkflow from '../../../smart-components/common/edit-approval-workflow';
import { act } from 'react-dom/test-utils';
import { mockApi } from '../../../helpers/shared/__mocks__/user-login';
import DialogRoutes from '../../../smart-components/dialog-routes';

describe('<PlatformInventories />', () => {
  let initialProps;
  const middlewares = [thunk, promiseMiddleware, notificationsMiddleware()];
  let mockStore;
  let initialState;

  const ComponentWrapper = ({ store, initialEntries = ['/foo'], children }) => (
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>
        <Route path="/platforms/platform/platform-inventories">
          {children}
        </Route>
        <DialogRoutes />
      </MemoryRouter>
    </Provider>
  );

  beforeEach(() => {
    initialProps = {};
    mockStore = configureStore(middlewares);
    initialState = {
      breadcrumbsReducer: { fragments: [] },
      approvalReducer: {
        ...approvalInitialState,
        resolvedWorkflows: { data: [], meta: { limit: 50, offset: 0 } }
      },
      portfolioReducer: {
        isLoading: false
      },
      platformReducer: {
        ...platformInitialState,
        selectedPlatform: {
          id: '123',
          name: 'Foo'
        },
        platformInventories: {
          data: [
            {
              id: '222',
              name: 'Test inventory',
              created_at: 'date',
              workflow: 'wf'
            }
          ],
          meta: {
            limit: 50,
            offset: 0,
            count: 0
          }
        }
      }
    };
  });

  it('should render correctly', () => {
    const store = mockStore(initialState);
    const wrapper = shallow(
      <ComponentWrapper
        store={store}
        initialEntries={[
          '/platforms/platform/platform-inventories?platform=123'
        ]}
      >
        <PlatformInventories
          store={mockStore(initialState)}
          {...initialProps}
        />
        );
      </ComponentWrapper>
    ).find(PlatformInventories);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('should mount and fetch data', async () => {
    const store = mockStore(initialState);
    mockApi
      .onGet(
        `${CATALOG_INVENTORY_API_BASE}/sources/123/service_inventories?filter[name][contains_i]=&limit=50&offset=0`
      )
      .replyOnce(200, { data: [{ id: 111 }] });

    const expectedActions = [
      { type: `${FETCH_PLATFORM_INVENTORIES}_PENDING` },
      {
        type: `${FETCH_PLATFORM_INVENTORIES}_FULFILLED`,
        payload: { data: [{ id: 111 }] }
      }
    ];

    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper
          store={store}
          initialEntries={[
            '/platforms/platform/platform-inventories?platform=123'
          ]}
        >
          <PlatformInventories
            {...initialProps}
            store={mockStore(initialState)}
          />
        </ComponentWrapper>
      );
    });

    await act(async () => {
      wrapper.update();
    });

    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should redirect to the Edit workflow modal', async () => {
    const store = mockStore(initialState);
    let wrapper;

    mockApi
      .onGet(
        `${CATALOG_INVENTORY_API_BASE}/sources/123/service_inventories?filter[name][contains_i]=&limit=50&offset=0`
      )
      .replyOnce(200, {
        data: [
          {
            id: '222',
            name: 'Test inventory',
            created_at: 'date',
            workflow: 'wf'
          }
        ]
      });
    mockApi
      .onGet(
        // eslint-disable-next-line max-len
        `${APPROVAL_API_BASE}/workflows?app_name=inventory&object_type=ServiceInventory&object_id=222&filter[name][contains]=&limit=50&offset=0`
      )
      .replyOnce(200, { data: [] });

    await act(async () => {
      wrapper = mount(
        <ComponentWrapper
          store={store}
          initialEntries={[
            '/platforms/platform/platform-inventories?platform=123'
          ]}
        >
          <PlatformInventories
            {...initialProps}
            store={mockStore(initialState)}
          />
        </ComponentWrapper>
      );
    });

    wrapper.update();
    /**
     * Open action drop down and click on set approval action
     */
    wrapper
      .find('button.pf-c-dropdown__toggle.pf-m-plain')
      .last()
      .simulate('click');
    wrapper.update();
    await act(async () => {
      wrapper
        .find('button.pf-c-dropdown__menu-item')
        .first()
        .simulate('click');
    });

    await act(async () => {
      wrapper.update();
    });
    wrapper.update();
    expect(wrapper.find(MemoryRouter).instance().history.location).toEqual(
      expect.objectContaining({
        pathname: '/platforms/platform/platform-inventories/edit-workflow',
        search: '?platform=123&inventory=222'
      })
    );
    expect(wrapper.find(EditApprovalWorkflow)).toHaveLength(1);
  });
});
