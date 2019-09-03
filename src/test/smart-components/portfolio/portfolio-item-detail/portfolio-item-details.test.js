import React from 'react';
import thunk from 'redux-thunk';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store' ;
import { shallowToJson } from 'enzyme-to-json';
import { MemoryRouter, Route } from 'react-router-dom';
import promiseMiddleware from 'redux-promise-middleware';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications/';

import OrderModal from '../../../../smart-components/common/order-modal';
import { ProductLoaderPlaceholder } from '../../../../presentational-components/shared/loader-placeholders';
import ItemDetailInfoBar from '../../../../smart-components/portfolio/portfolio-item-detail/item-detail-info-bar';
import PortfolioItemDetail from '../../../../smart-components/portfolio/portfolio-item-detail/portfolio-item-detail';
import { APPROVAL_API_BASE, CATALOG_API_BASE, SOURCES_API_BASE } from '../../../../utilities/constants';
import ItemDetailDescription from '../../../../smart-components/portfolio/portfolio-item-detail/item-detail-description';
import PortfolioItemDetailToolbar from '../../../../smart-components/portfolio/portfolio-item-detail/portfolio-item-detail-toolbar';
import dummySchema from '../../order/order-mock-form-schema';

const servicePlansResponse = {
  ...dummySchema,
  type: 'object'
};

describe('<PortfolioItemDetail />', () => {
  let initialProps;
  let initialState;
  const middlewares = [ thunk, promiseMiddleware(), notificationsMiddleware() ];
  let mockStore;

  const ComponentWrapper = ({ store, children, initialEntries, initialIndex }) => (
    <Provider store={ store }>
      <MemoryRouter initialEntries={ initialEntries } initialIndex={ initialIndex }>
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
      },
      orderReducer: {}
    };
    mockStore = configureStore(middlewares);
  });

  it('should render correctly', () => {
    const wrapper = shallow(<PortfolioItemDetail { ...initialProps } />);
    apiClientMock.get(`${CATALOG_API_BASE}/portfolio_items/123/service_plans`, mockOnce({ body: { data: []}}));
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('should mount show loader', done => {
    const store = mockStore(initialState);

    apiClientMock.get(`${APPROVAL_API_BASE}/workflows`, mockOnce({
      body: {
        data: [{
          name: 'workflow',
          id: '123'
        }]
      }
    }));
    apiClientMock.get(new RegExp(`${CATALOG_API_BASE}/portfolio_items/*`), mockOnce({ body: { name: 'foo', id: 'bar' }}));
    apiClientMock.post(`${SOURCES_API_BASE}/graphql`, mockOnce({ body: {
      data: {
        application_types: [{ sources:
          []
        }]
      }
    }}));
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

    apiClientMock.get(`${APPROVAL_API_BASE}/workflows`, mockOnce({
      body: {
        data: [{
          name: 'workflow',
          id: '123'
        }]
      }
    }));
    apiClientMock.get(`${CATALOG_API_BASE}/portfolio_items/123`, mockOnce({ body: { name: 'foo', id: 'bar' }}));
    apiClientMock.post(`${SOURCES_API_BASE}/graphql`, mockOnce({ body: {
      data: {
        application_types: [{ sources:
          []
        }]
      }
    }}));

    const wrapper = mount(
      <ComponentWrapper store={ store } initialEntries={ [ '/foo/123' ] }>
        <Route path="/foo/:portfolioItemId" render={ (args) => <PortfolioItemDetail { ...initialProps } { ...args } /> } />
      </ComponentWrapper>
    );
    setImmediate(() => {
      expect(wrapper.find(ItemDetailInfoBar)).toHaveLength(1);
      expect(wrapper.find(ItemDetailDescription)).toHaveLength(1);
      expect(wrapper.find(PortfolioItemDetailToolbar)).toHaveLength(1);
      done();
    });
  });

  it('should mount and open order modal', done => {
    let loadedState = {
      ...initialState,
      portfolioReducer: {
        ...initialState.portfolioReducer,
        selectedPortfolio: {
          name: 'foo',
          id: '321'
        }
      },
      orderReducer: {
        selectedItem: {},
        isLoading: true,
        sevicePlans: [ servicePlansResponse ]
      }
    };
    const store = mockStore(loadedState);

    apiClientMock.get(`${APPROVAL_API_BASE}/workflows`, mockOnce({ body: { data: [{ name: 'workflow', id: '123' }]}}));
    apiClientMock.get(`${CATALOG_API_BASE}/portfolio_items/123`, mockOnce({ body: { name: 'foo', id: 'bar' }}));
    apiClientMock.get(`${CATALOG_API_BASE}/portfolio_items/123/provider_control_parameters`, mockOnce({
      body: { properties: { namespace: { enum: []}}}
    }));
    apiClientMock.post(`${SOURCES_API_BASE}/graphql`, mockOnce({ body: {
      data: {
        application_types: [{ sources:
          []
        }]
      }
    }}));

    const wrapper = mount(
      <ComponentWrapper store={ store } initialEntries={ [ '/foo/123', '/foo/123/order' ] } initialIndex={ 0 }>
        <Route path="/foo/:portfolioItemId" render={ (args) => <PortfolioItemDetail { ...initialProps } { ...args } /> } />
      </ComponentWrapper>
    );
    setImmediate(() => {
      // navigate to order route
      wrapper.find(MemoryRouter).instance().history.push('/foo/123/order');
      wrapper.update();
      setImmediate(() => {
        expect(wrapper.find(OrderModal)).toHaveLength(1);
        done();
      });
    });
  });
});
