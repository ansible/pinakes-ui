import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store' ;
import promiseMiddleware from 'redux-promise-middleware';
import { APPROVAL_API_BASE } from '../../../utilities/constants';
import { fetchWorkflows } from '../../../redux/actions/approval-actions';
import { ASYNC_ACTIONS } from '../../../redux/action-types/approval-action-types';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications/';
import { mockApi } from '../../__mocks__/user-login';

describe('approval actions', () => {

  const middlewares = [ thunk, promiseMiddleware, notificationsMiddleware() ];
  let mockStore;

  beforeEach(() => {
    mockStore = configureStore(middlewares);
  });

  it('should dispatch correct actions after fetching workflows', () => {
    const store = mockStore({});
    const expectedActions = [{
      type: ASYNC_ACTIONS.FETCH_WORKFLOWS_PENDING
    }, {
      payload: [{
        label: 'workflow',
        value: '123'
      }],
      type: ASYNC_ACTIONS.FETCH_WORKFLOWS_FULFILLED
    }];

    mockApi.onGet(`${APPROVAL_API_BASE}/workflows`).replyOnce(200, {
      data: [{
        name: 'workflow',
        id: '123'
      }]
    });

    return store.dispatch(fetchWorkflows()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});

