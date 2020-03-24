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
import { mockApi } from '../../../__mocks__/user-login';
import { Alert } from '@patternfly/react-core';

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
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries} initialIndex={initialIndex}>
        {children}
      </MemoryRouter>
    </Provider>
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
          source: { id: '111', name: 'Source name' },
          portfolio: {
            name: 'Portfolio name'
          }
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

    mockApi.onGet(`${CATALOG_API_BASE}/portfolios/123`).replyOnce(200, {});
    mockApi.onGet(`${CATALOG_API_BASE}/portfolio_items/321`).replyOnce(200, {});
    mockApi
      .onGet(`${CATALOG_API_BASE}/portfolio_items/123/service_plans`)
      .replyOnce(200, {});
    mockApi
      .onGet(
        `${CATALOG_API_BASE}/portfolio_items/321/provider_control_parameters`
      )
      .replyOnce(200, {
        properties: { namespace: { enum: [] } }
      }),
      mockApi.onGet(`${SOURCES_API_BASE}/sources/source-id`).replyOnce(200, {});

    let wrapper;

    await act(async () => {
      wrapper = mount(
        <ComponentWrapper
          store={store}
          initialEntries={[
            '/portfolio/portfolio-item?source=source-id&portfolio=123&portfolio-item=321',
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
    wrapper.update();
    wrapper
      .find(MemoryRouter)
      .instance()
      .history.push(
        '/portfolio/portfolio-item/order?source=source-id&portfolio=123&portfolio-item=321'
      );
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
            notFound: true
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
