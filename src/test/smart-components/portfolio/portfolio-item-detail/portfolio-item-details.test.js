import React from 'react';
import thunk from 'redux-thunk';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store' ;
import { shallowToJson } from 'enzyme-to-json';
import { MemoryRouter, Route } from 'react-router-dom';
import promiseMiddleware from 'redux-promise-middleware';
import { notificationsMiddleware } from '@red-hat-insights/insights-frontend-components/components/Notifications';

import { ProductLoaderPlaceholder } from '../../../../PresentationalComponents/Shared/LoaderPlaceholders';
import PortfolioItemDetail from '../../../../SmartComponents/Portfolio/portfolio-item-detail/portfolio-item-detail';
import { APPROVAL_API_BASE, TOPOLOGICAL_INVENTORY_API_BASE, CATALOG_API_BASE } from '../../../../Utilities/Constants';
import PortfolioItemDetailToolbar from '../../../../SmartComponents/Portfolio/portfolio-item-detail/portfolio-item-detail-toolbar';
import ItemDetailInfoBar from '../../../../SmartComponents/Portfolio/portfolio-item-detail/item-detail-info-bar';
import ItemDetailDescription from '../../../../SmartComponents/Portfolio/portfolio-item-detail/item-detail-description';

describe('<PortfolioItemDetail />', () => {
  let initialProps;
  let initialState;
  const middlewares = [ thunk, promiseMiddleware(), notificationsMiddleware() ];
  let mockStore;

  const ComponentWrapper = ({ store, children, initialEntries }) => (
    <Provider store={ store }>
      <MemoryRouter initialEntries={ initialEntries }>
        { children }
      </MemoryRouter>
    </Provider>
  );

  beforeEach(() => {
    initialProps = {};
    initialState = {
      approvalReducer: {
        workflows: [{
          label: 'foo',
          value: 'bar'
        }],
        isFetching: false
      },
      portfolioReducer: {
        portfolioItem: {
          id: '123',
          service_offering_source_ref: '123',
          created_at: '123',
          name: 'bar'
        }
      },
      platformReducer: {
        platforms: [{
          id: '123',
          name: 'source'
        }]
      }
    };
    mockStore = configureStore(middlewares);
  });

  afterEach(() => {
    fetchMock.reset();
  });

  it('should render correctly', () => {
    const wrapper = shallow(<PortfolioItemDetail { ...initialProps } />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it.skip('should mount show loader', done => {
    const store = mockStore(initialState);
    fetchMock.getOnce(`${APPROVAL_API_BASE}/workflows`, { data: []});
    fetchMock.getOnce(`begin:${CATALOG_API_BASE}/portfolio_items`, { name: 'foo', id: 'bar' });
    apiClientMock.get(`${TOPOLOGICAL_INVENTORY_API_BASE}/sources`, mockOnce({ body: { data: []}}));
    const wrapper = mount(
      <ComponentWrapper store={ store }>
        <PortfolioItemDetail { ...initialProps } />
      </ComponentWrapper>
    );
    setImmediate(() => {
      expect(wrapper.find(ProductLoaderPlaceholder)).toHaveLength(1);
      done();
    });
  });

  it('should mount load data and render correct components', done => {
    let loadedState = {
      ...initialState,
      portfolioReducer: {
        ...initialState.portfolioReducer,
        selectedPortfolio: {
          name: 'foo',
          id: '321'
        }
      }
    };
    const store = mockStore(loadedState);
    fetchMock.getOnce(`${APPROVAL_API_BASE}/workflows`, { data: []});
    fetchMock.getOnce(`${CATALOG_API_BASE}/portfolio_items/123`, { name: 'foo', id: 'bar' });
    apiClientMock.get(`${TOPOLOGICAL_INVENTORY_API_BASE}/sources`, mockOnce({ body: { data: []}}));

    const wrapper = mount(
      <ComponentWrapper store={ store } initialEntries={ [ '/foo/123' ] }>
        <Route path="/foo/:portfolioItemId" render={ (...args) => <PortfolioItemDetail { ...initialProps } { ...args } /> } />
      </ComponentWrapper>
    );
    setImmediate(() => {
      expect(wrapper.find(ItemDetailInfoBar)).toHaveLength(1);
      expect(wrapper.find(ItemDetailDescription)).toHaveLength(1);
      expect(wrapper.find(PortfolioItemDetailToolbar)).toHaveLength(1);
      done();
    });
  });
});
