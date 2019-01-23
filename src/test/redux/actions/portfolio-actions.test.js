import configureStore from 'redux-mock-store' ;
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import { FETCH_PORTFOLIOS } from '../../../redux/ActionTypes';
import { fetchPortfolios, fetchSelectedPortfolio } from '../../../redux/Actions/PortfolioActions';

describe('Portfolio actions', () => {
  const middlewares = [ thunk, promiseMiddleware() ];
  let mockStore;

  beforeEach(() => {
    mockStore = configureStore(middlewares);
  });

  it('should dispatch correct actions after fetching portfolios', () => {
    const store = mockStore({
      platformReducer: {
        isPlatformDataLoading: false
      },
      portfolioReducer: {
        isLoading: false
      }
    });

    const expectedActions = [{
      type: `${FETCH_PORTFOLIOS}_PENDING`
    }, {
      type: `${FETCH_PORTFOLIOS}_FULFILLED`,
      payload: [{ id: '1', name: 'foo' }]
    }];

    apiClientMock.get('https://localhost:5000/api/v0.0/portfolios', mockOnce({
      body: [{
        id: '1',
        name: 'foo'
      }]
    }));

    return store.dispatch(fetchPortfolios())
    .then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
