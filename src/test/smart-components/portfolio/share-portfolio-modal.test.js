import React from 'react';
import { act } from 'react-dom/test-utils';
import thunk from 'redux-thunk';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MemoryRouter, Route } from 'react-router-dom';
import promiseMiddleware from 'redux-promise-middleware';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications/';

import { CATALOG_API_BASE, RBAC_API_BASE } from '../../../utilities/constants';
import SharePortfolioModal from '../../../smart-components/portfolio/share-portfolio-modal';
import { mockApi } from '../../../helpers/shared/__mocks__/user-login';

describe('<SharePortfolioModal/>', () => {
  let initialProps;
  let initialState;
  const middlewares = [thunk, promiseMiddleware, notificationsMiddleware()];
  let mockStore;

  const ComponentWrapper = ({ store, children, initialEntries }) => (
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    </Provider>
  );

  afterEach(() => {
    mockApi.restore();
    mockApi.resetHandlers();
  });

  beforeEach(() => {
    initialProps = {
      addNotification: jest.fn(),
      closeUrl: '/foo'
    };
    initialState = {
      portfolioReducer: {
        selectedPortfolio: {
          id: '2',
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

  it('should submit share data', async (done) => {
    jest.useFakeTimers();
    expect.assertions(1);
    const store = mockStore(initialState);

    /**
     * download data endpoints
     */
    mockApi
      .onGet(`${CATALOG_API_BASE}/portfolios/2/share_info`)
      .replyOnce(200, {
        data: []
      });
    mockApi.onGet(`${RBAC_API_BASE}/groups/`).replyOnce(200, {
      data: [{ uuid: '123', name: 'Group 123' }]
    });

    /**
     * submit data endpoints
     */
    mockApi
      .onPost(`${CATALOG_API_BASE}/portfolios/2/share`)
      .replyOnce((req) => {
        expect(JSON.parse(req.data)).toEqual({
          permissions: ['all'],
          group_uuids: ['123']
        });
        return [200, {}];
      });
    mockApi.onGet(`${RBAC_API_BASE}/groups/`).replyOnce(200, { data: [] });
    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper
          store={store}
          initialEntries={['/portfolio/share-portfolio?portfolio=2']}
        >
          <Route exact path="/portfolio/share-portfolio">
            <SharePortfolioModal {...initialProps} />
          </Route>
        </ComponentWrapper>
      );
    });

    await act(async () => {
      jest.runAllTimers();
      wrapper.update();
    });

    await act(async () => {
      jest.runAllTimers();
      wrapper.update();
    });

    wrapper
      .find('.pf-c-select__toggle')
      .first()
      .simulate('keyDown', { key: 'ArrowDown', keyCode: 40 });
    let option = wrapper.find('button.pf-c-select__menu-item').first();
    await act(async () => {
      option.simulate('click');
    });
    wrapper
      .find('.pf-c-select__toggle')
      .at(1)
      .simulate('keyDown', { key: 'ArrowDown', keyCode: 40 });
    wrapper.update();
    option = wrapper.find('button.pf-c-select__menu-item').first();
    await act(async () => {
      option.simulate('click');
    });

    wrapper.update();

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
      .onGet(`${CATALOG_API_BASE}/portfolios/3/share_info`)
      .replyOnce(200, { data: [] });
    mockApi.onGet(`${RBAC_API_BASE}/groups/`).replyOnce(200, { data: [] });

    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper
          store={store}
          initialEntries={['/portfolio/share-portfolio?portfolio=3']}
        >
          <Route
            path="/portfolio/share-portfolio"
            render={(args) => (
              <SharePortfolioModal {...args} {...initialProps} />
            )}
          />
        </ComponentWrapper>
      );
    });

    await act(async () => {
      wrapper.update();
    });
    expect(
      wrapper.find(MemoryRouter).instance().history.location.pathname
    ).toEqual('/403');
    done();
  });
});
