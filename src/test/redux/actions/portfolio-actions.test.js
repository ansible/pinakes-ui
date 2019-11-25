import configureStore from 'redux-mock-store' ;
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import { notificationsMiddleware, ADD_NOTIFICATION, CLEAR_NOTIFICATIONS } from '@redhat-cloud-services/frontend-components-notifications/';
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
  ADD_TEMPORARY_PORTFOLIO,
  RESTORE_PORTFOLIO_PREV_STATE,
  UPDATE_TEMPORARY_PORTFOLIO
} from '../../../redux/action-types';
import {
  fetchPortfolios,
  fetchPortfolioItems,
  fetchPortfolioItemsWithPortfolio,
  addPortfolio,
  updatePortfolio,
  removePortfolio,
  removeProductsFromPortfolio,
  undoRemoveProductsFromPortfolio
} from '../../../redux/actions/portfolio-actions';
import {
  CATALOG_API_BASE
} from '../../../utilities/constants';

import { openApiReducerMock } from '../../__mocks__/open-api-mock';
import { mockApi } from '../../__mocks__/user-login';

describe('Portfolio actions', () => {
  const middlewares = [ thunk, promiseMiddleware, notificationsMiddleware() ];
  let mockStore;

  beforeEach(() => {
    mockStore = configureStore(middlewares);
  });

  afterEach(() => {
    mockApi.reset();
  });

  it('should dispatch correct actions after fetching portfolios', () => {
    const expectedPortfolio = { name: 'Name', description: 'Description' };
    mockApi.onGet(`${CATALOG_API_BASE}/portfolios?filter[name][contains_i]=&limit=50&offset=0`)
    .replyOnce(200, { data: [ expectedPortfolio ], meta: {}});
    const store = mockStore({
      portfolioReducer: {
        isLoading: false
      }
    });

    const expectedActions = [{
      type: `${FETCH_PORTFOLIOS}_PENDING`
    }, {
      type: `${FETCH_PORTFOLIOS}_FULFILLED`,
      payload: { data: [ expectedPortfolio ], meta: {}}
    }];

    return store.dispatch(fetchPortfolios())
    .then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch error notification if fetch portfolios fails', () => {
    const store = mockStore({
      portfolioReducer: {
        isLoading: false
      }
    });

    const expectedActions = expect.arrayContaining([{
      type: `${FETCH_PORTFOLIOS}_PENDING`
    },
    expect.objectContaining({
      type: ADD_NOTIFICATION,
      payload: expect.objectContaining({ variant: 'danger' })
    }),
    expect.objectContaining({
      type: `${FETCH_PORTFOLIOS}_REJECTED`

    }) ]);

    mockApi.onGet(CATALOG_API_BASE + '/portfolios?filter[name][contains_i]=&limit=50&offset=0').replyOnce(500);

    return store.dispatch(fetchPortfolios())
    .catch(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch correct actions after fetchPortfolioItems action was called', () => {
    const store = mockStore({});

    mockApi.onGet(CATALOG_API_BASE + '/portfolio_items?filter[name][contains_i]=123&limit=50&offset=0').replyOnce(200, { data: [], meta: {}});

    const expectedActions = [{
      type: `${FETCH_PORTFOLIO_ITEMS}_PENDING`
    }, {
      type: `${FETCH_PORTFOLIO_ITEMS}_FULFILLED`,
      payload: { data: [], meta: {}}
    }];

    return store.dispatch(fetchPortfolioItems(123))
    .then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch correct actions after fetchPortfolioItemsWithPortfolio action was called', () => {
    const store = mockStore({});

    mockApi.onGet(`${CATALOG_API_BASE}/portfolios/123/portfolio_items`).replyOnce(200, { data: [ 'foo' ]});

    const expectedActions = [{
      type: `${FETCH_PORTFOLIO_ITEMS_WITH_PORTFOLIO}_PENDING`
    }, {
      type: `${FETCH_PORTFOLIO_ITEMS_WITH_PORTFOLIO}_FULFILLED`,
      payload: { data: [ 'foo' ]}
    }];

    return store.dispatch(fetchPortfolioItemsWithPortfolio(123))
    .then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should create correct action creators when adding portfolio', () => {
    const store = mockStore({});
    mockApi.onGet(`${CATALOG_API_BASE}/portfolios?filter[name][contains_i]=&limit=50&offset=0`).replyOnce(200, [{ data: [], meta: {}}]);
    mockApi.onPost(`${CATALOG_API_BASE}/portfolios`).replyOnce(200, [{ data: 'foo' }]);

    const expectedActions = [
      {
        type: ADD_TEMPORARY_PORTFOLIO,
        payload: { data: 'new portfolio', isDisabled: true, isTemporary: true }
      },
      expect.objectContaining({ type: `${ADD_PORTFOLIO}_PENDING` }),
      expect.objectContaining({ type: `${FETCH_PORTFOLIOS}_PENDING` }),
      expect.objectContaining({ type: `${FETCH_PORTFOLIOS}_FULFILLED` }),
      expect.objectContaining({ type: ADD_NOTIFICATION, payload: expect.objectContaining({ variant: 'success' }) }),
      expect.objectContaining({ type: `${ADD_PORTFOLIO}_FULFILLED` })
    ];

    return store.dispatch(addPortfolio({ data: 'new portfolio' }))
    .then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should create error action creators when adding portfolio failed', () => {
    const store = mockStore({});
    mockApi.onGet(`${CATALOG_API_BASE}/portfolios?filter[name][contains_i]=&limit=50&offset=0`).replyOnce(200, [{ data: [], meta: {}}]);
    mockApi.onPost(CATALOG_API_BASE + '/portfolios').replyOnce(500);

    const expectedActions = [
      {
        type: ADD_TEMPORARY_PORTFOLIO,
        payload: { data: 'new portfolio', isDisabled: true, isTemporary: true }
      },
      expect.objectContaining({ type: `${ADD_PORTFOLIO}_PENDING` }),
      { type: RESTORE_PORTFOLIO_PREV_STATE },
      expect.objectContaining({ type: ADD_NOTIFICATION, payload: expect.objectContaining({ variant: 'danger' }) }),
      expect.objectContaining({ type: `${ADD_PORTFOLIO}_REJECTED` })
    ];

    return store.dispatch(addPortfolio({ data: 'new portfolio' }))
    .catch(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should create correct action creators when updating portfolio', () => {
    const store = mockStore({ openApiReducer: openApiReducerMock });
    mockApi.onGet(`${CATALOG_API_BASE}/portfolios?filter[name][contains_i]=&limit=50&offset=0`).replyOnce(200, { data: [], meta: {}});
    mockApi.onPatch(CATALOG_API_BASE + '/portfolios/123').replyOnce(200, { data: [], meta: {}});

    const expectedActions = [
      { type: UPDATE_TEMPORARY_PORTFOLIO, payload: { data: { foo: 'bar' }, id: '123' }},
      expect.objectContaining({ type: `${FETCH_PORTFOLIOS}_PENDING` }),
      expect.objectContaining({ type: `${FETCH_PORTFOLIOS}_FULFILLED` }),
      expect.objectContaining({ type: ADD_NOTIFICATION, payload: expect.objectContaining({ variant: 'success' }) })
    ];

    return store.dispatch(updatePortfolio({ id: '123', data: { foo: 'bar' }}))
    .then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should create correct action creators when updating portfolio failed', () => {
    const store = mockStore({});
    mockApi.onPatch(CATALOG_API_BASE + '/portfolios/123').replyOnce(500);

    const expectedActions = [
      expect.objectContaining({ type: `${UPDATE_PORTFOLIO}_PENDING` }),
      expect.objectContaining({ type: ADD_NOTIFICATION, payload: expect.objectContaining({ variant: 'danger' }) }),
      expect.objectContaining({ type: `${UPDATE_PORTFOLIO}_REJECTED` })
    ];

    return store.dispatch(updatePortfolio({ id: 123, data: { foo: 'bar' }}))
    .catch(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should create correct action creators when removing portfolio', () => {
    const store = mockStore({});
    mockApi.onGet(`${CATALOG_API_BASE}/portfolios?filter[name][contains_i]=&limit=50&offset=0`).replyOnce(200, {});
    mockApi.onDelete(CATALOG_API_BASE + '/portfolios/123').replyOnce(200, { data: 'foo' });

    const expectedActions = [
      {
        type: DELETE_TEMPORARY_PORTFOLIO,
        payload: '123'
      },
      expect.objectContaining({ type: `${REMOVE_PORTFOLIO}_PENDING` }),
      expect.objectContaining({ type: `${FETCH_PORTFOLIOS}_PENDING` }),
      expect.objectContaining({ type: `${FETCH_PORTFOLIOS}_FULFILLED` }),
      expect.objectContaining({ type: ADD_NOTIFICATION, payload: expect.objectContaining({ variant: 'success' }) }),
      expect.objectContaining({ type: `${REMOVE_PORTFOLIO}_FULFILLED` })
    ];

    return store.dispatch(removePortfolio('123'))
    .then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should create correct action creators when removing portfolio failed', () => {
    const store = mockStore({});
    mockApi.onGet(`${CATALOG_API_BASE}/portfolios?filter[name][contains_i]=&limit=50&offset=0`).replyOnce(200, [{ data: [], meta: {}}]);
    mockApi.onDelete(CATALOG_API_BASE + '/portfolios/123').replyOnce(500);

    const expectedActions = [
      { type: DELETE_TEMPORARY_PORTFOLIO, payload: '123' },
      expect.objectContaining({ type: `${REMOVE_PORTFOLIO}_PENDING` }),
      { type: RESTORE_PORTFOLIO_PREV_STATE },
      expect.objectContaining({ type: ADD_NOTIFICATION, payload: expect.objectContaining({ variant: 'danger' }) }),
      expect.objectContaining({ type: `${REMOVE_PORTFOLIO}_REJECTED` })
    ];

    return store.dispatch(removePortfolio('123'))
    .catch(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should create correct actions after remove portfolio items action success', () => {
    const store = mockStore({ portfolioReducer: { portfolioItems: { meta: { limit: 0, offset: 0 }}, selectedPortfolio: { id: '123' }}});
    const expectedActions = [{
      type: `${REMOVE_PORTFOLIO_ITEMS}_PENDING`
    }, {
      type: `${FETCH_PORTFOLIO_ITEMS_WITH_PORTFOLIO}_PENDING`
    }, {
      type: `${FETCH_PORTFOLIO_ITEMS_WITH_PORTFOLIO}_FULFILLED`,
      payload: []
    },
    expect.objectContaining({ type: ADD_NOTIFICATION }), {
      type: `${REMOVE_PORTFOLIO_ITEMS}_FULFILLED`
    }];

    mockApi.onDelete(CATALOG_API_BASE + '/portfolio_items/1').replyOnce(200, { restore_key: 'restore-1' });
    mockApi.onDelete(CATALOG_API_BASE + '/portfolio_items/2').replyOnce(200, { restore_key: 'restore-2' });
    mockApi.onDelete(CATALOG_API_BASE + '/portfolio_items/3').replyOnce(200, { restore_key: 'restore-3' });
    mockApi.onGet(`${CATALOG_API_BASE}/portfolios/123/portfolio_items?limit=0&offset=0`).replyOnce(200, []);

    return store.dispatch(removeProductsFromPortfolio([ '1', '2', '3' ], 'Foo portfolio'))
    .then(() => expect(store.getActions()).toEqual(expectedActions));
  });

  it('should create correct actions after remove portfolio items action fals', () => {
    const store = mockStore({ portfolioReducer: { portfolioItems: { meta: {}}, selectedPortfolio: { id: '123' }}});
    const expectedActions = [{
      type: `${REMOVE_PORTFOLIO_ITEMS}_PENDING`
    },
    expect.objectContaining({ type: ADD_NOTIFICATION }),
    expect.objectContaining({ type: `${REMOVE_PORTFOLIO_ITEMS}_REJECTED` }) ];

    mockApi.onDelete(CATALOG_API_BASE + '/portfolio_items/1').replyOnce(500);

    return store.dispatch(removeProductsFromPortfolio([ '1' ], 'Foo portfolio'))
    .then(() => expect(store.getActions()).toEqual(expectedActions));
  });

  it('should create correct actions after restore portfolio items action succes', () => {
    const store = mockStore({});
    const restoreData = [
      { portfolioItemId: '1', restoreKey: 'restore-1'  },
      { portfolioItemId: '2', restoreKey: 'restore-2'  }
    ];
    const expectedActions = [{
      type: `${RESTORE_PORTFOLIO_ITEMS}_PENDING`
    }, {
      type: `${RESTORE_PORTFOLIO_ITEMS}_FULFILLED`
    },
    expect.objectContaining({ type: CLEAR_NOTIFICATIONS }), {
      type: `${FETCH_PORTFOLIO_ITEMS_WITH_PORTFOLIO}_PENDING`
    }, {
      type: `${FETCH_PORTFOLIO_ITEMS_WITH_PORTFOLIO}_FULFILLED`,
      payload: { data: []}
    }, expect.objectContaining({ type: ADD_NOTIFICATION }) ];

    mockApi.onPost(CATALOG_API_BASE + '/portfolio_items/1/undelete').replyOnce(200, { id: '1' });
    mockApi.onPost(CATALOG_API_BASE + '/portfolio_items/2/undelete').replyOnce(200, { id: '2' });
    mockApi.onGet(CATALOG_API_BASE + '/portfolios/123/portfolio_items').replyOnce(200, { data: []});

    return store.dispatch(undoRemoveProductsFromPortfolio(restoreData, '123'))
    .then(() => expect(store.getActions()).toEqual(expectedActions));
  });

  it('should create correct actions after restore portfolio items action fails', () => {
    const store = mockStore({});
    const restoreData = [{ portfolioItemId: '1', restoreKey: 'restore-1'  }];
    const expectedActions = [{
      type: `${RESTORE_PORTFOLIO_ITEMS}_PENDING`
    },
    expect.objectContaining({ type: ADD_NOTIFICATION }),
    expect.objectContaining({ type: `${RESTORE_PORTFOLIO_ITEMS}_REJECTED` }) ];

    mockApi.onPost(CATALOG_API_BASE + '/portfolio_items/1/undelete').replyOnce(500);

    return store.dispatch(undoRemoveProductsFromPortfolio(restoreData, '123'))
    .then(() => expect(store.getActions()).toEqual(expectedActions));
  });

  it('should call correct action creator for reset selected portfolio', () => {
    const store = mockStore({});
    store.dispatch({ type: RESET_SELECTED_PORTFOLIO });
    expect(store.getActions()).toEqual([{ type: RESET_SELECTED_PORTFOLIO }]);
  });
});
