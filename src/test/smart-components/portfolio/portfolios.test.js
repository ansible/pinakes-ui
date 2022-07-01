import React from 'react';
import { act } from 'react-dom/test-utils';
import thunk from 'redux-thunk';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { shallowToJson } from 'enzyme-to-json';
import { MemoryRouter, Route } from 'react-router-dom';
import promiseMiddleware from 'redux-promise-middleware';
import notificationsMiddleware from '@redhat-cloud-services/frontend-components-notifications/notificationsMiddleware';

import { CATALOG_API_BASE } from '../../../utilities/constants';
import { FETCH_PORTFOLIOS } from '../../../redux/action-types';
import Portfolios from '../../../smart-components/portfolio/portfolios';
import PortfolioCard from '../../../presentational-components/portfolio/portfolio-card';
import { CardLoader } from '../../../presentational-components/shared/loader-placeholders';
import { mockApi } from '../../../helpers/shared/__mocks__/user-login';

import * as PortfolioActions from '../../../redux/actions/portfolio-actions';
import UserContext from '../../../user-context';

describe('<Portfolios />', () => {
  let initialProps;
  let initialState;
  const middlewares = [thunk, promiseMiddleware, notificationsMiddleware()];
  let mockStore;

  const ComponentWrapper = ({
    store,
    initialEntries = ['/foo'],
    permissions = [],
    children
  }) => (
    <Provider store={store}>
      <UserContext.Provider value={{ permissions }}>
        <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
      </UserContext.Provider>
    </Provider>
  );

  beforeEach(() => {
    initialProps = {
      id: '123'
    };
    jest.clearAllMocks();
    initialState = {
      breadcrumbsReducer: { fragments: [] },
      portfolioReducer: {
        portfolios: {
          data: [
            {
              id: '123',
              name: 'bar',
              description: 'description',
              modified: 'sometimes',
              created_at: 'foo',
              owner: 'Owner',
              metadata: {
                user_capabilities: {
                  share: true,
                  unshare: true,
                  update: true,
                  destroy: true
                },
                statistics: {}
              }
            }
          ],
          meta: {
            limit: 50,
            offset: 0
          }
        }
      }
    };
    mockStore = configureStore(middlewares);
  });

  it('should render correctly', () => {
    const store = mockStore(initialState);
    const wrapper = shallow(
      <ComponentWrapper store={store} initialEntries={['/portfolios']}>
        <Portfolios {...initialProps} store={store} />
      </ComponentWrapper>
    ).find(Portfolios);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('should mount and fetch data', async (done) => {
    const store = mockStore(initialState);

    mockApi
      .onGet(`${CATALOG_API_BASE}/portfolios?limit=50&offset=0`)
      .replyOnce(200, { data: [{ name: 'Foo', id: '11' }] });
    const expectedActions = [
      {
        type: `${FETCH_PORTFOLIOS}_PENDING`,
        meta: {
          filter: '',
          filters: {
            name: '',
            owner: '',
            sort_by: undefined
          },
          sortDirection: 'asc',
          count: 0,
          limit: 50,
          offset: 0,
          storeState: true,
          stateKey: 'portfolio'
        }
      },
      expect.objectContaining({
        type: `${FETCH_PORTFOLIOS}_FULFILLED`
      })
    ];

    await act(async () => {
      mount(
        <ComponentWrapper store={store} initialEntries={['/portfolios']}>
          <Route
            path="/portfolios"
            render={(args) => <Portfolios {...initialProps} {...args} />}
          />
        </ComponentWrapper>
      );
    });

    expect(store.getActions()).toEqual(expectedActions);
    done();
  });

  it('should mount and filter portfolios', async (done) => {
    expect.assertions(2);
    const store = mockStore(initialState);

    mockApi
      .onGet(`${CATALOG_API_BASE}/portfolios?limit=50&offset=0`)
      .replyOnce(200, { data: [{ name: 'Foo', id: '11' }] });

    mockApi
      .onGet(
        `${CATALOG_API_BASE}/portfolios?limit=50&offset=0&filter[name][contains_i]=nothing`
      )
      .replyOnce((req) => {
        expect(req).toBeTruthy();
        done();
        return [200, { data: [] }];
      });

    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={store} initialEntries={['/portfolios']}>
          <UserContext.Provider value={{ userRoles: ['catalog-admin'] }}>
            <Route
              path="/portfolios"
              render={(args) => <Portfolios {...initialProps} {...args} />}
            />
          </UserContext.Provider>
        </ComponentWrapper>
      );
    });

    wrapper.update();
    expect(wrapper.find(PortfolioCard)).toHaveLength(1);
    const filterInput = wrapper.find('input').first();

    await act(async () => {
      filterInput.getDOMNode().value = 'nothing';
    });

    await act(async () => {
      filterInput.simulate('change', { target: { value: 'nothing' } });
    });
  });

  it('should render in loading state', async (done) => {
    const store = mockStore({
      ...initialState,
      portfolioReducer: {
        ...initialState.portfolioReducer,
        isLoading: true,
        portfolios: { data: [], meta: { limit: 50, offset: 0 } }
      }
    });
    mockApi
      .onGet(`${CATALOG_API_BASE}/portfolios?limit=50&offset=0`)
      .replyOnce(200, { data: [{ name: 'Foo', id: '11' }] });
    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={store} initialEntries={['/portfolios']}>
          <Route
            exact
            path="/portfolios"
            render={(props) => <Portfolios {...initialProps} {...props} />}
          />
        </ComponentWrapper>
      );
    });

    expect(wrapper.find(CardLoader)).toHaveLength(1);
    done();
  });

  it('should not show create button when the user does not have "catalog:portfolios:create" permission', async () => {
    const spy = jest
      .spyOn(PortfolioActions, 'fetchPortfoliosWithState')
      .mockReturnValue({
        payload: jest.fn().mockResolvedValue({}),
        meta: {},
        type: ''
      });
    const store = mockStore(initialState);
    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={store} initialEntries={['/portfolios']}>
          <Route exact path="/portfolios">
            <Portfolios {...initialProps} />
          </Route>
        </ComponentWrapper>
      );
    });
    expect(wrapper.find('button#create-portfolio')).toHaveLength(0);
    spy.mockRestore();
  });

  it('should show create button when the user has catalog-admin role', async () => {
    const spy = jest
      .spyOn(PortfolioActions, 'fetchPortfoliosWithState')
      .mockReturnValue({
        payload: jest.fn().mockResolvedValue({}),
        meta: {},
        type: ''
      });
    const store = mockStore(initialState);
    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={store} initialEntries={['/portfolios']}>
          <UserContext.Provider value={{ userRoles: ['catalog-admin'] }}>
            <Route exact path="/portfolios">
              <Portfolios {...initialProps} />
            </Route>
          </UserContext.Provider>
        </ComponentWrapper>
      );
    });
    expect(wrapper.find('button#create-portfolio')).toHaveLength(1);
    spy.mockRestore();
  });
});
