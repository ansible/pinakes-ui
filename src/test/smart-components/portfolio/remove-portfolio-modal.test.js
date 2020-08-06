import React from 'react';
import { act } from 'react-dom/test-utils';
import thunk from 'redux-thunk';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MemoryRouter, Route } from 'react-router-dom';
import promiseMiddleware from 'redux-promise-middleware';
import {
  notificationsMiddleware,
  ADD_NOTIFICATION,
  CLEAR_NOTIFICATIONS
} from '@redhat-cloud-services/frontend-components-notifications/';

import RemovePortfolioModal from '../../../smart-components/portfolio/remove-portfolio-modal';
import { CATALOG_API_BASE } from '../../../utilities/constants';
import {
  REMOVE_PORTFOLIO,
  FETCH_PORTFOLIOS,
  DELETE_TEMPORARY_PORTFOLIO
} from '../../../redux/action-types';
import { mockApi } from '../../../helpers/shared/__mocks__/user-login';
import { useIntl, IntlProvider } from 'react-intl';

describe('<RemovePortfolioModal />', () => {
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
    initialProps = {
      id: '123'
    };
    initialState = {
      i18nReducer: {
        ...useIntl()
      },
      portfolioReducer: {
        portfolios: {
          meta: {
            limit: 50,
            offset: 0
          },
          data: [
            {
              id: '123',
              name: 'Foo',
              metadata: {
                user_capabilities: {
                  destroy: true
                },
                statistics: {}
              }
            }
          ]
        }
      }
    };
    mockStore = configureStore(middlewares);
  });

  it('should call cancel action', () => {
    const store = mockStore(initialState);
    const wrapper = mount(
      <ComponentWrapper
        store={store}
        initialEntries={[
          '/portfolio?portfolio=123',
          '/portfolio/remove-portfolio?portfolio=123'
        ]}
        initialIndex={1}
      >
        <Route
          path="/portfolio"
          render={(args) => (
            <RemovePortfolioModal {...args} {...initialProps} />
          )}
        />
      </ComponentWrapper>
    );
    wrapper
      .find('button')
      .first()
      .simulate('click');
    expect(
      wrapper
        .find(MemoryRouter)
        .children()
        .props().history.location.pathname
    ).toEqual('/portfolio');
  });

  it('should call remove action', async (done) => {
    expect.assertions(3);
    const store = mockStore(initialState);

    mockApi.onDelete(`${CATALOG_API_BASE}/portfolios/123`).replyOnce((req) => {
      expect(req).toBeTruthy();
      return [200];
    });

    mockApi
      .onGet(`${CATALOG_API_BASE}/portfolios?limit=50&offset=0`)
      .replyOnce((req) => {
        expect(req).toBeTruthy();
        return [200, { data: [] }];
      });

    const wrapper = mount(
      <ComponentWrapper
        store={store}
        initialEntries={['/portfolio/remove-portfolio?portfolio=123']}
      >
        <Route
          path="/portfolio/remove-portfolio"
          render={(args) => (
            <RemovePortfolioModal {...args} {...initialProps} />
          )}
        />
      </ComponentWrapper>
    );
    const expectedActions = [
      {
        type: DELETE_TEMPORARY_PORTFOLIO,
        payload: '123'
      },
      {
        type: `${REMOVE_PORTFOLIO}_PENDING`
      },
      expect.objectContaining({
        type: ADD_NOTIFICATION,
        payload: expect.objectContaining({ variant: 'success' })
      }),
      expect.objectContaining({
        type: `${FETCH_PORTFOLIOS}_PENDING`
      }),
      expect.objectContaining({
        type: `${FETCH_PORTFOLIOS}_FULFILLED`,
        payload: { data: [] }
      }),
      expect.objectContaining({
        type: `${REMOVE_PORTFOLIO}_FULFILLED`
      })
    ];

    await act(async () => {
      wrapper
        .find('button')
        .at(1)
        .simulate('click');
    });
    expect(store.getActions()).toEqual(expectedActions);
    done();
  });

  it('should call remove portfolio actions and then undo it', async (done) => {
    expect.assertions(4);
    const store = mockStore(initialState);

    mockApi.onDelete(`${CATALOG_API_BASE}/portfolios/123`).replyOnce((req) => {
      expect(req).toBeTruthy();
      return [200];
    });

    mockApi
      .onGet(`${CATALOG_API_BASE}/portfolios?limit=50&offset=0`)
      .reply((req) => {
        expect(req).toBeTruthy();
        return [200, { data: [] }];
      });

    mockApi
      .onPost(`${CATALOG_API_BASE}/portfolios/123/undelete`)
      .replyOnce(200, { id: '123', name: 'Yay' });
    const wrapper = mount(
      <ComponentWrapper
        store={store}
        initialEntries={['/portfolio/remove-portfolio?portfolio=123']}
      >
        <Route
          path="/portfolio/remove-portfolio"
          render={(args) => (
            <RemovePortfolioModal {...args} {...initialProps} />
          )}
        />
      </ComponentWrapper>
    );

    await act(async () => {
      wrapper
        .find('button')
        .at(1)
        .simulate('click');
    });
    const notification = mount(
      <IntlProvider locale="en">
        {store.getActions()[2].payload.description}
      </IntlProvider>
    );
    store.clearActions();
    await act(async () => {
      notification.find('a').simulate('click');
    });
    const expectedActions = [
      {
        type: CLEAR_NOTIFICATIONS
      },
      {
        type: ADD_NOTIFICATION,
        payload: {
          dismissable: true,
          variant: 'success',
          title: 'Portfolio Yay has been restored'
        }
      },
      expect.objectContaining({
        type: `${FETCH_PORTFOLIOS}_PENDING`
      }),
      expect.objectContaining({
        type: `${FETCH_PORTFOLIOS}_FULFILLED`
      })
    ];
    expect(store.getActions()).toEqual(expectedActions);
    done();
  });

  it('should redirect away from remove modal if destroy capability is set to false', () => {
    const store = mockStore({
      ...initialState,
      portfolioReducer: {
        ...initialState.portfolioReducer,
        portfolios: {
          meta: {
            limit: 50,
            offset: 0
          },
          data: [
            {
              id: '123',
              name: 'Foo',
              metadata: {
                user_capabilities: {
                  destroy: false
                },
                statistics: {}
              }
            }
          ]
        }
      }
    });
    const wrapper = mount(
      <ComponentWrapper
        store={store}
        initialEntries={[
          '/portfolio?portfolio=123',
          '/portfolio/remove-portfolio?portfolio=123'
        ]}
        initialIndex={1}
      >
        <Route
          path="/portfolio"
          render={(args) => (
            <RemovePortfolioModal {...args} {...initialProps} />
          )}
        />
      </ComponentWrapper>
    );
    expect(
      wrapper
        .find(MemoryRouter)
        .children()
        .props().history.location.pathname
    ).toEqual('/403');
  });
});
