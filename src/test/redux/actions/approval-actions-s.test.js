import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';
import {
  APPROVAL_API_BASE,
  CATALOG_API_BASE
} from '../../../utilities/constants';
import { fetchWorkflows } from '../../../redux/actions/approval-actions-s';
import { ASYNC_ACTIONS } from '../../../redux/action-types/approval-action-types';
import notificationsMiddleware from '@redhat-cloud-services/frontend-components-notifications/notificationsMiddleware';
import { mockApi } from '../../../helpers/shared/__mocks__/user-login';

describe('approval actions', () => {
  const middlewares = [thunk, promiseMiddleware, notificationsMiddleware()];
  let mockStore;

  beforeEach(() => {
    mockStore = configureStore(middlewares);

    localStorage.setItem('catalog_standalone', true);
    localStorage.setItem('user', 'testUser');
    mockApi.onGet(`${CATALOG_API_BASE}/me/`).replyOnce(200, {
      username: 'fred',
      first_name: 'Fred',
      last_name: 'Flintstone'
    });
  });

  afterEach(() => {
    localStorage.setItem('catalog_standalone', false);
    localStorage.removeItem('user');
  });

  it('should dispatch correct actions after fetching workflows', () => {
    const store = mockStore({});
    const expectedActions = [
      {
        type: ASYNC_ACTIONS.FETCH_WORKFLOWS_PENDING
      },
      {
        payload: [
          {
            label: 'workflow',
            value: '123'
          }
        ],
        type: ASYNC_ACTIONS.FETCH_WORKFLOWS_FULFILLED
      }
    ];

    mockApi.onGet(`${APPROVAL_API_BASE}/workflows/`).replyOnce(200, {
      results: [
        {
          name: 'workflow',
          id: '123'
        }
      ]
    });

    return store.dispatch(fetchWorkflows()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
