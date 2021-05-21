import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import { MemoryRouter } from 'react-router-dom';
import notificationsMiddleware from '@redhat-cloud-services/frontend-components-notifications/notificationsMiddleware';
import { platformInitialState } from '../../../redux/reducers/platform-reducer';
import Platforms from '../../../smart-components/platform/platforms';
import {
  CATALOG_INVENTORY_API_BASE,
  SOURCES_API_BASE
} from '../../../utilities/constants';
import { FETCH_PLATFORMS } from '../../../redux/action-types';
import { Provider } from 'react-redux';
import UserContext from '../../../user-context';
import {
  mockApi,
  mockGraphql
} from '../../../helpers/shared/__mocks__/user-login';

describe('<Platforms />', () => {
  let initialProps;
  let initialState;
  const middlewares = [thunk, promiseMiddleware, notificationsMiddleware()];
  let mockStore;
  beforeEach(() => {
    mockStore = configureStore(middlewares);
    initialProps = {};
    initialState = {
      breadcrumbsReducer: { fragments: [] },
      platformReducer: {
        ...platformInitialState
      }
    };
  });

  it('should mount and fetch platforms data', async () => {
    const store = mockStore(initialState);

    mockApi
      .onGet(`${CATALOG_INVENTORY_API_BASE}/sources?limit=1&filter[id][]=1`)
      .replyOnce(200, {
        data: [
          {
            id: '1',
            name: 'foo',
            availability_status: 'available',
            enabled: true
          }
        ],
        meta: {
          count: 1,
          limit: 50,
          offset: 0
        }
      });

    mockGraphql.onPost(`${SOURCES_API_BASE}/graphql`).replyOnce(200, {
      data: {
        application_types: [
          {
            sources: [
              {
                id: '1',
                name: 'foo'
              }
            ]
          }
        ]
      }
    });

    await act(async () => {
      mount(
        <UserContext.Provider
          value={{
            userIdentity: {
              identity: {
                user: { is_org_admin: true }
              }
            }
          }}
        >
          <MemoryRouter>
            <Provider store={store}>
              <Platforms {...initialProps} />
            </Provider>
          </MemoryRouter>
        </UserContext.Provider>
      );
    });
    const expectedActions = [
      {
        type: `${FETCH_PLATFORMS}_PENDING`
      },
      {
        type: `${FETCH_PLATFORMS}_FULFILLED`,
        payload: [
          {
            id: '1',
            name: 'foo',
            availability_status: 'available',
            enabled: true
          }
        ]
      }
    ];
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should call filter handler and filter data', async () => {
    const initialState = {
      breadcrumbsReducer: { fragments: [] },
      platformReducer: {
        ...platformInitialState,
        platforms: [
          {
            id: '1',
            name: 'Foo',
            description: 'desc',
            modified: 'mod'
          },
          {
            id: '2',
            name: 'Bar',
            description: 'desc',
            modified: 'mod'
          },
          {
            id: '3',
            name: 'baz',
            description: 'desc',
            modified: 'mod'
          }
        ]
      }
    };
    const store = mockStore(initialState);
    mockGraphql.onPost(`${SOURCES_API_BASE}/graphql`).replyOnce(200, {
      data: { application_types: [{ sources: [{ id: '1', name: 'foo' }] }] }
    });
    let wrapper;
    await act(async () => {
      wrapper = mount(
        <UserContext.Provider
          value={{
            userIdentity: {
              identity: {
                user: { is_org_admin: true }
              }
            }
          }}
        >
          <Provider store={store}>
            <MemoryRouter initialEntries={['/platforms']}>
              <Platforms {...initialProps} />
            </MemoryRouter>
          </Provider>
        </UserContext.Provider>
      );
    });

    const search = wrapper.find('input');

    search.getDOMNode().value = 'foo';
    search.simulate('change');
    wrapper.update();
    expect(wrapper.find('input').instance().value).toEqual('foo');
  });
});
