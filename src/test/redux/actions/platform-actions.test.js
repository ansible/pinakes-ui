import configureStore from 'redux-mock-store' ;
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import { notificationsMiddleware, ADD_NOTIFICATION } from '@redhat-cloud-services/frontend-components-notifications/';
import {
  FETCH_PLATFORM,
  FETCH_PLATFORMS,
  FETCH_PLATFORM_ITEMS,
  FETCH_MULTIPLE_PLATFORM_ITEMS
} from '../../../redux/action-types';
import {
  fetchPlatforms,
  fetchPlatformItems,
  fetchMultiplePlatformItems,
  fetchSelectedPlatform
} from '../../../redux/actions/platform-actions';
import { SOURCES_API_BASE, TOPOLOGICAL_INVENTORY_API_BASE } from '../../../utilities/constants';

describe('Platform actions', () => {
  const middlewares = [ thunk, promiseMiddleware(), notificationsMiddleware() ];
  let mockStore;

  beforeEach(() => {
    mockStore = configureStore(middlewares);
  });

  it('should dispatch correct actions after fetching platforms', () => {
    const store = mockStore({
      platformReducer: {
        isPlatformDataLoading: false
      }
    });
    apiClientMock.post(`${SOURCES_API_BASE}/graphql`, mockOnce({
      body: { data: {
        application_types: [{
          sources: [{
            id: '1',
            name: 'Source 1'
          }]
        }]
      }}
    }));

    const expectedActions = [{
      type: `${FETCH_PLATFORMS}_PENDING`
    }, {
      type: `${FETCH_PLATFORMS}_FULFILLED`,
      payload: [ expect.objectContaining({ id: '1', name: 'Source 1' }) ]
    }];

    return store.dispatch(fetchPlatforms()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch correct actions after failed fetching platforms', () => {
    const store = mockStore({
      platformReducer: {
        isPlatformDataLoading: false
      }
    });
    apiClientMock.post(`${SOURCES_API_BASE}/graphql`, mockOnce({ body: {
      errors: [{ message: 'error', errorType: 'Some error title' }]
    }
    }));

    const expectedActions = [
      { type: `${FETCH_PLATFORMS}_PENDING` }, {
        type: `${ADD_NOTIFICATION}`,
        payload: expect.objectContaining({ variant: 'danger', message: 'Some error title', data: 'error' })
      },
      expect.objectContaining({ type: `${FETCH_PLATFORMS}_REJECTED` })
    ];

    return store.dispatch(fetchPlatforms()).catch(() => {
      console.log(store.getActions());
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch correct actions after fetching platform items', () => {
    const store = mockStore({
      platformReducer: {
        isPlatformDataLoading: false
      }
    });

    apiClientMock.get(`${TOPOLOGICAL_INVENTORY_API_BASE}/sources/1/service_offerings?filter%5Barchived_at%5D%5Bnil%5D=`, mockOnce({ body: { data: [{
      id: '1',
      name: 'Offering 1'
    }]}}));

    const expectedActions = [{
      type: `${FETCH_PLATFORM_ITEMS}_PENDING`,
      meta: { platformId: '1' }
    }, {
      meta: { platformId: '1' },
      type: `${FETCH_PLATFORM_ITEMS}_FULFILLED`,
      payload: { data: [{ id: '1', name: 'Offering 1' }]}
    }];

    return store.dispatch(fetchPlatformItems('1')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch correct actions after fetching platform items fails', () => {
    const store = mockStore({
      platformReducer: {
        isPlatformDataLoading: false
      }
    });

    apiClientMock.get(`${TOPOLOGICAL_INVENTORY_API_BASE}/sources/1/service_offerings?filter%5Barchived_at%5D%5Bnil%5D=`, mockOnce({ status: 500 }));

    const expectedActions = [
      {
        type: `${FETCH_PLATFORM_ITEMS}_PENDING`,
        meta: { platformId: '1' }
      }, {
        type: `${ADD_NOTIFICATION}`,
        payload: expect.objectContaining({ variant: 'danger' })
      },
      expect.objectContaining({ type: `${FETCH_PLATFORM_ITEMS}_REJECTED` })
    ];

    return store.dispatch(fetchPlatformItems('1')).catch(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch correct actions after fetching multiple platforms items', () => {
    const store = mockStore({
      platformReducer: {
        isPlatformDataLoading: false
      }
    });
    apiClientMock.get(`${TOPOLOGICAL_INVENTORY_API_BASE}/sources/1/service_offerings?filter%5Barchived_at%5D%5Bnil%5D=`, mockOnce({ body: { data: [{
      id: '1',
      name: 'Offering 1'
    }]}}));
    apiClientMock.get(`${TOPOLOGICAL_INVENTORY_API_BASE}/sources/2/service_offerings?filter%5Barchived_at%5D%5Bnil%5D=`, mockOnce({ body: { data: [{
      id: '2',
      name: 'Offering 2'
    }]}}));
    apiClientMock.get(`${TOPOLOGICAL_INVENTORY_API_BASE}/sources/3/service_offerings?filter%5Barchived_at%5D%5Bnil%5D=`, mockOnce({ body: { data: [{
      id: '3',
      name: 'Offering 3'
    }]}}));

    const expectedActions = [{
      type: `${FETCH_MULTIPLE_PLATFORM_ITEMS}_PENDING`
    }, {
      type: `${FETCH_MULTIPLE_PLATFORM_ITEMS}_FULFILLED`,
      payload: {
        1: { data: [{ id: '1', name: 'Offering 1' }]},
        2: { data: [{ id: '2', name: 'Offering 2' }]},
        3: { data: [{ id: '3', name: 'Offering 3' }]}
      }
    }];

    return store.dispatch(fetchMultiplePlatformItems([ '1', '2', '3' ])).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch correct actions after fetching multiple platforms items fails', () => {
    const store = mockStore({
      platformReducer: {
        isPlatformDataLoading: false
      }
    });
    apiClientMock.get(`${TOPOLOGICAL_INVENTORY_API_BASE}/sources/1/service_offerings?filter%5Barchived_at%5D%5Bnil%5D=`, mockOnce({ body: { data: [{
      id: '1',
      name: 'Offering 1'
    }]}}));
    apiClientMock.get(`${TOPOLOGICAL_INVENTORY_API_BASE}/sources/2/service_offerings?filter%5Barchived_at%5D%5Bnil%5D=`, mockOnce({ body: { data: [{
      id: '2',
      name: 'Offering 2'
    }]}}));
    apiClientMock.get(`${TOPOLOGICAL_INVENTORY_API_BASE}/sources/3/service_offerings?filter%5Barchived_at%5D%5Bnil%5D=`, mockOnce({ status: 500 }));

    const expectedActions = [{
      type: `${FETCH_MULTIPLE_PLATFORM_ITEMS}_PENDING`
    }, {
      type: `${ADD_NOTIFICATION}`,
      payload: expect.objectContaining({ variant: 'danger' })
    },
    expect.objectContaining({ type: `${FETCH_MULTIPLE_PLATFORM_ITEMS}_REJECTED` })
    ];

    return store.dispatch(fetchMultiplePlatformItems([ '1', '2', '3' ])).catch(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch correct actions after fetching selected platform', () => {
    const store = mockStore({
      platformReducer: {
        isPlatformDataLoading: false
      }
    });
    apiClientMock.get(`${SOURCES_API_BASE}/sources/1`, mockOnce({
      body: {
        id: '1',
        name: 'Source 1'
      }
    }));

    const expectedActions = [{
      type: `${FETCH_PLATFORM}_PENDING`
    }, {
      type: `${FETCH_PLATFORM}_FULFILLED`,
      payload: expect.objectContaining({ id: '1', name: 'Source 1' })
    }];

    return store.dispatch(fetchSelectedPlatform('1')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch correct actions after fetching selected platform fails', () => {
    const store = mockStore({
      platformReducer: {
        isPlatformDataLoading: false
      }
    });
    apiClientMock.get(`${SOURCES_API_BASE}/sources/1`, mockOnce({
      status: 500
    }));

    const expectedActions = [{
      type: `${FETCH_PLATFORM}_PENDING`
    }, {
      type: `${ADD_NOTIFICATION}`,
      payload: expect.objectContaining({ variant: 'danger' })
    },
    expect.objectContaining({ type: `${FETCH_PLATFORM}_REJECTED` })
    ];

    return store.dispatch(fetchSelectedPlatform('1')).catch(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
