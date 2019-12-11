import React from 'react';
import configureStore from 'redux-mock-store' ;
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import promiseMiddleware from 'redux-promise-middleware';
import { Route, MemoryRouter } from 'react-router-dom';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications/';
import { mount, shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import PlatformInventories from '../../../smart-components/platform/platform-inventories';
import { TOPOLOGICAL_INVENTORY_API_BASE, SOURCES_API_BASE, APPROVAL_API_BASE } from '../../../utilities/constants';
import { FETCH_PLATFORM, FETCH_PLATFORM_INVENTORIES } from '../../../redux/action-types';
import { platformInitialState } from '../../../redux/reducers/platform-reducer';
import { approvalInitialState } from '../../../redux/reducers/approval-reducer';
import EditApprovalWorkflow from '../../../smart-components/common/edit-approval-workflow';
import { act } from 'react-dom/test-utils';
import { mockApi } from '../../__mocks__/user-login';

describe('<PlatformInventories />', () => {
  let initialProps;
  const middlewares = [ thunk, promiseMiddleware, notificationsMiddleware() ];
  let mockStore;
  let initialState;

  const ComponentWrapper = ({ store, initialEntries = [ '/foo' ], children }) => (
    <Provider store={ store }>
      <MemoryRouter initialEntries={ initialEntries }>
        <Route path='/platforms/detail/:id/platform-inventories'>
          { children }
        </Route>
      </MemoryRouter>
    </Provider>
  );

  beforeEach(() => {
    initialProps = {
    };
    mockStore = configureStore(middlewares);
    initialState = {
      approvalReducer: {
        ...approvalInitialState,
        resolvedWorkflows: []
      },
      platformReducer: {
        ...platformInitialState,
        selectedPlatform: {
          id: '123',
          name: 'Foo'
        },
        platformInventories: {
          data: [{
            id: '222',
            name: 'Test inventory',
            created_at: 'date',
            workflow: 'wf'
          }],
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
      <ComponentWrapper store={ store } initialEntries={ [ '/platforms/detail/123/platform-inventories' ] }>
        <PlatformInventories store={ mockStore(initialState) } { ...initialProps } />);
      </ComponentWrapper>).find(PlatformInventories);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('should mount and fetch data', async done=> {
    const store = mockStore(initialState);
    mockApi.onGet(`${SOURCES_API_BASE}/sources/123`).replyOnce(200, { name: 'Foo' });
    mockApi.onGet(`${TOPOLOGICAL_INVENTORY_API_BASE}/sources/123/service_inventories?filter[name][contains_i]=&limit=50&offset=0`)
    .replyOnce(200, { data: [{ id: 111 }]});

    const expectedActions = [
      { type: `${FETCH_PLATFORM}_PENDING` },
      { type: `${FETCH_PLATFORM_INVENTORIES}_PENDING` },
      { type: `${FETCH_PLATFORM}_FULFILLED`, payload: { name: 'Foo' }},
      { type: `${FETCH_PLATFORM_INVENTORIES}_FULFILLED`, payload: { data: [{ id: 111 }]}}
    ];

    await act(async () => {
      mount(<ComponentWrapper store={ store } initialEntries={ [ '/platforms/detail/123/platform-inventories' ] }>
        <PlatformInventories { ...initialProps } store={ mockStore(initialState) }/>
      </ComponentWrapper>);
    });

    setImmediate(() => {
      expect(store.getActions()).toEqual(expectedActions);
      done();
    });
  });

  it('should redirect to Edit info page', async done => {
    const store = mockStore(initialState);
    let wrapper;

    mockApi.onGet(`${SOURCES_API_BASE}/sources/123`).replyOnce(200, { name: 'Foo' });
    mockApi.onGet(`${APPROVAL_API_BASE}/workflows`).replyOnce(200, { data: []});
    mockApi.onGet(`${TOPOLOGICAL_INVENTORY_API_BASE}/sources/123/service_inventories?filter[name][contains_i]=&limit=50&offset=0`)
    .replyOnce(200, {
      data: [{
        id: '222',
        name: 'Test inventory',
        created_at: 'date',
        workflow: 'wf'
      }]
    });
    mockApi.onGet(`${APPROVAL_API_BASE}/workflows/?app_name=catalog&object_type=Inventory&object_id=123&filter[name][contains]=&limit=50&offset=0`)
    .replyOnce(200, { data: []});

    await act(async () => {
      wrapper = mount(<ComponentWrapper store={ store } initialEntries={ [ '/platforms/detail/123/platform-inventories' ] }>
        <PlatformInventories { ...initialProps } store={ mockStore(initialState) }/>
      </ComponentWrapper>);
    });

    wrapper.update();
    /**
     * Open action drop down and click on set approval action
     */
    wrapper.find('button.pf-c-dropdown__toggle.pf-m-plain').last().simulate('click');
    await act(async() => {
      wrapper.find('a.pf-c-dropdown__menu-item').first().simulate('click');
    });

    wrapper.update();
    expect(wrapper.find(MemoryRouter).instance().history.location.pathname)
    .toEqual('/platforms/detail/123/platform-inventories/edit-workflow/222');
    expect(wrapper.find(EditApprovalWorkflow)).toHaveLength(1);
    done();
  });

});
