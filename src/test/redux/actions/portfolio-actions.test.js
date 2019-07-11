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
  RESTORE_PORTFOLIO_ITEMS
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

describe('Portfolio actions', () => {
  const middlewares = [ thunk, promiseMiddleware(), notificationsMiddleware() ];
  let mockStore;

  beforeEach(() => {
    mockStore = configureStore(middlewares);
  });

  it('should dispatch correct actions after fetching portfolios', () => {
    const store = mockStore({
      portfolioReducer: {
        isLoading: false
      }
    });
    const expectedPortfolio = { name: 'Name', description: 'Description' };

    const expectedActions = [{
      type: `${FETCH_PORTFOLIOS}_PENDING`
    }, {
      type: `${FETCH_PORTFOLIOS}_FULFILLED`,
      payload: { data: [ expectedPortfolio ]}
    }];
    apiClientMock.get(CATALOG_API_BASE + '/portfolios', mockOnce({
      body: { data: [ expectedPortfolio ]}
    }));

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

    apiClientMock.get(CATALOG_API_BASE + '/portfolios', mockOnce({
      status: 500
    }));

    return store.dispatch(fetchPortfolios())
    .catch(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch correct actions after fetchPortfolioItems action was called', () => {
    const store = mockStore({});

    apiClientMock.get(CATALOG_API_BASE + '/portfolio_items', mockOnce({
      body: { data: [ 'foo' ]}
    }));

    const expectedActions = [{
      type: `${FETCH_PORTFOLIO_ITEMS}_PENDING`
    }, {
      type: `${FETCH_PORTFOLIO_ITEMS}_FULFILLED`,
      payload: expect.any(Array)
    }];

    return store.dispatch(fetchPortfolioItems(123))
    .then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch correct actions after fetchPortfolioItemsWithPortfolio action was called', () => {
    const store = mockStore({});

    apiClientMock.get(`${CATALOG_API_BASE}/portfolios/123/portfolio_items`, mockOnce({ body: { data: [ 'foo' ]}}));

    const expectedActions = [{
      type: `${FETCH_PORTFOLIO_ITEMS_WITH_PORTFOLIO}_PENDING`
    }, {
      type: `${FETCH_PORTFOLIO_ITEMS_WITH_PORTFOLIO}_FULFILLED`,
      payload: expect.any(Array)
    }];

    return store.dispatch(fetchPortfolioItemsWithPortfolio(123))
    .then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should create correct action creators when adding portfolio', () => {
    const store = mockStore({});
    apiClientMock.post(CATALOG_API_BASE + '/portfolios', mockOnce({
      body: [{ data: 'foo' }]
    }));

    const expectedActions = [
      expect.objectContaining({ type: `${ADD_PORTFOLIO}_PENDING` }),
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
    apiClientMock.post(CATALOG_API_BASE + '/portfolios', mockOnce({
      status: 500
    }));

    const expectedActions = [
      expect.objectContaining({ type: `${ADD_PORTFOLIO}_PENDING` }),
      expect.objectContaining({ type: ADD_NOTIFICATION, payload: expect.objectContaining({ variant: 'danger' }) }),
      expect.objectContaining({ type: `${ADD_PORTFOLIO}_REJECTED` })
    ];

    return store.dispatch(addPortfolio({ data: 'new portfolio' }))
    .catch(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should create correct action creators when updating portfolio', () => {
    const store = mockStore({});
    apiClientMock.patch(CATALOG_API_BASE + '/portfolios/123', mockOnce({
      body: [{ data: 'foo' }]
    }));

    const expectedActions = [
      expect.objectContaining({ type: `${UPDATE_PORTFOLIO}_PENDING` }),
      expect.objectContaining({ type: ADD_NOTIFICATION, payload: expect.objectContaining({ variant: 'success' }) }),
      expect.objectContaining({ type: `${UPDATE_PORTFOLIO}_FULFILLED` })
    ];

    return store.dispatch(updatePortfolio({ id: 123, data: { foo: 'bar' }}))
    .then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should create correct action creators when updating portfolio failed', () => {
    const store = mockStore({});
    apiClientMock.patch(CATALOG_API_BASE + '/portfolios/123', mockOnce({
      status: 500
    }));

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
    apiClientMock.delete(CATALOG_API_BASE + '/portfolios/123', mockOnce({
      body: [{ data: 'foo' }]
    }));

    const expectedActions = [
      expect.objectContaining({ type: `${REMOVE_PORTFOLIO}_PENDING` }),
      expect.objectContaining({ type: ADD_NOTIFICATION, payload: expect.objectContaining({ variant: 'success' }) }),
      expect.objectContaining({ type: `${REMOVE_PORTFOLIO}_FULFILLED` })
    ];

    return store.dispatch(removePortfolio(123))
    .then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should create correct action creators when removing portfolio faled', () => {
    const store = mockStore({});
    apiClientMock.delete(CATALOG_API_BASE + '/portfolios/123', mockOnce({
      status: 500
    }));

    const expectedActions = [
      expect.objectContaining({ type: `${REMOVE_PORTFOLIO}_PENDING` }),
      expect.objectContaining({ type: ADD_NOTIFICATION, payload: expect.objectContaining({ variant: 'danger' }) }),
      expect.objectContaining({ type: `${REMOVE_PORTFOLIO}_REJECTED` })
    ];

    return store.dispatch(removePortfolio(123))
    .catch(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should create correct actions after remove portfolio items action success', () => {
    const store = mockStore({ portfolioReducer: { selectedPortfolio: { id: '123' }}});
    const expectedActions = [{
      type: `${REMOVE_PORTFOLIO_ITEMS}_PENDING`
    }, {
      type: `${FETCH_PORTFOLIO_ITEMS_WITH_PORTFOLIO}_PENDING`
    }, {
      type: `${FETCH_PORTFOLIO_ITEMS_WITH_PORTFOLIO}_FULFILLED`
    },
    expect.objectContaining({ type: ADD_NOTIFICATION }), {
      type: `${REMOVE_PORTFOLIO_ITEMS}_FULFILLED`
    }];

    apiClientMock.delete(CATALOG_API_BASE + '/portfolio_items/1', mockOnce({ body: { restore_key: 'restore-1' }}));
    apiClientMock.delete(CATALOG_API_BASE + '/portfolio_items/2', mockOnce({ body: { restore_key: 'restore-2' }}));
    apiClientMock.delete(CATALOG_API_BASE + '/portfolio_items/3', mockOnce({ body: { restore_key: 'restore-3' }}));
    apiClientMock.get(`${CATALOG_API_BASE}/portfolios/123/portfolio_items`, mockOnce({ body: []}));

    return store.dispatch(removeProductsFromPortfolio([ '1', '2', '3' ], 'Foo portfolio'))
    .then(() => expect(store.getActions()).toEqual(expectedActions));
  });

  it('should create correct actions after remove portfolio items action fals', () => {
    const store = mockStore({ portfolioReducer: { selectedPortfolio: { id: '123' }}});
    const expectedActions = [{
      type: `${REMOVE_PORTFOLIO_ITEMS}_PENDING`
    },
    expect.objectContaining({ type: ADD_NOTIFICATION }),
    expect.objectContaining({ type: `${REMOVE_PORTFOLIO_ITEMS}_REJECTED` }) ];

    apiClientMock.delete(CATALOG_API_BASE + '/portfolio_items/1', mockOnce({ status: 500 }));

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
      payload: []
    }, expect.objectContaining({ type: ADD_NOTIFICATION }) ];

    apiClientMock.post(CATALOG_API_BASE + '/portfolio_items/1/undelete', mockOnce({ body: { id: '1' }}));
    apiClientMock.post(CATALOG_API_BASE + '/portfolio_items/2/undelete', mockOnce({ body: { id: '2' }}));
    apiClientMock.get(CATALOG_API_BASE + '/portfolios/123/portfolio_items', mockOnce({ body: { data: []}}));

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

    apiClientMock.post(CATALOG_API_BASE + '/portfolio_items/1/undelete', mockOnce({ status: 500 }));

    return store.dispatch(undoRemoveProductsFromPortfolio(restoreData, '123'))
    .then(() => expect(store.getActions()).toEqual(expectedActions));
  });
});
