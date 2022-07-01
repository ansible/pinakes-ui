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
import Portfolios from '../../smart-components/portfolio/portfolios';

import { StyledGalleryItem } from '../../presentational-components/styled-components/styled-gallery';
import EditApprovalWorkflow from '../../smart-components/common/edit-approval-workflow';
import { IntlProvider } from 'react-intl';

describe('Portfolio share and workflow setting integration', () => {
  jest.useFakeTimers();
  it('should set/remove workflow to portfolio and share/unshare it', async (done) => {
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
          tags: true
        },
        statistics: {}
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
      .onGet(`${CATALOG_API_BASE}/portfolios?limit=50&offset=0`)
      .reply(200, {
        data: [initialPortfolio],
        meta: { count: 1, limit: 50, offset: 0 }
      });
    const store = testStore();
    await act(async () => {
      wrapper = mount(
        <Provider store={store}>
          <IntlProvider locale="en">
            <MemoryRouter initialEntries={['/']}>
              <App />
            </MemoryRouter>
          </IntlProvider>
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
    mockApi
      .onGet(
        `${APPROVAL_API_BASE}/workflows?filter[name][contains]=Workflow 1&`
      )
      .reply(200, {
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
    mockApi
      .onGet(
        `${APPROVAL_API_BASE}/workflows?filter[name][contains]=Workflow 2&`
      )
      .reply(200, {
        data: [
          {
            id: '2',
            name: 'Workflow 2'
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
     * open the select and choose forst option Workflow 1
     * wait for async data-pre fetch
     */
    await act(async () => {
      wrapper.update();
      jest.runAllTimers();
    });
    /**
     * wait for debounced data fetch options to finish
     */
    await act(async () => {
      wrapper.update();
      jest.runAllTimers();
    });
    wrapper
      .find('.pf-c-select__toggle')
      .simulate('keyDown', { key: 'ArrowDown', keyCode: 40 });
    wrapper.update();
    expect(wrapper.find('button.pf-c-select__menu-item')).toHaveLength(2);

    wrapper
      .find('button.pf-c-select__menu-item')
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
    await act(async () => {
      wrapper.update();
      jest.runAllTimers();
    });

    wrapper
      .find('.pf-c-select__toggle')
      .simulate('keyDown', { key: 'ArrowDown', keyCode: 40 });
    await act(async () => {
      wrapper.update();
    });
    expect(wrapper.find('button.pf-c-select__menu-item')).toHaveLength(2);

    wrapper.update();
    wrapper
      .find('button.pf-c-select__menu-item')
      .first()
      .simulate('click');

    wrapper
      .find('button.pf-c-select__menu-item')
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

    /**
     * Lazy laod chunks
     */
    await act(async () => {
      jest.runAllTimers();
      wrapper.update();
    });
    /**
     * clear the existing share and select the new share
     */
    await act(async () => {
      wrapper.update();
      jest.runAllTimers();
    });
    const clearButton = wrapper.find('button#remove-share-0');
    clearButton.simulate('click');
    wrapper.update();
    wrapper
      .find('.pf-c-select__toggle')
      .first()
      .simulate('keyDown', { key: 'ArrowDown', keyCode: 40 });

    expect(wrapper.find('button.pf-c-select__menu-item')).toHaveLength(2);

    wrapper.update();
    wrapper
      .find('button.pf-c-select__menu-item')
      .last()
      .simulate('click');

    wrapper
      .find('.pf-c-select__toggle')
      .at(1)
      .simulate('keyDown', { key: 'ArrowDown', keyCode: 40 });
    wrapper
      .find('button.pf-c-select__menu-item')
      .last()
      .simulate('click');

    wrapper.find('button#add-new-group').simulate('click');
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
});
