import portfolioReducer from '../../../redux/reducers/portfolio-reducer';
import { callReducer } from '../redux-helpers';

import {
  FETCH_PORTFOLIO,
  FETCH_PORTFOLIOS,
  FETCH_PORTFOLIO_ITEMS,
  FETCH_PORTFOLIO_ITEMS_WITH_PORTFOLIO,
  FETCH_PORTFOLIO_ITEM,
  FILTER_PORTFOLIO_ITEMS,
  RESET_SELECTED_PORTFOLIO
} from '../../../redux/action-types';

describe('Portfolio reducer', () => {
  let initialState;
  const reducer = callReducer(portfolioReducer);

  beforeEach(() => {
    initialState = {};
  });

  it('should set loading state', () => {
    const expectedState = { isLoading: true };
    expect(
      reducer(initialState, { type: `${FETCH_PORTFOLIOS}_PENDING` })
    ).toEqual(expectedState);

    expect(
      reducer(initialState, { type: `${FETCH_PORTFOLIO_ITEMS}_PENDING` })
    ).toEqual(expectedState);

    expect(
      reducer(initialState, {
        type: `${FETCH_PORTFOLIO_ITEMS_WITH_PORTFOLIO}_PENDING`
      })
    ).toEqual(expectedState);

    expect(
      reducer(initialState, { type: `${FETCH_PORTFOLIO_ITEM}_PENDING` })
    ).toEqual(expectedState);

    expect(
      reducer(initialState, { type: `${FETCH_PORTFOLIO}_PENDING` })
    ).toEqual(expectedState);
  });

  it('should set portfolios data and set loading state to false', () => {
    const payload = { data: 'Foo' };
    const expectedState = { isLoading: false, portfolios: payload };
    expect(
      reducer(initialState, { type: `${FETCH_PORTFOLIOS}_FULFILLED`, payload })
    ).toEqual(expectedState);
  });

  it('should set portfolio items data and set loading state to false', () => {
    const payload = { data: 'Foo' };
    const expectedState = { isLoading: false, portfolioItems: payload };
    expect(
      reducer(initialState, {
        type: `${FETCH_PORTFOLIO_ITEMS}_FULFILLED`,
        payload
      })
    ).toEqual(expectedState);

    expect(
      reducer(initialState, {
        type: `${FETCH_PORTFOLIO_ITEMS_WITH_PORTFOLIO}_FULFILLED`,
        payload
      })
    ).toEqual(expectedState);
  });

  it('should set portfolio item data and set loading state to false', () => {
    const payload = { data: 'Foo' };
    let expectedState = { isLoading: false, portfolioItems: payload };
    expect(
      reducer(initialState, {
        type: `${FETCH_PORTFOLIO_ITEMS}_FULFILLED`,
        payload
      })
    ).toEqual(expectedState);

    expectedState = { isLoading: false, selectedPortfolio: payload };
    expect(
      reducer(initialState, { type: `${FETCH_PORTFOLIO}_FULFILLED`, payload })
    ).toEqual(expectedState);
  });

  it('should set portfolio filter value', () => {
    const payload = 'Foo';
    let expectedState = { filterValue: payload };
    expect(
      reducer(initialState, { type: FILTER_PORTFOLIO_ITEMS, payload })
    ).toEqual(expectedState);
  });

  it('should reset selected portfolio', () => {
    const payload = { data: 'Foo' };
    let expectedState = {};
    // set portfolio items
    reducer(initialState, {
      type: `${FETCH_PORTFOLIO_ITEMS}_FULFILLED`,
      payload
    });
    expectedState = { isLoading: false, selectedPortfolio: payload };
    // set portfolio
    expect(
      reducer(initialState, { type: `${FETCH_PORTFOLIO}_FULFILLED`, payload })
    ).toEqual(expectedState);
    // reset selected portfolio and portfolio items
    const resetState = {
      selectedPortfolio: undefined,
      portfolioItems: { data: [], meta: { offset: 0, limit: 50 } }
    };
    expect(
      reducer(initialState, { type: RESET_SELECTED_PORTFOLIO, payload })
    ).toEqual(resetState);
  });
});
