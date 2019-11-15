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
import { TOPOLOGICAL_INVENTORY_API_BASE, SOURCES_API_BASE } from '../../../utilities/constants';
import { FETCH_PLATFORM, FETCH_PLATFORM_INVENTORIES } from '../../../redux/action-types';
import { platformInitialState } from '../../../redux/reducers/platform-reducer';
import EditApprovalWorkflow from '../../../smart-components/common/edit-approval-workflow';
import { act } from 'react-dom/test-utils';

describe('<PlatformInventories />', () => {
  let initialProps;
  const middlewares = [ thunk, promiseMiddleware(), notificationsMiddleware() ];
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
    apiClientMock.get(`${SOURCES_API_BASE}/sources/123`, mockOnce({ body: { name: 'Foo' }}));
    apiClientMock.get(`${TOPOLOGICAL_INVENTORY_API_BASE}/sources/123/service_inventories?filter%5Bname%5D%5Bcontains_i%5D=&limit=50&offset=0`,
      mockOnce({
        body: {
          data: [{ id: 111 }]}
      }));

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

    apiClientMock.get(`${SOURCES_API_BASE}/sources/123`, mockOnce({ body: { name: 'Foo' }}));
    apiClientMock.get(`${TOPOLOGICAL_INVENTORY_API_BASE}/sources/123/service_inventories?filter%5Bname%5D%5Bcontains_i%5D=&limit=50&offset=0`,
      mockOnce({
        body: {
          data: [{
            id: '222',
            name: 'Test inventory',
            created_at: 'date',
            workflow: 'wf'
          }]}
      }));

    await act(async () => {
      wrapper = mount(<ComponentWrapper store={ store } initialEntries={ [ '/platforms/detail/123/platform-inventories' ] }>
        <PlatformInventories { ...initialProps } store={ mockStore(initialState) }/>
      </ComponentWrapper>);
    });

    wrapper.update();
    /**
     * Open action drop down and click on edit approval action
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
