import React from 'react';
import { act } from 'react-dom/test-utils';
import thunk from 'redux-thunk';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MemoryRouter, Route } from 'react-router-dom';
import promiseMiddleware from 'redux-promise-middleware';
import ReactFormRender from '@data-driven-forms/react-form-renderer';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications/';

import FormRenderer from '../../../smart-components/common/form-renderer';
import { CATALOG_API_BASE, RBAC_API_BASE } from '../../../utilities/constants';
import SharePortfolioModal from '../../../smart-components/portfolio/share-portfolio-modal';
import { mockApi } from '../../../helpers/shared/__mocks__/user-login';

describe('<SharePortfolioModal', () => {
  let initialProps;
  let initialState;
  const middlewares = [thunk, promiseMiddleware, notificationsMiddleware()];
  let mockStore;

  const ComponentWrapper = ({ store, children, initialEntries }) => (
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    </Provider>
  );

  beforeEach(() => {
    initialProps = {
      addNotification: jest.fn(),
      portfolioId: '123',
      closeUrl: '/foo'
    };
    initialState = {
      portfolioReducer: {
        selectedPortfolio: {
          id: '123',
          name: 'Portfolio 1',
          metadata: {
            user_capabilities: {
              share: true,
              unshare: true
            }
          }
        }
      },
      shareReducer: {
        shareInfo: [
          {
            group_name: 'share info 1',
            permissions: ['all', 'nothing']
          }
        ],
        isLoading: false
      },
      rbacReducer: {
        rbacGroups: [
          {
            value: 1,
            label: 'Group 1'
          },
          {
            value: 2,
            label: 'Group 2'
          }
        ]
      }
    };
    mockStore = configureStore(middlewares);
  });

  it('should mount and load data', async (done) => {
    const store = mockStore(initialState);

    mockApi
      .onGet(`${CATALOG_API_BASE}/portfolios/123/share_info`)
      .replyOnce(200, { data: {} });
    mockApi.onGet(`${RBAC_API_BASE}/groups/`).replyOnce(200, { data: [] });

    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={store} initialEntries={['/portfolio/123']}>
          <Route
            path="/portfolio/:id"
            render={(args) => (
              <SharePortfolioModal {...args} {...initialProps} />
            )}
          />
        </ComponentWrapper>
      );
    });

    wrapper.update();
    expect(wrapper.find(SharePortfolioModal)).toHaveLength(1);
    expect(wrapper.find(FormRenderer)).toHaveLength(1);
    done();
  });

  it('should submit share data', async (done) => {
    expect.assertions(3);
    const store = mockStore(initialState);

    /**
     * download data endpoints
     */
    mockApi
      .onGet(`${CATALOG_API_BASE}/portfolios/123/share_info`)
      .replyOnce(200, { data: {} });
    mockApi.onGet(`${RBAC_API_BASE}/groups/`).replyOnce(200, { data: [] });
    mockApi.onGet(`${RBAC_API_BASE}/groups/`).replyOnce(200, { data: [] });

    /**
     * submit data endpoints
     */
    mockApi
      .onPost(`${CATALOG_API_BASE}/portfolios/123/share`)
      .replyOnce((req) => {
        expect(JSON.parse(req.data)).toEqual({
          permissions: ['all'],
          group_uuids: ['123']
        });
        return [200, {}];
      });
    mockApi
      .onPost(`${CATALOG_API_BASE}/portfolios/123/unshare`)
      .replyOnce((req) => {
        expect(JSON.parse(req.data)).toEqual({
          permissions: ['update'],
          group_uuids: [null]
        });
        return [200, {}];
      });
    mockApi
      .onGet(
        `${CATALOG_API_BASE}/portfolios?filter[name][contains_i]=&limit=50&offset=0`
      )
      .replyOnce((req) => {
        expect(req).toBeTruthy();
        return [200, { data: [] }];
      });
    mockApi.onGet(`${RBAC_API_BASE}/groups/`).replyOnce(200, { data: [] });
    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper
          store={store}
          initialEntries={['/portfolio?portfolio=123']}
        >
          <Route
            path="/portfolio"
            render={(args) => (
              <SharePortfolioModal {...args} {...initialProps} />
            )}
          />
        </ComponentWrapper>
      );
    });

    wrapper.update();
    const form = wrapper
      .find(ReactFormRender)
      .children()
      .instance().form;
    /*
     * simulate form changes
     * group_uuid
     * permissions
     */

    form.change('group_uuid', '123');
    form.change('permissions', 'all');
    await act(async () => {
      wrapper.find('form').simulate('submit');
    });
    done();
  });

  it('should redirect from share modal if both share and unshare capabilities are false', async (done) => {
    const store = mockStore({
      ...initialState,

      portfolioReducer: {
        selectedPortfolio: {
          id: '123',
          name: 'Portfolio 1',
          metadata: {
            user_capabilities: {
              share: false,
              unshare: false
            }
          }
        }
      }
    });

    mockApi
      .onGet(`${CATALOG_API_BASE}/portfolios/123/share_info`)
      .replyOnce(200, { data: {} });
    mockApi.onGet(`${RBAC_API_BASE}/groups/`).replyOnce(200, { data: [] });

    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={store} initialEntries={['/portfolio/123']}>
          <Route
            path="/portfolio/:id"
            render={(args) => (
              <SharePortfolioModal {...args} {...initialProps} />
            )}
          />
        </ComponentWrapper>
      );
    });

    wrapper.update();
    expect(
      wrapper.find(MemoryRouter).instance().history.location.pathname
    ).toEqual('/401');
    done();
  });
});
