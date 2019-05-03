import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store' ;
import promiseMiddleware from 'redux-promise-middleware';
import { RBAC_API_BASE } from '../../../utilities/constants';
import { fetchRbacGroups } from '../../../redux/actions/rbac-actions';
import { FETCH_RBAC_GROUPS } from '../../../redux/action-types';
import { notificationsMiddleware } from '@red-hat-insights/insights-frontend-components/components/Notifications';

describe('rbac actions', () => {

  const middlewares = [ thunk, promiseMiddleware(), notificationsMiddleware() ];
  let mockStore;

  beforeEach(() => {
    mockStore = configureStore(middlewares);
  });

  it('should dispatch correct actions after fetching groups', () => {
    const store = mockStore({});
    const expectedActions = [{
      type: `${FETCH_RBAC_GROUPS}_PENDING`
    }, {
      payload: [{
        label: 'groupName'
      }],
      type: `${FETCH_RBAC_GROUPS}_FULFILLED`
    }];

    apiClientMock.get(`${RBAC_API_BASE}/groups/`, mockOnce({
      body: {
        data: [{
          name: 'groupName'
        }]
      }
    }));

    return store.dispatch(fetchRbacGroups()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});

