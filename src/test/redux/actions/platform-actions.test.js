import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import { ADD_NOTIFICATION } from '@redhat-cloud-services/frontend-components-notifications/redux';
import notificationsMiddleware from '@redhat-cloud-services/frontend-components-notifications/notificationsMiddleware';
import {
  FETCH_PLATFORM,
  FETCH_PLATFORMS,
  FETCH_PLATFORM_ITEMS,
  FETCH_MULTIPLE_PLATFORM_ITEMS,
  FETCH_SERVICE_OFFERING
} from '../../../redux/action-types';
import {
  fetchPlatforms,
  fetchPlatformItems,
  fetchMultiplePlatformItems,
  fetchSelectedPlatform,
  fetchServiceOffering
} from '../../../redux/actions/platform-actions';
import {
  SOURCES_API_BASE,
  CATALOG_INVENTORY_API_BASE
} from '../../../utilities/constants';
import {
  mockApi,
  mockGraphql
} from '../../../helpers/shared/__mocks__/user-login';

describe('Platform actions', () => {
  const middlewares = [thunk, promiseMiddleware, notificationsMiddleware()];
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
    mockGraphql.onPost(`${SOURCES_API_BASE}/graphql`).replyOnce(200, {
      data: {
        application_types: [
          {
            sources: [
              {
                id: '1',
                name: 'Source 1'
              }
            ]
          }
        ]
      }
    });

    const expectedActions = [
      {
        type: `${FETCH_PLATFORMS}_PENDING`
      },
      {
        type: `${FETCH_PLATFORMS}_FULFILLED`,
        payload: [expect.objectContaining({ id: '1', name: 'Source 1' })]
      }
    ];

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
    mockGraphql.onPost(`${SOURCES_API_BASE}/graphql`).replyOnce(200, {
      errors: [{ message: 'error', errorType: 'Some error title' }]
    });

    const expectedActions = [
      { type: `${FETCH_PLATFORMS}_PENDING` },
      {
        type: `${ADD_NOTIFICATION}`,
        payload: expect.objectContaining({
          variant: 'danger',
          message: 'Some error title',
          data: 'error'
        })
      },
      expect.objectContaining({ type: `${FETCH_PLATFORMS}_REJECTED` })
    ];

    return store.dispatch(fetchPlatforms()).catch(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch correct actions after fetching platform items', () => {
    const store = mockStore({
      platformReducer: {
        isPlatformDataLoading: false
      }
    });

    mockApi
      .onGet(
        `${CATALOG_INVENTORY_API_BASE}/sources/1/service_offerings?filter[archived_at][nil]`
      )
      .replyOnce(200, { data: [{ id: '1', name: 'Offering 1' }] });

    const expectedActions = [
      {
        type: `${FETCH_PLATFORM_ITEMS}_PENDING`,
        meta: { platformId: '1' }
      },
      {
        meta: { platformId: '1' },
        type: `${FETCH_PLATFORM_ITEMS}_FULFILLED`,
        payload: { data: [{ id: '1', name: 'Offering 1' }] }
      }
    ];

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

    mockApi
      .onGet(
        `${CATALOG_INVENTORY_API_BASE}/sources/1/service_offerings?filter%5Barchived_at%5D%5Bnil%5D=`
      )
      .replyOnce(500);

    const expectedActions = [
      {
        type: `${FETCH_PLATFORM_ITEMS}_PENDING`,
        meta: { platformId: '1' }
      },
      {
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
    mockApi
      .onGet(
        `${CATALOG_INVENTORY_API_BASE}/sources/1/service_offerings?filter[archived_at][nil]`
      )
      .replyOnce(200, {
        data: [
          {
            id: '1',
            name: 'Offering 1'
          }
        ]
      });
    mockApi
      .onGet(
        `${CATALOG_INVENTORY_API_BASE}/sources/2/service_offerings?filter[archived_at][nil]`
      )
      .replyOnce(200, {
        data: [
          {
            id: '2',
            name: 'Offering 2'
          }
        ]
      });
    mockApi
      .onGet(
        `${CATALOG_INVENTORY_API_BASE}/sources/3/service_offerings?filter[archived_at][nil]`
      )
      .replyOnce(200, {
        data: [
          {
            id: '3',
            name: 'Offering 3'
          }
        ]
      });

    const expectedActions = [
      {
        type: `${FETCH_MULTIPLE_PLATFORM_ITEMS}_PENDING`
      },
      {
        type: `${FETCH_MULTIPLE_PLATFORM_ITEMS}_FULFILLED`,
        payload: {
          1: { data: [{ id: '1', name: 'Offering 1' }] },
          2: { data: [{ id: '2', name: 'Offering 2' }] },
          3: { data: [{ id: '3', name: 'Offering 3' }] }
        }
      }
    ];

    return store
      .dispatch(fetchMultiplePlatformItems(['1', '2', '3']))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should dispatch correct actions after fetching multiple platforms items fails', () => {
    const store = mockStore({
      platformReducer: {
        isPlatformDataLoading: false
      }
    });
    mockApi
      .onGet(
        `${CATALOG_INVENTORY_API_BASE}/sources/1/service_offerings?filter[archived_at][nil]`
      )
      .replyOnce(200, {
        data: [
          {
            id: '1',
            name: 'Offering 1'
          }
        ]
      });
    mockApi
      .onGet(
        `${CATALOG_INVENTORY_API_BASE}/sources/2/service_offerings?filter[archived_at][nil]`
      )
      .replyOnce(200, {
        data: [
          {
            id: '2',
            name: 'Offering 2'
          }
        ]
      });
    mockApi
      .onGet(
        `${CATALOG_INVENTORY_API_BASE}/sources/3/service_offerings?filter[archived_at][nil]`
      )
      .replyOnce(500);
    const expectedActions = [
      {
        type: `${FETCH_MULTIPLE_PLATFORM_ITEMS}_PENDING`
      },
      {
        type: `${ADD_NOTIFICATION}`,
        payload: expect.objectContaining({ variant: 'danger' })
      },
      expect.objectContaining({
        type: `${FETCH_MULTIPLE_PLATFORM_ITEMS}_REJECTED`
      })
    ];

    return store
      .dispatch(fetchMultiplePlatformItems(['1', '2', '3']))
      .catch(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should dispatch correct actions after fetching selected platform', () => {
    const store = mockStore({
      platformReducer: {
        isPlatformDataLoading: false
      }
    });
    mockApi.onGet(`${CATALOG_INVENTORY_API_BASE}/sources/1`).replyOnce(200, {
      id: '1',
      name: 'Source 1',
      created_at: '2021-02-02T02:15:43Z',
      info: { version: '3.5.0', ansible_version: '2.8.0' },
      mqtt_client_id: 'ffe724c3-b843-4266-8993-95a246433f96',
      enabled: true,
      refresh_state: 'success',
      bytes_received: 918,
      refresh_started_at: '2021-02-04T21:00:47Z',
      refresh_finished_at: '2021-02-04T21:00:47Z',
      availability_status: 'available',
      last_successful_refresh_at: '2021-02-04T21:00:39Z',
      last_checked_at: '2021-02-04T21:00:36Z',
      last_available_at: '2021-02-04T21:00:36Z',
      uid: '4983c459-c4e6-4677-8513-ffbe49b32860',
      updated_at: '2021-02-04T21:00:47Z'
    });

    const expectedActions = [
      {
        type: `${FETCH_PLATFORM}_PENDING`
      },
      {
        type: `${FETCH_PLATFORM}_FULFILLED`,
        payload: expect.objectContaining({ id: '1', name: 'Source 1' })
      }
    ];

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
    mockApi.onGet(`${SOURCES_API_BASE}/sources/1`).replyOnce(500);

    const expectedActions = [
      {
        type: `${FETCH_PLATFORM}_PENDING`
      },
      {
        type: `${ADD_NOTIFICATION}`,
        payload: expect.objectContaining({ variant: 'danger' })
      },
      expect.objectContaining({ type: `${FETCH_PLATFORM}_REJECTED` })
    ];

    return store.dispatch(fetchSelectedPlatform('1')).catch(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch correct actions after fetching service offering data', () => {
    const store = mockStore({});
    const expectedActions = [
      {
        type: `${FETCH_SERVICE_OFFERING}_PENDING`
      },
      {
        type: `${FETCH_SERVICE_OFFERING}_FULFILLED`,
        payload: {
          service: {
            id: 'offering-id'
          },
          source: {
            id: 'source-id',
            source_type_id: 'source-type-id',
            icon_url: '/icon/url'
          }
        }
      }
    ];
    mockApi
      .onGet(`${CATALOG_INVENTORY_API_BASE}/service_offerings/offering-id`)
      .replyOnce(200, { id: 'offering-id' });
    mockApi
      .onGet(`${SOURCES_API_BASE}/sources/source-id`)
      .replyOnce(200, { id: 'source-id', source_type_id: 'source-type-id' });
    mockApi
      .onGet(`${SOURCES_API_BASE}/source_types/source-type-id`)
      .replyOnce(200, { id: 'source-type-id', icon_url: '/icon/url' });

    store
      .dispatch(fetchServiceOffering('offering-id', 'source-id'))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });
});
