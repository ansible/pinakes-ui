import React from 'react';
import { act } from 'react-dom/test-utils';
import thunk from 'redux-thunk';
import { InternalSelect } from '@data-driven-forms/pf4-component-mapper/dist/cjs/select';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';
import notificationsMiddleware from '@redhat-cloud-services/frontend-components-notifications/notificationsMiddleware';

import {
  CATALOG_INVENTORY_API_BASE,
  CATALOG_API_BASE,
  SOURCES_API_BASE
} from '../../../../utilities/constants';
import PlatformItem from '../../../../presentational-components/platform/platform-item';
import AddProductsToPortfolio from '../../../../smart-components/portfolio/add-products-to-portfolio';
import {
  mockApi,
  mockGraphql
} from '../../../../helpers/shared/__mocks__/user-login';
import {
  FETCH_PLATFORMS,
  FETCH_PLATFORM_ITEMS
} from '../../../../redux/action-types';

describe('<AddProductsToPortfolio />', () => {
  let initialProps;
  const middlewares = [thunk, promiseMiddleware, notificationsMiddleware()];
  let mockStore;
  mockStore = configureStore(middlewares);
  let ComponentWrapper = ({ store, children }) => (
    <Provider store={store}>
      <MemoryRouter>{children}</MemoryRouter>
    </Provider>
  );

  beforeEach(() => {
    initialProps = {
      portfolioRoute: '/portfolio/foo',
      portfolio: {
        id: '321',
        name: 'Foo'
      }
    };
  });

  afterEach(() => {
    mockGraphql.reset();
    mockApi.reset();
  });

  it('should correctly filter service offerings', async (done) => {
    jest.useFakeTimers();
    const store = mockStore({
      breadcrumbsReducer: { fragments: [] },
      portfolioReducer: {
        selectedPortfolio: {
          id: '321',
          name: 'Foo'
        }
      },
      platformReducer: {
        platforms: [{ id: '1', name: 'foo' }],
        platformItems: {
          1: {
            data: [
              { id: '123', name: 'platformItem', description: 'description' }
            ]
          }
        }
      }
    });
    mockApi
      .onGet(`${CATALOG_INVENTORY_API_BASE}/sources?limit=1&filter[id][]=1`)
      .replyOnce(200, {
        data: [
          {
            id: '1',
            name: 'Source 1',
            availability_status: 'available',
            enabled: true
          }
        ],
        meta: {
          count: 1,
          limit: 50,
          offset: 0
        }
      });

    mockGraphql.onPost(`${SOURCES_API_BASE}/graphql`).replyOnce(200, {
      data: {
        application_types: [{ sources: [{ id: '1', name: 'Source 1' }] }]
      }
    });
    mockApi
      .onGet(
        `${CATALOG_INVENTORY_API_BASE}/sources/1/service_offerings?filter[archived_at][nil]&limit=50&offset=0`
      )
      .replyOnce(200, {
        data: [],
        meta: { count: 123, limit: 50, offset: 123 }
      });
    mockApi
      .onGet(
        `${CATALOG_INVENTORY_API_BASE}/sources/1/service_offerings?filter[archived_at][nil]&filter[name][contains_i]=foo&limit=undefined&offset=0`
      )
      .replyOnce(200, { data: [] });

    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={store}>
          <AddProductsToPortfolio {...initialProps} />
        </ComponentWrapper>
      );
    });
    const expectedActions = [
      {
        type: `${FETCH_PLATFORMS}_PENDING`
      },
      {
        payload: [
          {
            id: '1',
            name: 'Source 1',
            availability_status: 'available',
            enabled: true
          }
        ],
        type: `${FETCH_PLATFORMS}_FULFILLED`
      },
      expect.objectContaining({
        type: `${FETCH_PLATFORM_ITEMS}_PENDING`
      }),
      expect.objectContaining({
        payload: {
          data: [],
          meta: expect.any(Object)
        },
        type: `${FETCH_PLATFORM_ITEMS}_FULFILLED`
      })
    ];

    wrapper
      .find('.pf-c-select__toggle')
      .first()
      .simulate('keyDown', { key: 'ArrowDown', keyCode: 40 });
    await act(async () => {
      wrapper
        .find('button.pf-c-select__menu-item')
        .first()
        .simulate('click');
    });
    wrapper.update();

    expect(wrapper.find(PlatformItem)).toHaveLength(1);
    const searchInput = wrapper.find('input').at(0);
    await act(async () => {
      searchInput.getDOMNode().value = 'foo';
      searchInput.simulate('change');
      jest.runAllTimers();
    });
    wrapper.update();
    expect(store.getActions()).toEqual(expectedActions);
    done();
  });

  it('should check item and send correct data on submit', async (done) => {
    expect.assertions(1);
    const store = mockStore({
      breadcrumbsReducer: { fragments: [] },
      portfolioReducer: {
        selectedPortfolio: {
          id: '321',
          name: 'Foo'
        }
      },
      platformReducer: {
        platforms: [{ id: '1', name: 'Source 1' }],
        platformItems: {
          1: {
            data: [
              { id: '123', name: 'platformItem', description: 'description' }
            ]
          }
        }
      }
    });

    mockApi
      .onGet(`${CATALOG_INVENTORY_API_BASE}/sources?limit=1&filter[id][]=1`)
      .replyOnce(200, {
        data: [
          {
            id: '1',
            name: 'Source 1',
            availability_status: 'available',
            enabled: true
          }
        ],
        meta: {
          count: 1,
          limit: 50,
          offset: 0
        }
      });

    mockGraphql.onPost(`${SOURCES_API_BASE}/graphql`).replyOnce(200, {
      data: {
        application_types: [{ sources: [{ id: '1', name: 'Source 1' }] }]
      }
    });
    mockApi
      .onGet(`${CATALOG_API_BASE}/portfolios/321/portfolio_items`)
      .replyOnce(200, { data: [], meta: {} });

    mockApi
      .onGet(
        `${CATALOG_INVENTORY_API_BASE}/sources/1/service_offerings?filter[archived_at][nil]&limit=50&offset=0`
      )
      .replyOnce(200, {
        data: [],
        meta: { count: 123, limit: 50, offset: 123 }
      });
    mockApi.onPost(`${CATALOG_API_BASE}/portfolio_items`).replyOnce(200, {
      created_at: '2019-11-25T16:08:44Z',
      id: '999',
      name: 'My first workflow',
      owner: 'lgalis@redhat.com',
      portfolio_id: '321',
      service_offering_source_ref: '352',
      service_offering_type: 'workflow_job_template',
      updated_at: '2019-11-25T16:08:44Z'
    });
    mockApi.onPost(`${CATALOG_API_BASE}/portfolio_items`).replyOnce((req) => {
      expect(JSON.parse(req.data)).toEqual({ portfolio_item_id: '999' });
      done();
      return [200, {}];
    });

    let wrapper;

    await act(async () => {
      wrapper = mount(
        <ComponentWrapper
          store={store}
          initialEntries={['/portfolio?portfolio=123']}
        >
          <AddProductsToPortfolio {...initialProps} />
        </ComponentWrapper>
      );
    });

    await act(async () => {
      let select = wrapper.find(InternalSelect).props();
      select.onChange({
        id: '1'
      });
    });

    wrapper.update();
    await act(async () => {
      wrapper
        .find('input')
        .last()
        .simulate('change');
    });

    wrapper.update();
    await act(async () => {
      wrapper
        .find('button')
        .last()
        .simulate('click');
    });
    wrapper.update();
    setImmediate(() => {
      expect(
        wrapper.find(MemoryRouter).instance().history.location.pathname
      ).toEqual('/portfolio/foo');
      done();
    });
  });
});
