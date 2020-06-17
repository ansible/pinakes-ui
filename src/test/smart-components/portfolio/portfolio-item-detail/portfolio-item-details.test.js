import React from 'react';
import thunk from 'redux-thunk';
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { shallowToJson } from 'enzyme-to-json';
import { MemoryRouter, Route } from 'react-router-dom';
import promiseMiddleware from 'redux-promise-middleware';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications/';

import OrderModal from '../../../../smart-components/common/order-modal';
import { ProductLoaderPlaceholder } from '../../../../presentational-components/shared/loader-placeholders';
import ItemDetailInfoBar from '../../../../smart-components/portfolio/portfolio-item-detail/item-detail-info-bar';
import PortfolioItemDetail from '../../../../smart-components/portfolio/portfolio-item-detail/portfolio-item-detail';
import {
  CATALOG_API_BASE,
  SOURCES_API_BASE
} from '../../../../utilities/constants';
import ItemDetailDescription from '../../../../smart-components/portfolio/portfolio-item-detail/item-detail-description';
import { PortfolioItemDetailToolbar } from '../../../../smart-components/portfolio/portfolio-item-detail/portfolio-item-detail-toolbar';
import { Alert } from '@patternfly/react-core';
import UserContext from '../../../../user-context';
import { mockApi } from '../../../../helpers/shared/__mocks__/user-login';
import DialogRoutes from '../../../../smart-components/dialog-routes';

describe('<PortfolioItemDetail />', () => {
  let initialProps;
  let initialState;
  const middlewares = [thunk, promiseMiddleware, notificationsMiddleware()];
  let mockStore;

  const ComponentWrapper = ({
    store,
    children,
    initialEntries,
    initialIndex
  }) => (
    <UserContext.Provider value={{ permissions: [] }}>
      <Provider store={store}>
        <MemoryRouter
          initialEntries={initialEntries}
          initialIndex={initialIndex}
        >
          {children}
          <DialogRoutes />
        </MemoryRouter>
      </Provider>
      .
    </UserContext.Provider>
  );

  beforeEach(() => {
    initialProps = {};
    initialState = {
      breadcrumbsReducer: { fragments: [] },
      platformReducer: {
        platforms: [],
        platformIconMapping: {}
      },
      portfolioReducer: {
        selectedPortfolio: {
          id: '333',
          name: 'Portfolio name'
        },
        portfolioItem: {
          portfolioItem: {
            id: '123',
            service_offering_source_ref: '111',
            created_at: '123',
            name: 'bar',
            metadata: {
              user_capabilities: {
                copy: true,
                update: true,
                destroy: true
              }
            }
          },
          source: { id: '111', name: 'Source name' }
        }
      },
      orderReducer: {
        servicePlans: [{ create_json_schema: { schema: { fields: [] } } }]
      }
    };
    mockStore = configureStore(middlewares);
  });

  it('should render correctly', () => {
    const wrapper = shallow(
      <ComponentWrapper store={mockStore({})}>
        <PortfolioItemDetail {...initialProps} />
      </ComponentWrapper>
    );
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('should mount correct component before and after load', async (done) => {
    const store = mockStore(initialState);
    mockApi.onGet(`${CATALOG_API_BASE}/portfolios/123`).replyOnce(200, {});
    mockApi.onGet(`${CATALOG_API_BASE}/portfolio_items/321`).replyOnce(200, {});
    mockApi.onGet(`${SOURCES_API_BASE}/sources/source-id`).replyOnce(200, {});
    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper
          initialEntries={[
            '/portfolio/portfolio-item?source=source-id&portfolio=123&portfolio-item=321'
          ]}
          store={store}
        >
          <PortfolioItemDetail {...initialProps} />
        </ComponentWrapper>
      );
      expect(wrapper.find(ProductLoaderPlaceholder)).toHaveLength(1);
    });
    wrapper.update();
    expect(wrapper.find(ItemDetailInfoBar)).toHaveLength(1);
    expect(wrapper.find(ItemDetailDescription)).toHaveLength(1);
    expect(wrapper.find(PortfolioItemDetailToolbar)).toHaveLength(1);
    done();
  });

  it('should mount and open order modal', async (done) => {
    const store = mockStore(initialState);
    mockApi
      .onGet(`${CATALOG_API_BASE}/portfolio_items/321/service_plans`)
      .replyOnce(200, {});

    let wrapper;

    await act(async () => {
      wrapper = mount(
        <ComponentWrapper
          store={store}
          initialEntries={[
            '/portfolio/portfolio-item/order?source=source-id&portfolio=123&portfolio-item=321'
          ]}
          initialIndex={0}
        >
          <Route path="/portfolio/portfolio-item">
            <PortfolioItemDetail {...initialProps} />
          </Route>
        </ComponentWrapper>
      );
    });
    await act(async () => {
      wrapper.update();
    });
    expect(wrapper.find(OrderModal)).toHaveLength(1);
    done();
  });

  it('should mount with missing source', async (done) => {
    const store = mockStore({
      ...initialState,
      portfolioReducer: {
        ...initialState.portfolioReducer,
        portfolioItem: {
          ...initialState.portfolioReducer.portfolioItem,
          source: {
            notFound: true,
            object: 'source'
          }
        }
      }
    });
    mockApi.onGet(`${CATALOG_API_BASE}/portfolios/123`).replyOnce(200, {});
    mockApi.onGet(`${CATALOG_API_BASE}/portfolio_items/321`).replyOnce(200, {});
    mockApi.onGet(`${SOURCES_API_BASE}/sources/source-id`).replyOnce(200, {});
    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper
          initialEntries={[
            '/portfolio/portfolio-item?source=source-id&portfolio=123&portfolio-item=321'
          ]}
          store={store}
        >
          <PortfolioItemDetail {...initialProps} />
        </ComponentWrapper>
      );
    });
    wrapper.update();
    expect(wrapper.find(Alert)).toHaveLength(1);
    done();
  });
});
