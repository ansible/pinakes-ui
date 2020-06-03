import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';

import { testStore } from '../../utilities/store';
import { Provider } from 'react-redux';
import { mockApi } from '../../helpers/shared/__mocks__/user-login';
import {
  CATALOG_API_BASE,
  SOURCES_API_BASE,
  APPROVAL_API_BASE,
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
import EditApprovalWorkflow from '../../smart-components/common/edit-approval-workflow';

describe('Integration test for portfolio entity', () => {
  jest.useFakeTimers();
  afterEach(() => {
    //mockApi.restore();
  });
  it('should set/remove workflow to portfolio and share/unshare it', async (done) => {
    expect.assertions(16);
    const initialPortfolio = {
      id: '123',
      name: 'New portfolio',
      created_at: new Date().toString(),
      metadata: {
        user_capabilities: {
          copy: true,
          show: true,
          update: true,
          destroy: true,
          share: true,
          unshare: true,
          set_approval: true
        }
      }
    };
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
    /**
     * Mock initial portfolios request after user lands on portfolios page
     * Response is empty
     */
    mockApi
      .onGet(
        `${CATALOG_API_BASE}/portfolios?filter[name][contains_i]=&limit=50&offset=0`
      )
      .replyOnce(200, {
        data: [initialPortfolio],
        meta: { count: 1, limit: 50, offset: 0 }
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
    expect(wrapper.find(StyledGalleryItem)).toHaveLength(1);

    /**
     * expand the dropdown and click on the set approval option
     */
    wrapper
      .find(`button#portfolio-${initialPortfolio.id}-toggle`)
      .simulate('click');
    /**
     * mock workflows endpoints
     * workflows for the select must be called twice because of the initial values pre-fetch
     */
    mockApi
      .onGet(
        `${APPROVAL_API_BASE}/workflows?app_name=catalog&object_type=Portfolio&object_id=${initialPortfolio.id}&filter[name][contains]=&limit=50&offset=0` // eslint-disable-line max-len
      )
      .replyOnce(200, {
        data: [],
        meta: { limit: 50, offset: 0, count: 0 }
      });
    mockApi
      .onGet(`${APPROVAL_API_BASE}/workflows?filter[name][contains]=&`)
      .reply(200, {
        data: [
          {
            id: '1',
            name: 'Workflow 1'
          },
          {
            id: '2',
            name: 'Workflow 2'
          }
        ],
        meta: {
          count: 2,
          limit: 100,
          offset: 0
        }
      });
    await act(async () => {
      wrapper
        .find('li#workflow-portfolio-action a')
        .simulate('click', { button: 0 });
    });
    jest.runAllTimers();
    await act(async () => {
      wrapper.update();
    });
    expect(
      wrapper.find(MemoryRouter).instance().history.location.pathname
    ).toEqual('/portfolios/edit-workflow');
    expect(wrapper.find(EditApprovalWorkflow)).toHaveLength(1);
    /**
     * open the select and choose forst option Workflow 1
     */
    await act(async () => {
      wrapper.update();
      jest.runAllTimers();
    });
    wrapper
      .find('div.ddorg__pf4-component-mapper__select__control')
      .simulate('keyDown', { key: 'ArrowDown', keyCode: 40 });
    expect(
      wrapper.find('div.ddorg__pf4-component-mapper__select__option')
    ).toHaveLength(2);

    wrapper
      .find('div.ddorg__pf4-component-mapper__select__option')
      .first()
      .simulate('click');

    /**
     * mock workflow link endpoint
     */
    mockApi.onPost(`${APPROVAL_API_BASE}/workflows/1/link`).replyOnce(200);
    await act(async () => {
      wrapper.find('form').simulate('submit');
    });
    wrapper.update();
    expect(
      wrapper.find(MemoryRouter).instance().history.location.pathname
    ).toEqual('/portfolios');
    expect(wrapper.find(EditApprovalWorkflow)).toHaveLength(0);
    /**
     * Open the workflow modal again and unlink the first workflow and link the second
     */

    wrapper
      .find(`button#portfolio-${initialPortfolio.id}-toggle`)
      .simulate('click');

    /**
     * mock workflows endpoints
     * workflows for the select must be called twice because of the initial values pre-fetch
     */
    mockApi
      .onGet(
        `${APPROVAL_API_BASE}/workflows?app_name=catalog&object_type=Portfolio&object_id=${initialPortfolio.id}&filter[name][contains]=&limit=50&offset=0` // eslint-disable-line max-len
      )
      .replyOnce(200, {
        data: [
          {
            id: '1',
            name: 'Workflow 1'
          }
        ],
        meta: { limit: 50, offset: 0, count: 0 }
      });
    mockApi
      .onGet(
        `${APPROVAL_API_BASE}/workflows?filter[name][contains]=&filter[id][]=1`
      )
      .replyOnce(200, {
        data: [
          {
            id: '1',
            name: 'Workflow 1'
          }
        ],
        meta: {
          count: 1,
          limit: 100,
          offset: 0
        }
      });
    await act(async () => {
      wrapper
        .find('li#workflow-portfolio-action a')
        .simulate('click', { button: 0 });
    });
    jest.runAllTimers();
    await act(async () => {
      wrapper.update();
    });
    expect(
      wrapper.find(MemoryRouter).instance().history.location.pathname
    ).toEqual('/portfolios/edit-workflow');
    expect(wrapper.find(EditApprovalWorkflow)).toHaveLength(1);
    /**
     * open the select and de select forst workflow and select the scond
     */
    await act(async () => {
      wrapper.update();
      jest.runAllTimers();
    });
    wrapper
      .find('div.ddorg__pf4-component-mapper__select__control')
      .simulate('keyDown', { key: 'ArrowDown', keyCode: 40 });

    expect(
      wrapper.find('div.ddorg__pf4-component-mapper__select__option')
    ).toHaveLength(2);

    wrapper.update();
    wrapper
      .find('div.ddorg__pf4-component-mapper__select__option')
      .first()
      .simulate('click');

    wrapper
      .find('div.ddorg__pf4-component-mapper__select__option')
      .last()
      .simulate('click');

    /**
     * simulate unlink and link endpoints
     */
    mockApi.onPost(`${APPROVAL_API_BASE}/workflows/1/unlink`).replyOnce(200);
    mockApi.onPost(`${APPROVAL_API_BASE}/workflows/2/link`).replyOnce(200);
    await act(async () => {
      wrapper.find('form').simulate('submit');
    });
    wrapper.update();

    /**
     * remove existing shares in portfolio and add new one
     */

    wrapper
      .find(`button#portfolio-${initialPortfolio.id}-toggle`)
      .simulate('click');

    /**
     * mock share info endpoint
     */
    mockApi
      .onGet(`${CATALOG_API_BASE}/portfolios/${initialPortfolio.id}/share_info`)
      .replyOnce(200, [
        {
          group_name: 'Existing share',
          group_uuid: 'existing-share-id',
          permissions: ['order', 'read']
        }
      ]);
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
    jest.runAllTimers();
    await act(async () => {
      wrapper
        .find('li#share-portfolio-action a')
        .simulate('click', { button: 0 });
    });

    await act(async () => {
      wrapper.update();
      jest.runAllTimers();
    });
    /**
     * cear the existing share and select the new share
     */
    const clearButton = wrapper.find(
      '.ddorg__pf4-component-mapper__select__indicators .pf-c-button.pf-m-plain'
    );
    clearButton.simulate('click');
    clearButton.simulate('mousedown');
    wrapper.update();
    wrapper
      .find('div.ddorg__pf4-component-mapper__select__control')
      .first()
      .simulate('keyDown', { key: 'ArrowDown', keyCode: 40 });

    expect(
      wrapper.find('div.ddorg__pf4-component-mapper__select__option')
    ).toHaveLength(2);

    wrapper.update();
    wrapper
      .find('div.ddorg__pf4-component-mapper__select__option')
      .last()
      .simulate('click');

    wrapper
      .find('div.ddorg__pf4-component-mapper__select__control')
      .at(1)
      .simulate('keyDown', { key: 'ArrowDown', keyCode: 40 });
    wrapper
      .find('div.ddorg__pf4-component-mapper__select__option')
      .last()
      .simulate('click');

    /**
     * mock share/ushare calls
     */
    mockApi
      .onPost(`${CATALOG_API_BASE}/portfolios/${initialPortfolio.id}/share`)
      .replyOnce((req) => {
        expect(JSON.parse(req.data)).toEqual({
          permissions: ['order', 'read'],
          group_uuids: ['new-share-id']
        });
        return [200];
      });
    mockApi
      .onPost(`${CATALOG_API_BASE}/portfolios/${initialPortfolio.id}/unshare`)
      .replyOnce((req) => {
        expect(JSON.parse(req.data)).toEqual({
          permissions: ['order', 'read'],
          group_uuids: ['existing-share-id']
        });
        return [200];
      });
    await act(async () => {
      wrapper.find('form').simulate('submit');
    });
    wrapper.update();
    expect(
      wrapper.find(MemoryRouter).instance().history.location.pathname
    ).toEqual('/portfolios');
    expect(wrapper.find(Portfolios)).toHaveLength(1);
    expect(wrapper.find(StyledGalleryItem)).toHaveLength(1);
    done();
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
    wrapper.find('a#create-portfolio').simulate('click', { button: 0 });
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
    wrapper
      .find('li#remove-portfolio-action a')
      .simulate('click', { button: 0 });

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
