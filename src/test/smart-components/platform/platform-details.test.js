import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import promiseMiddleware from 'redux-promise-middleware';
import { Route, MemoryRouter } from 'react-router-dom';
import notificationsMiddleware from '@redhat-cloud-services/frontend-components-notifications/notificationsMiddleware';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import PlatformDetails from '../../../smart-components/platform/platform-details';
import { platformInitialState } from '../../../redux/reducers/platform-reducer';
import { approvalInitialState } from '../../../redux/reducers/approval-reducer';
import DialogRoutes from '../../../smart-components/dialog-routes';

describe('<PlatformDetails />', () => {
  let initialProps;
  const middlewares = [thunk, promiseMiddleware, notificationsMiddleware()];
  let mockStore;
  let initialState;

  const ComponentWrapper = ({ store, initialEntries = ['/foo'], children }) => (
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>
        <Route path="/platform/platform-inventories">{children}</Route>
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
          name: 'Foo',
          availability_status: 'available',
          created_at: '2021-02-11T18:14:39Z',
          enabled: true,
          info: { version: '3.8.1', ansible_version: '2.9.15' },
          last_available_at: '2021-02-18T18:54:01Z',
          last_checked_at: '2021-02-18T19:15:57Z',
          last_refresh_message: 'Sending request to RHC',
          last_successful_refresh_at: '2021-02-18T18:00:34Z',
          mqtt_client_id: '16d5041f-f2e5-45d7-92a8-5650b1503958',
          refresh_started_at: '2021-02-18T18:55:17Z',
          refresh_state: 'service_offerings:add=1\n inventories:add=1',
          refresh_task_id: '8c0240e5-2511-4474-b25b-4c5e3cfbe3f0',
          uid: '76614789-743b-46e9-a6a7-1d937d966ae6',
          updated_at: '2021-02-18T19:15:57Z'
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
        initialEntries={['/platform/platform-inventories?platform=123']}
      >
        <PlatformDetails store={mockStore(initialState)} {...initialProps} />
        );
      </ComponentWrapper>
    ).find(PlatformDetails);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
