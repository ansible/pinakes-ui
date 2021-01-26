import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';
import { RBAC_API_BASE } from '../../../utilities/constants';
import { fetchRbacGroups } from '../../../redux/actions/rbac-actions';
import { FETCH_RBAC_GROUPS } from '../../../redux/action-types';
import notificationsMiddleware from '@redhat-cloud-services/frontend-components-notifications/notificationsMiddleware';
import { mockApi } from '../../../helpers/shared/__mocks__/user-login';

describe('rbac actions', () => {
  const middlewares = [thunk, promiseMiddleware, notificationsMiddleware()];
  let mockStore;

  beforeEach(() => {
    mockStore = configureStore(middlewares);
  });

  afterEach(() => {
    mockApi.reset();
  });

  it('should dispatch correct actions after fetching groups', () => {
    const store = mockStore({});
    const expectedActions = [
      {
        type: `${FETCH_RBAC_GROUPS}_PENDING`
      },
      {
        payload: [
          {
            label: 'groupName'
          }
        ],
        type: `${FETCH_RBAC_GROUPS}_FULFILLED`
      }
    ];

    mockApi.onGet(`${RBAC_API_BASE}/groups/`).replyOnce(200, {
      data: [
        {
          name: 'groupName'
        }
      ]
    });

    return store.dispatch(fetchRbacGroups()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
