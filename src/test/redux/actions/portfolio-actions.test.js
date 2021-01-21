import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import {
  ADD_NOTIFICATION,
  CLEAR_NOTIFICATIONS
} from '@redhat-cloud-services/frontend-components-notifications/redux';
import notificationsMiddleware from '@redhat-cloud-services/frontend-components-notifications/notificationsMiddleware';
import {
  FETCH_PORTFOLIOS,
  FETCH_PORTFOLIO_ITEMS,
  FETCH_PORTFOLIO_ITEMS_WITH_PORTFOLIO,
  ADD_PORTFOLIO,
  UPDATE_PORTFOLIO,
  REMOVE_PORTFOLIO,
  REMOVE_PORTFOLIO_ITEMS,
  RESTORE_PORTFOLIO_ITEMS,
  RESET_SELECTED_PORTFOLIO,
  DELETE_TEMPORARY_PORTFOLIO,
  RESTORE_PORTFOLIO_PREV_STATE,
  UPDATE_TEMPORARY_PORTFOLIO,
  FETCH_PORTFOLIO
} from '../../../redux/action-types';
import {
  fetchPortfolios,
  fetchPortfolioItems,
  fetchPortfolioItemsWithPortfolio,
  addPortfolio,
  updatePortfolio,
  removePortfolio,
  removeProductsFromPortfolio,
  undoRemoveProductsFromPortfolio,
  undoRemovePortfolio,
  setOrFetchPortfolio
} from '../../../redux/actions/portfolio-actions';
import { CATALOG_API_BASE } from '../../../utilities/constants';

import { openApiReducerMock } from '../../__mocks__/open-api-mock';
import { mockApi } from '../../../helpers/shared/__mocks__/user-login';

describe('Portfolio actions', () => {
  const middlewares = [thunk, promiseMiddleware, notificationsMiddleware()];
  let mockStore;

  beforeEach(() => {
    mockStore = configureStore(middlewares);
  });

  afterEach(() => {
    mockApi.reset();
  });

  it('should dispatch correct actions after fetching portfolios', () => {
    const expectedPortfolio = { name: 'Name', description: 'Description' };
    mockApi
      .onGet(`${CATALOG_API_BASE}/portfolios?limit=50&offset=0`)
      .replyOnce(200, { data: [expectedPortfolio], meta: {} });
    const store = mockStore({
      portfolioReducer: {
        isLoading: false
      }
    });

    const expectedActions = [
      {
        type: `${FETCH_PORTFOLIOS}_PENDING`,
        meta: {
          count: 0,
          filter: '',
          limit: 50,
          offset: 0
        }
      },
      {
        type: `${FETCH_PORTFOLIOS}_FULFILLED`,
        meta: {
          count: 0,
          filter: '',
          limit: 50,
          offset: 0
        },
        payload: {
          data: [expectedPortfolio],
          meta: {}
        }
      }
    ];

    return store.dispatch(fetchPortfolios()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch error notification if fetch portfolios fails', () => {
    const store = mockStore({
      portfolioReducer: {
        isLoading: false
      }
    });

    const expectedActions = expect.arrayContaining([
      {
        type: `${FETCH_PORTFOLIOS}_PENDING`,
        meta: { filter: '', count: 0, limit: 50, offset: 0 }
      },
      expect.objectContaining({
        type: ADD_NOTIFICATION,
        payload: expect.objectContaining({ variant: 'danger' })
      }),
      expect.objectContaining({
        type: `${FETCH_PORTFOLIOS}_REJECTED`
      })
    ]);

    mockApi
      .onGet(`${CATALOG_API_BASE}/portfolios?limit=50&offset=0`)
      .replyOnce(500);

    return store.dispatch(fetchPortfolios()).catch(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch correct actions after fetchPortfolioItems action was called', () => {
    const store = mockStore({});

    mockApi
      .onGet(
        CATALOG_API_BASE +
          '/portfolio_items?filter[name][contains_i]=123&limit=50&offset=0'
      )
      .replyOnce(200, {
        data: [
          {
            portfolio_id: '1'
          }
        ],
        meta: {}
      });
    mockApi
      .onGet(`${CATALOG_API_BASE}/portfolios?filter[id][]=1`)
      .replyOnce(200, { data: [{ id: '1', name: 'portfolio name' }] });
    const expectedActions = [
      {
        type: `${FETCH_PORTFOLIO_ITEMS}_PENDING`,
        meta: { filter: '123', stateKey: 'products', storeState: true }
      },
      {
        type: `${FETCH_PORTFOLIO_ITEMS}_FULFILLED`,
        meta: { filter: '123', stateKey: 'products', storeState: true },
        payload: {
          data: [
            {
              portfolio_id: '1',
              portfolioName: 'portfolio name'
            }
          ],
          meta: {}
        }
      }
    ];

    return store.dispatch(fetchPortfolioItems('123')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch correct actions after fetchPortfolioItemsWithPortfolio action was called', () => {
    const store = mockStore({});

    mockApi
      .onGet(
        `${CATALOG_API_BASE}/portfolios/888/portfolio_items?filter[name][contains_i]=&limit=50&offset=0`
      )
      .replyOnce(200, { data: ['foo'] });

    const expectedActions = [
      {
        type: `${FETCH_PORTFOLIO_ITEMS_WITH_PORTFOLIO}_PENDING`,
        meta: {
          count: 0,
          filter: '',
          limit: 50,
          offset: 0,
          stateKey: 'portfolioItems',
          storeState: true
        }
      },
      {
        type: `${FETCH_PORTFOLIO_ITEMS_WITH_PORTFOLIO}_FULFILLED`,
        meta: {
          count: 0,
          filter: '',
          limit: 50,
          offset: 0,
          stateKey: 'portfolioItems',
          storeState: true
        },
        payload: { data: ['foo'] }
      }
    ];

    return store.dispatch(fetchPortfolioItemsWithPortfolio('888')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should create correct action creators when adding portfolio', () => {
    const store = mockStore({});
    mockApi
      .onGet(`${CATALOG_API_BASE}/portfolios?limit=50&offset=0`)
      .replyOnce(200, [{ data: [], meta: {} }]);
    mockApi
      .onPost(`${CATALOG_API_BASE}/portfolios`)
      .replyOnce(200, [{ data: 'foo' }]);

    const expectedActions = [
      expect.objectContaining({ type: `${ADD_PORTFOLIO}_PENDING` }),
      expect.objectContaining({
        type: ADD_NOTIFICATION,
        payload: expect.objectContaining({ variant: 'success' })
      }),
      expect.objectContaining({ type: `${ADD_PORTFOLIO}_FULFILLED` })
    ];

    return store
      .dispatch(addPortfolio({ data: 'new portfolio' }, { variant: 'success' }))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should create error action creators when adding portfolio failed', () => {
    const store = mockStore({});
    mockApi
      .onGet(`${CATALOG_API_BASE}/portfolios?limit=50&offset=0`)
      .replyOnce(200, [{ data: [], meta: {} }]);
    mockApi.onPost(CATALOG_API_BASE + '/portfolios').replyOnce(500);

    const expectedActions = [
      expect.objectContaining({ type: `${ADD_PORTFOLIO}_PENDING` }),
      expect.objectContaining({
        type: ADD_NOTIFICATION,
        payload: expect.objectContaining({ variant: 'danger' })
      }),
      expect.objectContaining({ type: `${ADD_PORTFOLIO}_REJECTED` })
    ];

    return store.dispatch(addPortfolio({ data: 'new portfolio' })).catch(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should create correct action creators when updating portfolio', () => {
    const store = mockStore({ openApiReducer: openApiReducerMock });
    mockApi
      .onGet(`${CATALOG_API_BASE}/portfolios?limit=50&offset=0`)
      .replyOnce(200, { data: [], meta: {} });
    mockApi
      .onPatch(CATALOG_API_BASE + '/portfolios/123')
      .replyOnce(200, { data: [], meta: {} });

    const expectedActions = [
      {
        type: UPDATE_TEMPORARY_PORTFOLIO,
        payload: { data: { foo: 'bar' }, id: '123' }
      },
      expect.objectContaining({ type: `${FETCH_PORTFOLIOS}_PENDING` }),
      expect.objectContaining({ type: `${FETCH_PORTFOLIOS}_FULFILLED` }),
      expect.objectContaining({
        type: ADD_NOTIFICATION,
        payload: expect.objectContaining({ variant: 'success' })
      })
    ];

    return store
      .dispatch(updatePortfolio({ id: '123', data: { foo: 'bar' } }))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should create correct action creators when updating portfolio failed', () => {
    const store = mockStore({ openApiReducer: openApiReducerMock });
    mockApi.onPatch(CATALOG_API_BASE + '/portfolios/123').replyOnce(500);

    const expectedActions = [
      expect.objectContaining({ type: `${UPDATE_PORTFOLIO}_PENDING` }),
      expect.objectContaining({
        type: ADD_NOTIFICATION,
        payload: expect.objectContaining({ variant: 'danger' })
      }),
      expect.objectContaining({ type: `${UPDATE_PORTFOLIO}_REJECTED` })
    ];

    return store
      .dispatch(updatePortfolio({ id: 123, data: { foo: 'bar' } }))
      .catch(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should create correct action creators when removing portfolio', () => {
    const store = mockStore({
      portfolioReducer: {
        portfolios: {
          meta: { limit: 50, offset: 0 },
          data: []
        }
      }
    });
    mockApi
      .onGet(`${CATALOG_API_BASE}/portfolios?limit=50&offset=0`)
      .replyOnce(200, {});
    mockApi
      .onDelete(CATALOG_API_BASE + '/portfolios/123')
      .replyOnce(200, { data: 'foo' });

    const expectedActions = [
      {
        type: DELETE_TEMPORARY_PORTFOLIO,
        payload: '123'
      },
      expect.objectContaining({ type: `${REMOVE_PORTFOLIO}_PENDING` }),
      expect.objectContaining({
        type: ADD_NOTIFICATION,
        payload: expect.objectContaining({ variant: 'success' })
      }),
      expect.objectContaining({ type: `${FETCH_PORTFOLIOS}_PENDING` }),
      expect.objectContaining({ type: `${FETCH_PORTFOLIOS}_FULFILLED` }),
      expect.objectContaining({ type: `${REMOVE_PORTFOLIO}_FULFILLED` })
    ];

    return store.dispatch(removePortfolio('123')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should create correct action creators when removing portfolio failed', () => {
    const store = mockStore({});
    mockApi
      .onGet(`${CATALOG_API_BASE}/portfolios?limit=50&offset=0`)
      .replyOnce(200, [{ data: [], meta: {} }]);
    mockApi.onDelete(CATALOG_API_BASE + '/portfolios/123').replyOnce(500);

    const expectedActions = [
      { type: DELETE_TEMPORARY_PORTFOLIO, payload: '123' },
      expect.objectContaining({ type: `${REMOVE_PORTFOLIO}_PENDING` }),
      { type: RESTORE_PORTFOLIO_PREV_STATE },
      expect.objectContaining({
        type: ADD_NOTIFICATION,
        payload: expect.objectContaining({ variant: 'danger' })
      }),
      expect.objectContaining({ type: `${REMOVE_PORTFOLIO}_REJECTED` })
    ];

    return store.dispatch(removePortfolio('123')).catch(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should create correct actions after remove portfolio items action success', () => {
    const store = mockStore({
      portfolioReducer: {
        portfolioItems: { meta: { limit: 0, offset: 0 } },
        selectedPortfolio: { id: '123' }
      }
    });
    const expectedActions = [
      {
        type: `${REMOVE_PORTFOLIO_ITEMS}_PENDING`
      },
      {
        type: `${FETCH_PORTFOLIO_ITEMS_WITH_PORTFOLIO}_PENDING`,
        meta: {
          filter: '',
          limit: 0,
          offset: 0,
          stateKey: 'portfolioItems',
          storeState: true
        }
      },
      {
        type: `${FETCH_PORTFOLIO_ITEMS_WITH_PORTFOLIO}_FULFILLED`,
        meta: {
          filter: '',
          limit: 0,
          offset: 0,
          stateKey: 'portfolioItems',
          storeState: true
        },
        payload: []
      },
      expect.objectContaining({ type: ADD_NOTIFICATION }),
      {
        type: `${REMOVE_PORTFOLIO_ITEMS}_FULFILLED`
      }
    ];

    mockApi
      .onDelete(`${CATALOG_API_BASE}/portfolio_items/1`)
      .replyOnce(200, { restore_key: 'restore-1' });
    mockApi
      .onDelete(`${CATALOG_API_BASE}/portfolio_items/2`)
      .replyOnce(200, { restore_key: 'restore-2' });
    mockApi
      .onDelete(`${CATALOG_API_BASE}/portfolio_items/3`)
      .replyOnce(200, { restore_key: 'restore-3' });
    mockApi
      .onGet(
        `${CATALOG_API_BASE}/portfolios/123/portfolio_items?filter[name][contains_i]=&limit=0&offset=0`
      )
      .replyOnce(200, []);

    return store
      .dispatch(
        removeProductsFromPortfolio(['1', '2', '3'], 'Foo portfolio', {
          id: '1',
          name: 'bar'
        })
      )
      .then(() => expect(store.getActions()).toEqual(expectedActions));
  });

  it('should create correct actions after remove portfolio items action fals', () => {
    const store = mockStore({
      portfolioReducer: {
        portfolioItems: { meta: {} },
        selectedPortfolio: { id: '123' }
      }
    });
    const expectedActions = [
      {
        type: `${REMOVE_PORTFOLIO_ITEMS}_PENDING`
      },
      expect.objectContaining({ type: ADD_NOTIFICATION }),
      expect.objectContaining({ type: `${REMOVE_PORTFOLIO_ITEMS}_REJECTED` })
    ];

    mockApi.onDelete(CATALOG_API_BASE + '/portfolio_items/1').replyOnce(500);

    return store
      .dispatch(removeProductsFromPortfolio(['1'], 'Foo portfolio'))
      .then(() => expect(store.getActions()).toEqual(expectedActions));
  });

  it('should create correct actions after restore portfolio items action success', () => {
    const store = mockStore({});
    const restoreData = [
      { portfolioItemId: '1', restoreKey: 'restore-1' },
      { portfolioItemId: '2', restoreKey: 'restore-2' }
    ];
    const expectedActions = [
      {
        type: `${RESTORE_PORTFOLIO_ITEMS}_PENDING`
      },
      {
        type: `${RESTORE_PORTFOLIO_ITEMS}_FULFILLED`
      },
      expect.objectContaining({ type: CLEAR_NOTIFICATIONS }),
      {
        type: `${FETCH_PORTFOLIO_ITEMS_WITH_PORTFOLIO}_PENDING`,
        meta: {
          count: 0,
          filter: '',
          limit: 50,
          offset: 0,
          stateKey: 'portfolioItems',
          storeState: true
        }
      },
      {
        type: `${FETCH_PORTFOLIO_ITEMS_WITH_PORTFOLIO}_FULFILLED`,
        meta: {
          count: 0,
          filter: '',
          limit: 50,
          offset: 0,
          stateKey: 'portfolioItems',
          storeState: true
        },
        payload: { data: [] }
      },
      expect.objectContaining({ type: ADD_NOTIFICATION })
    ];

    mockApi
      .onPost(CATALOG_API_BASE + '/portfolio_items/1/undelete')
      .replyOnce(200, { id: '1' });
    mockApi
      .onPost(CATALOG_API_BASE + '/portfolio_items/2/undelete')
      .replyOnce(200, { id: '2' });
    mockApi
      .onGet(
        `${CATALOG_API_BASE}/portfolios/999/portfolio_items?filter[name][contains_i]=&limit=50&offset=0`
      )
      .replyOnce(200, { data: [] });

    return store
      .dispatch(undoRemoveProductsFromPortfolio(restoreData, '999'))
      .then(() => expect(store.getActions()).toEqual(expectedActions));
  });

  it('should create correct actions after restore portfolio items action fails', () => {
    const store = mockStore({});
    const restoreData = [{ portfolioItemId: '1', restoreKey: 'restore-1' }];
    const expectedActions = [
      {
        type: `${RESTORE_PORTFOLIO_ITEMS}_PENDING`
      },
      expect.objectContaining({ type: ADD_NOTIFICATION }),
      expect.objectContaining({ type: `${RESTORE_PORTFOLIO_ITEMS}_REJECTED` })
    ];

    mockApi
      .onPost(CATALOG_API_BASE + '/portfolio_items/1/undelete')
      .replyOnce(500);

    return store
      .dispatch(undoRemoveProductsFromPortfolio(restoreData, '123'))
      .then(() => expect(store.getActions()).toEqual(expectedActions));
  });

  it('should call correct action creator for reset selected portfolio', () => {
    const store = mockStore({});
    store.dispatch({ type: RESET_SELECTED_PORTFOLIO });
    expect(store.getActions()).toEqual([{ type: RESET_SELECTED_PORTFOLIO }]);
  });

  it('should call correct actions after undoRemovePortfolio is successful', () => {
    const store = mockStore({
      portfolioReducer: {
        portfolios: {
          meta: {
            limit: 50,
            offset: 0
          },
          data: []
        }
      }
    });

    mockApi
      .onPost(`${CATALOG_API_BASE}/portfolios/123/undelete`)
      .replyOnce(200, { id: '123', name: 'Yay' });
    mockApi
      .onGet(`${CATALOG_API_BASE}/portfolios?limit=50&offset=0`)
      .replyOnce(200, { data: [] });
    const expectedActions = [
      {
        type: CLEAR_NOTIFICATIONS
      },
      expect.objectContaining({
        type: ADD_NOTIFICATION
      }),
      expect.objectContaining({ type: `${FETCH_PORTFOLIOS}_PENDING` }),
      expect.objectContaining({ type: `${FETCH_PORTFOLIOS}_FULFILLED` })
    ];
    return store
      .dispatch(
        undoRemovePortfolio(123, 'restore-key', { limit: 50, offset: 0 })
      )
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  describe('setOrFetchPortfolio', () => {
    const id = '123';
    const fullPorfolios = {
      data: [{ id: '898' }, { id, customProperty: 'cosi' }]
    };
    const emptyPortfolios = {
      data: [{ id: '898' }]
    };

    it('should set existing portfolio', () => {
      expect(setOrFetchPortfolio(id, fullPorfolios)).toEqual({
        type: `${FETCH_PORTFOLIO}_FULFILLED`,
        payload: fullPorfolios.data[1]
      });
    });

    it('should fetch portfolio', () => {
      expect(setOrFetchPortfolio(id, emptyPortfolios)).toEqual({
        type: FETCH_PORTFOLIO,
        payload: expect.any(Promise)
      });
    });
  });
});
