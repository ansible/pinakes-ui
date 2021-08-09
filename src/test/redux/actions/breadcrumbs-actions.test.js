import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { createBreadcrumbsFromLocations } from '../../../redux/actions/breadcrumbs-actions';
import { INITIALIZE_BREADCRUMBS } from '../../../redux/action-types';

describe('breadcrumbs actions', () => {
  const mockStore = configureStore([thunk]);
  const initialState = {
    breadcrumbsReducer: { fragments: [] },
    portfolioReducer: {
      selectedPortfolio: { name: 'Selected portfolio' },
      portfolioItem: { portfolioItem: { name: 'Portfolio item' } }
    },
    platformReducer: {
      selectedPlatform: { name: 'Platform' }
    }
  };
  const portfolioPathname = '/portfolios/portfolio/portfolio-item/edit-survey';
  const portfolioSearchParams = {
    portfolio: 'portfolio-id',
    'portfolio-item': 'portfolio-item-id',
    source: 'source-id'
  };

  it('should create fragments with portfolio prefix', () => {
    const store = mockStore(initialState);
    const expectedActions = [
      {
        type: INITIALIZE_BREADCRUMBS,
        payload: [
          {
            pathname: '/portfolios',
            title: 'Portfolios',
            searchParams: {}
          },
          {
            pathname: '/portfolio',
            title: 'Selected portfolio',
            searchParams: {
              portfolio: 'portfolio-id'
            }
          },
          {
            pathname: '/portfolios/portfolio/portfolio-item',
            title: 'Portfolio item',
            searchParams: {
              portfolio: 'portfolio-id',
              'portfolio-item': 'portfolio-item-id',
              source: 'source-id'
            }
          },
          {
            pathname: '/portfolios/portfolio/portfolio-item/edit-survey',
            title: 'Edit survey',
            searchParams: {
              portfolio: 'portfolio-id',
              'portfolio-item': 'portfolio-item-id',
              source: 'source-id'
            }
          }
        ]
      }
    ];
    store.dispatch(
      createBreadcrumbsFromLocations(portfolioPathname, portfolioSearchParams)
    );
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should generate no fragments', () => {
    const store = mockStore(initialState);
    store.dispatch(createBreadcrumbsFromLocations());
    expect(store.getActions()).toEqual([
      { type: INITIALIZE_BREADCRUMBS, payload: [] }
    ]);
  });

  it('should skip fragment with unknown title', () => {
    const store = mockStore(initialState);
    store.dispatch(
      createBreadcrumbsFromLocations('/portfolios/portfolio/something/unknown', {
        portfolio: 'some-id'
      })
    );
    const expectedActions = [
      {
        type: INITIALIZE_BREADCRUMBS,
        payload: [
          {
            pathname: '/portfolios',
            title: 'Portfolios',
            searchParams: {}
          },
          {
            pathname: '/portfolio',
            title: 'Selected portfolio',
            searchParams: {
              portfolio: 'some-id'
            }
          }
        ]
      }
    ];
    expect(store.getActions()).toEqual(expectedActions);
  });
});
