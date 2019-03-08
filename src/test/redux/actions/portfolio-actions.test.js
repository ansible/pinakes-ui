import configureStore from 'redux-mock-store' ;
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import { Portfolio } from '@manageiq/service-portal-api';
import { notificationsMiddleware, ADD_NOTIFICATION } from '@red-hat-insights/insights-frontend-components/components/Notifications';
import {
  FETCH_PORTFOLIOS,
  FETCH_PORTFOLIO_ITEMS,
  FETCH_PORTFOLIO_ITEMS_WITH_PORTFOLIO,
  ADD_PORTFOLIO,
  UPDATE_PORTFOLIO,
  REMOVE_PORTFOLIO
} from '../../../redux/ActionTypes';
import {
  fetchPortfolios,
  fetchPortfolioItems,
  fetchPortfolioItemsWithPortfolio,
  addPortfolio,
  updatePortfolio,
  removePortfolio
} from '../../../redux/Actions/PortfolioActions';
import {
  CATALOG_API_BASE
} from '../../../Utilities/Constants';

describe('Portfolio actions', () => {
  const middlewares = [ thunk, promiseMiddleware(), notificationsMiddleware() ];
  let mockStore;

  beforeEach(() => {
    mockStore = configureStore(middlewares);
  });

  afterEach(() => {
    fetchMock.reset();
  });

  it('should dispatch correct actions after fetching portfolios', () => {
    const store = mockStore({
      portfolioReducer: {
        isLoading: false
      }
    });
    const expectedPortfolio = new Portfolio('Name', 'Description');

    const expectedActions = [{
      type: `${FETCH_PORTFOLIOS}_PENDING`
    }, {
      type: `${FETCH_PORTFOLIOS}_FULFILLED`,
      payload: [ expectedPortfolio ]
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
});
