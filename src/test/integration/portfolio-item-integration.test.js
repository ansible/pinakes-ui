jest.requireActual('react-intl');
import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';

import { testStore } from '../../utilities/store';
import { Provider } from 'react-redux';
import {
  mockApi,
  mockGraphql
} from '../../helpers/shared/__mocks__/user-login';
import { MemoryRouter } from 'react-router-dom';
import App from '../../App';
import {
  CATALOG_API_BASE,
  SOURCES_API_BASE,
  CATALOG_INVENTORY_API_BASE
} from '../../utilities/constants';
import Portfolio from '../../smart-components/portfolio/portfolio';
import PortfolioItems from '../../smart-components/portfolio/portfolio-items';
import PortfolioEmptyState from '../../smart-components/portfolio/portfolio-empty-state';
import PlatformItem from '../../presentational-components/platform/platform-item';
import PortfolioItem from '../../smart-components/portfolio/portfolio-item';
import { IntlProvider } from 'react-intl';

describe('Integration tests for portfolio items', () => {
  const commonSourcesResponse = {
    data: {
      application_types: [
        {
          sources: [
            {
              id: 'source-id',
              name: 'Test source',
              availability_status: 'available'
            }
          ]
        }
      ]
    }
  };
  jest.useFakeTimers();
  it('should load add, edit, copy, remove and undo portfolio item in portfolios', async () => {
    let wrapper;
    const initialPortfolio = {
      id: '123',
      name: 'Portfolio',
      created_at: new Date().toString(),
      metadata: {
        user_capabilities: {
          copy: true,
          show: true,
          update: true,
          destroy: true,
          share: true,
          unshare: true
        },
        statistics: {}
      }
    };
    const addedPortfolioItem = {
      id: 'source-offering-1',
      name: 'NodeJS',
      created_at: new Date().toString(),
      service_offering_source_ref: 'source-id',
      metadata: {
        user_capabilities: {
          update: true,
          destroy: true,
          copy: true
        }
      }
    };
    const copiedPortfolioItem = {
      ...addedPortfolioItem,
      id: '1234',
      name: `Compy of ${addedPortfolioItem.name}`
    };
    const store = testStore();
    /**
     * mock initial app setup requests
     */
    jest.spyOn(global.insights.chrome, 'getUserPermissions').mockImplementation(
      () =>
        new Promise((res) =>
          res([
            {
              permission: 'catalog:portfolios:create'
            },
            {
              permission: 'catalog:portfolio_items:create'
            }
          ])
        )
    );
    mockApi.onGet(`${CATALOG_API_BASE}/openapi.json`).replyOnce(200, {
      components: { schemas: {} }
    });
    mockApi
      .onGet(`${SOURCES_API_BASE}/source_types`)
      .replyOnce(200, { data: [] });
    mockApi
      .onGet(`${CATALOG_API_BASE}/portfolios/123`)
      .reply(200, initialPortfolio);
    mockApi
      .onGet(
        `${CATALOG_API_BASE}/portfolios/123/portfolio_items?limit=50&offset=0`
      )
      .replyOnce(200, {
        data: [],
        meta: {
          limit: 50,
          offset: 0,
          count: 0
        }
      });
    await act(async () => {
      wrapper = mount(
        <Provider store={store}>
          <IntlProvider locale="en">
            <MemoryRouter initialEntries={['/portfolio?portfolio=123']}>
              <App />
            </MemoryRouter>
          </IntlProvider>
        </Provider>
      );
    });
    jest.runAllTimers();
    await act(async () => {
      wrapper.update();
    });
    wrapper.update();
    /**
     * Should show empty portfolio with no items
     */
    expect(wrapper.find(Portfolio)).toHaveLength(1);
    expect(wrapper.find(PortfolioItems)).toHaveLength(1);
    expect(wrapper.find(PortfolioEmptyState)).toHaveLength(1);
    /**
     * navigate to add products page
     */
    mockApi
      .onGet(
        `${CATALOG_INVENTORY_API_BASE}/sources?limit=1&filter[id][]=source-id`
      )
      .replyOnce(200, {
        data: [
          {
            id: 'source-id',
            name: 'Source_1',
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

    mockGraphql
      .onPost(`${SOURCES_API_BASE}/graphql`)
      .replyOnce(200, commonSourcesResponse);
    await act(async () => {
      wrapper.find('a#add-products-button').simulate('click', { button: 0 });
    });
    await act(async () => {
      wrapper.update();
    });
    expect(
      wrapper.find(MemoryRouter).instance().history.location.pathname
    ).toEqual('/portfolio/add-products');

    /**
     * select platform and fetch source offerings
     */
    mockApi
      .onGet(
        `${CATALOG_INVENTORY_API_BASE}/sources/source-id/service_offerings?filter[archived_at][nil]&limit=50&offset=0`
      )
      .replyOnce(200, {
        data: [
          {
            id: 'source-offering-1',
            name: 'NodeJS'
          },
          {
            id: 'source-offering-2',
            name: 'MongoDB'
          }
        ],
        meta: {
          count: 2,
          limit: 50,
          offset: 0
        }
      });
    wrapper
      .find('.pf-c-select__toggle')
      .simulate('keyDown', { key: 'ArrowDown', keyCode: 40 });
    wrapper.update();
    expect(wrapper.find('button.pf-c-select__menu-item')).toHaveLength(1);
    await act(async () => {
      wrapper.find('button.pf-c-select__menu-item').simulate('click');
    });
    wrapper.update();
    /**
     * should render two source offerings
     */
    expect(wrapper.find(PlatformItem)).toHaveLength(2);
    /**
     * pick the first (nodeJS) and add it to portfolio
     */
    wrapper
      .find('input[type="checkbox"]')
      .first()
      .simulate('change', { target: { checked: true } });

    /**
     * mock add portfolio items endpoint
     */
    mockApi
      .onPost(`${CATALOG_API_BASE}/portfolio_items`)
      .replyOnce(200, { data: [] });
    mockApi
      .onGet(
        `${CATALOG_API_BASE}/portfolios/123/portfolio_items?filter[name][contains_i]=&limit=50&offset=0`
      )
      .replyOnce(200, {
        data: [addedPortfolioItem],
        meta: {
          count: 1,
          limit: 50,
          offset: 0
        }
      });
    await act(async () => {
      wrapper.find('button#add-products-to-portfolio').simulate('click');
    });
    wrapper.update();
    /**
     * User should be back on the portfolio screen and there should be one portfolio item
     */
    expect(
      wrapper.find(MemoryRouter).instance().history.location.pathname
    ).toEqual('/portfolio');

    expect(wrapper.find(PortfolioItem)).toHaveLength(1);
    /**
     * Select portfolio, remove it and call undo
     */
    wrapper
      .find('input[type="checkbox"]')
      .simulate('change', { target: { checked: true } });
    /**
     * mock delete endpoint
     */
    mockApi
      .onDelete(`${CATALOG_API_BASE}/portfolio_items/source-offering-1`)
      .replyOnce(200, {
        restore_key: 'restore-key'
      });
    mockApi
      .onGet(
        `${CATALOG_API_BASE}/portfolios/123/portfolio_items?filter[name][contains_i]=&limit=50&offset=0`
      )
      .replyOnce(200, {
        data: [],
        meta: {
          count: 0,
          limit: 50,
          offset: 0
        }
      });
    await act(async () => {
      wrapper.find('button#remove-products-button').simulate('click');
    });
    await act(async () => {
      wrapper.update();
    });
    wrapper.update();
    expect(wrapper.find(PortfolioItem)).toHaveLength(0);
    /**
     * mock udelete endpoints
     */
    mockApi
      .onPost(`${CATALOG_API_BASE}/portfolio_items/source-offering-1/undelete`)
      .replyOnce(200, {});
    mockApi
      .onGet(
        `${CATALOG_API_BASE}/portfolios/123/portfolio_items?filter[name][contains_i]=&limit=50&offset=0`
      )
      .replyOnce(200, {
        data: [addedPortfolioItem],
        meta: {
          count: 1,
          limit: 50,
          offset: 0
        }
      });
    await act(async () => {
      wrapper.find(`a#restore-portfolio-item-123`).simulate('click');
    });
    wrapper.update();
    expect(wrapper.find(PortfolioItem)).toHaveLength(1);
    /**
     * navigate to portfolio item detail and edit name
     */
    mockApi
      .onGet(`${CATALOG_API_BASE}/portfolio_items/source-offering-1`)
      .replyOnce(200, addedPortfolioItem);
    mockApi
      .onGet(
        `${CATALOG_INVENTORY_API_BASE}/sources/${addedPortfolioItem.service_offering_source_ref}`
      )
      .replyOnce(
        200,
        commonSourcesResponse.data.application_types[0].sources[0]
      );
    await act(async () => {
      wrapper
        .find(PortfolioItem)
        .find('a')
        .simulate('click', { button: 0 });
    });
    wrapper.update();
    expect(
      wrapper.find(MemoryRouter).instance().history.location.pathname
    ).toEqual('/portfolio/portfolio-item');
    expect(
      wrapper.find(MemoryRouter).instance().history.location.search
    ).toEqual(
      '?portfolio=123&source=source-id&portfolio-item=source-offering-1'
    );
    wrapper.find('button#portfolio-item-actions-toggle').simulate('click');
    /**
     * redirect to edit portfolio item and change its description
     */
    wrapper
      .find('li#edit-portfolio-item')
      .find('a')
      .simulate('click', { button: 0 });
    expect(
      wrapper.find(MemoryRouter).instance().history.location.pathname
    ).toEqual('/portfolio/portfolio-item/edit');
    const descriptionInput = wrapper.find('input#description');
    descriptionInput.getDOMNode().value = 'new description';
    descriptionInput.simulate('change');
    /**
     * mock patch request
     */
    addedPortfolioItem.description = 'new description';
    mockApi
      .onPatch(`${CATALOG_API_BASE}/portfolio_items/source-offering-1`)
      .replyOnce(200, addedPortfolioItem);
    await act(async () => {
      wrapper.find('form').simulate('submit');
    });
    expect(
      wrapper.find(MemoryRouter).instance().history.location.pathname
    ).toEqual('/portfolio/portfolio-item');
    wrapper.update();
    expect(wrapper.find('p#description')).toHaveLength(1);
    expect(
      wrapper
        .find('p#description')
        .children()
        .html()
    ).toEqual(addedPortfolioItem.description);
    /**
     * should copy portfolio item to the same portfolio
     */
    wrapper.find('button#portfolio-item-actions-toggle').simulate('click');
    mockApi
      .onGet(
        `${CATALOG_API_BASE}/portfolio_items/source-offering-1/next_name?destination_portfolio_id=123`
      )
      .reply(200, { next_name: `Copy of ${addedPortfolioItem.name}` });
    mockApi
      .onGet(`${CATALOG_API_BASE}/portfolios?limit=100&offset=0`)
      .reply(200, {
        data: [initialPortfolio],
        meta: {
          count: 0,
          limit: 50,
          offset: 0
        }
      });
    await act(async () => {
      wrapper
        .find('li#copy-portfolio-item')
        .find('a')
        .simulate('click', { button: 0 });
    });
    jest.runAllTimers();
    await act(async () => {
      wrapper.update();
    });
    wrapper.update();
    /**
     * copy to same portfolio which is already selected
     */
    mockApi
      .onGet(`${CATALOG_API_BASE}/portfolios/${initialPortfolio.id}`)
      .replyOnce(200, initialPortfolio);
    mockApi
      .onPost(`${CATALOG_API_BASE}/portfolio_items/source-offering-1/copy`)
      .replyOnce(200, copiedPortfolioItem);
    mockApi
      .onGet(
        `${CATALOG_API_BASE}/portfolios/123/portfolio_items?filter[name][contains_i]=&limit=50&offset=0`
      )
      .replyOnce(200, {
        data: [addedPortfolioItem, copiedPortfolioItem],
        meta: { count: 2, limit: 50, offset: 0 }
      });
    await act(async () => {
      wrapper.find('form').simulate('submit');
    });
    expect(
      wrapper.find(MemoryRouter).instance().history.location.pathname
    ).toEqual('/portfolio/portfolio-item');
    expect(
      wrapper.find(MemoryRouter).instance().history.location.search
    ).toEqual('?portfolio=123&portfolio-item=1234&source=source-id');
  });
});
