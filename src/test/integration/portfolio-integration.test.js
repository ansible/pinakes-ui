import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';

import { testStore } from '../../utilities/store';
import { Provider } from 'react-redux';
import { mockApi } from '../../helpers/shared/__mocks__/user-login';
import {
  CATALOG_API_BASE,
  SOURCES_API_BASE,
  RBAC_API_BASE
} from '../../utilities/constants';
import { MemoryRouter } from 'react-router-dom';
import App from '../../App';
import ContentGalleryEmptyState from '../../presentational-components/shared/content-gallery-empty-state';
import Portfolios from '../../smart-components/portfolio/portfolios';
import toJson from 'enzyme-to-json';
import AddPortfolioModal from '../../smart-components/portfolio/add-portfolio-modal';

import * as PortfolioHelper from '../../helpers/portfolio/portfolio-helper';
import { StyledGalleryItem } from '../../presentational-components/styled-components/styled-gallery';
import Portfolio from '../../smart-components/portfolio/portfolio';
import PortfolioEmptyState from '../../smart-components/portfolio/portfolio-empty-state';
import RemovePortfolioModal from '../../smart-components/portfolio/remove-portfolio-modal';

describe('Integration test for portfolio entity', () => {
  jest.useFakeTimers();
  afterEach(() => {
    //mockApi.restore();
  });

  it('should create, edit, copy, delete and undo delete of portfolio in app', async () => {
    const initialPortfolio = {
      id: '123',
      name: 'New portfolio',
      created_at: new Date().toString(),
      metadata: {
        user_capabilities: {
          create: true,
          copy: true,
          show: true,
          update: true,
          destroy: true,
          share: true,
          unshare: true
        }
      }
    };
    mockApi.onGet(`${RBAC_API_BASE}/groups/`).replyOnce(200, {
      data: [
        {
          uuid: 'existing-share-id',
          name: 'Existing share'
        },
        {
          uuid: 'new-share-id',
          name: 'New share'
        }
      ]
    });
    jest
      .spyOn(PortfolioHelper, 'fetchPortfolioByName')
      .mockImplementation(() => new Promise((res) => res({ data: [] })));
    jest.spyOn(global.insights.chrome, 'getUserPermissions').mockImplementation(
      () =>
        new Promise((res) =>
          res([
            {
              permission: 'catalog:portfolios:create'
            }
          ])
        )
    );
    let wrapper;
    /**
     * Mock initial open API request and souce types request
     */
    mockApi.onGet(`${CATALOG_API_BASE}/openapi.json`).replyOnce(200, {
      components: { schemas: {} }
    });
    mockApi
      .onGet(`${SOURCES_API_BASE}/source_types`)
      .replyOnce(200, { data: [] });
    mockApi
      .onGet(
        `${CATALOG_API_BASE}/workflows?filter[name][contains]=&filter[id][]=111`
      )
      .replyOnce(200, { data: [] });

    /**
     * Mock initial portfolios request after user lands on portfolios page
     * Response is empty
     */
    mockApi
      .onGet(
        `${CATALOG_API_BASE}/portfolios?filter[name][contains_i]=&limit=50&offset=0`
      )
      .replyOnce(200, {
        data: [],
        meta: { count: 0, limit: 50, offset: 0 }
      });
    const store = testStore();
    await act(async () => {
      wrapper = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/']}>
            <App />
          </MemoryRouter>
        </Provider>
      );
    });
    /**
     * One update to wait for chuk load
     */
    await act(async () => {
      wrapper.update();
    });
    /**
     * One update to update the component state
     */
    await act(async () => {
      wrapper.update();
    });
    expect(wrapper.find(Portfolios)).toHaveLength(1);
    expect(wrapper.find(ContentGalleryEmptyState)).toHaveLength(1);
    expect(wrapper.find('a#create-portfolio')).toHaveLength(1);
    /**
     * Click on create portfolio link
     * Modal with create portfolio form should appear
     */
    await act(async () => {
      wrapper.find('a#create-portfolio').simulate('click', { button: 0 });
    });
    /**
     * load chunks
     */
    await act(async () => {
      jest.runAllTimers();
      wrapper.update();
    });
    expect(
      wrapper.find(MemoryRouter).instance().history.location.pathname
    ).toEqual('/portfolios/add-portfolio');
    expect(wrapper.find(AddPortfolioModal)).toHaveLength(1);
    /**
     * change the portfolio name, wait for name async validation and submit the form
     */
    const addPortfolioNameInput = wrapper.find('input#name');
    /**
     * Mock portfolio async name validation
     */
    mockApi
      .onGet(
        `${CATALOG_API_BASE}/portfolios?filter[name][contains_i]=&limit=50&offset=0`
      )
      .replyOnce(200, {
        data: [initialPortfolio],
        meta: {
          limit: 50,
          offset: 0,
          count: 1
        }
      });
    /**
     * Mock portfolio endpoint call
     */
    mockApi
      .onGet(`${CATALOG_API_BASE}/portfolios/${initialPortfolio.id}`)
      .replyOnce(200, initialPortfolio);

    addPortfolioNameInput.getDOMNode().value = initialPortfolio.name;
    await act(async () => {
      addPortfolioNameInput.simulate('change');
    });
    jest.runAllTimers();
    /**
     * mock create portfolio endpoint
     */
    mockApi.onPost(`${CATALOG_API_BASE}/portfolios`).replyOnce(() => {
      return [200, initialPortfolio];
    });
    await act(async () => {
      wrapper.find('form').simulate('submit');
    });
    wrapper.update();
    await act(async () => {
      wrapper.update();
    });

    mockApi
      .onGet(
        `${CATALOG_API_BASE}/portfolios/${initialPortfolio.id}/portfolio_items?filter[name][contains_i]=&limit=50&offset=0`
      )
      .replyOnce(200, { data: [], meta: { limit: 50, offset: 0, count: 0 } });

    /**
     * async data loading update
     */
    await act(async () => {
      wrapper.update();
    });

    /**
     * The app should now be displaying the Portfolio component
     * It should have no portfolio items
     */
    expect(
      wrapper.find(MemoryRouter).instance().history.location.pathname
    ).toEqual('/portfolio');
    expect(
      wrapper.find(MemoryRouter).instance().history.location.search
    ).toEqual('?portfolio=123');
    /**
     * async data loading update
     */
    await act(async () => {
      wrapper.update();
    });
    /**
     * JS chunk loading
     */
    wrapper.update();
    expect(wrapper.find(Portfolio)).toHaveLength(1);
    expect(wrapper.find(PortfolioEmptyState)).toHaveLength(1);
    /**
     * open the edit modal and change the portfolio description
     */
    wrapper.find('button#toggle-portfolio-actions').simulate('click');
    wrapper
      .find('li#edit-portfolio')
      .find('a')
      .simulate('click', { button: 0 });
    expect(
      wrapper.find(MemoryRouter).instance().history.location.pathname
    ).toEqual('/portfolio/edit-portfolio');

    initialPortfolio.description = 'edited portfolio description' // eslint-disable-line
    wrapper.update();
    /**
     * Mock patch endpoint
     */
    mockApi
      .onPatch(`${CATALOG_API_BASE}/portfolios/123`)
      .replyOnce(200, initialPortfolio);
    const editPortfolioDescriptionInput = wrapper.find('textarea#description');
    editPortfolioDescriptionInput.getDOMNode().value =
      'edited portfolio description';
    await act(async () => {
      editPortfolioDescriptionInput.simulate('change');
    });
    jest.runAllTimers();
    /**
     * Mock new portfolios request
     */
    mockApi
      .onGet(
        `${CATALOG_API_BASE}/portfolios?filter[name][contains_i]=&limit=50&offset=0`
      )
      .replyOnce(200, {
        data: [initialPortfolio],
        meta: {
          limit: 50,
          offset: 0,
          count: 1
        }
      });
    mockApi
      .onGet(`${CATALOG_API_BASE}/portfolios/${initialPortfolio.id}`)
      .replyOnce(200, initialPortfolio);
    await act(async () => {
      wrapper.find('form').simulate('submit');
    });

    /**
     * portfolio should have updated description in toolbar
     */
    expect(
      wrapper.find(MemoryRouter).instance().history.location.pathname
    ).toEqual('/portfolio');
    /**
     * After portfolio update
     */
    wrapper.update();
    expect(
      toJson(wrapper.find('p.top-toolbar-title-description'))
    ).toMatchSnapshot();

    /**
     * Portfolio should be copied and app should be redirected to new portfolio
     */
    const copiedPortfolio = {
      ...initialPortfolio,
      id: '1234',
      name: `Copy of ${initialPortfolio.name}`
    };
    wrapper.find('button#toggle-portfolio-actions').simulate('click');
    /**
     * Mock copy portfolio requests
     */
    mockApi
      .onGet(
        `${CATALOG_API_BASE}/portfolios?filter[name][contains_i]=&limit=50&offset=0`
      )
      .replyOnce(200, {
        data: [initialPortfolio, copiedPortfolio],
        meta: { count: 2, limit: 50, offset: 0 }
      });
    mockApi
      .onPost(`${CATALOG_API_BASE}/portfolios/123/copy`)
      .replyOnce(200, copiedPortfolio);
    await act(async () => {
      wrapper.find('li#copy-portfolio').simulate('click');
    });
    expect(
      wrapper.find(MemoryRouter).instance().history.location.pathname
    ).toEqual('/portfolio');
    expect(
      wrapper.find(MemoryRouter).instance().history.location.search
    ).toEqual('?portfolio=1234');

    /**
     * Navigate back to portfolios list via breadcrumbs
     * There should be two portfolios now
     */
    mockApi
      .onGet(
        `${CATALOG_API_BASE}/portfolios?filter[name][contains_i]=&limit=50&offset=0`
      )
      .replyOnce(200, {
        data: [initialPortfolio, copiedPortfolio],
        meta: { count: 2, limit: 50, offset: 0 }
      });
    await act(async () => {
      wrapper.find('a.pf-c-breadcrumb__item').simulate('click', { button: 0 });
    });
    /**
     * loader update
     */
    wrapper.update();
    expect(wrapper.find(StyledGalleryItem)).toHaveLength(2);
    /**
     * delete the first portfolio
     */
    wrapper
      .find(`div#portfolio-${initialPortfolio.id}-dropdown button`)
      .simulate('click');
    await act(async () => {
      wrapper
        .find('li#remove-portfolio-action a')
        .simulate('click', { button: 0 });
    });

    /**
     * load chunks
     */
    await act(async () => {
      jest.runAllTimers();
      wrapper.update();
    });

    expect(
      wrapper.find(MemoryRouter).instance().history.location.pathname
    ).toEqual('/portfolios/remove');
    expect(
      wrapper.find(MemoryRouter).instance().history.location.search
    ).toEqual('?portfolio=123');

    expect(wrapper.find(RemovePortfolioModal)).toHaveLength(1);
    /**
     * Mock delete api requests
     */
    mockApi
      .onDelete(`${CATALOG_API_BASE}/portfolios/${initialPortfolio.id}`)
      .replyOnce(200);
    mockApi
      .onGet(
        `${CATALOG_API_BASE}/portfolios?filter[name][contains_i]=&limit=50&offset=0`
      )
      .replyOnce(200, {
        data: [copiedPortfolio],
        meta: { count: 1, limit: 50, offset: 0 }
      });
    await act(async () => {
      wrapper.find('button#confirm-delete-portfolio').simulate('click');
    });
    wrapper.update();
    expect(wrapper.find(StyledGalleryItem)).toHaveLength(2);
    /**
     * Undo delete of portfolio
     */
    expect(wrapper.find('a#undo-delete-portfolio-123')).toHaveLength(1);
    /**
     * Mock undo delete endpoints
     */
    mockApi
      .onPost(`${CATALOG_API_BASE}/portfolios/${initialPortfolio.id}/undelete`)
      .replyOnce(200, initialPortfolio);
    mockApi
      .onGet(
        `${CATALOG_API_BASE}/portfolios?filter[name][contains_i]=&limit=50&offset=0`
      )
      .replyOnce(200, {
        data: [initialPortfolio, copiedPortfolio],
        meta: { count: 2, limit: 50, offset: 0 }
      });
    await act(async () => {
      wrapper.find('a#undo-delete-portfolio-123').simulate('click');
    });
    expect(wrapper.find(StyledGalleryItem)).toHaveLength(2);
  });
});
