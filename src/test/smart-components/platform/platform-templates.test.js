import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import promiseMiddleware from 'redux-promise-middleware';
import { Route, MemoryRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import notificationsMiddleware from '@redhat-cloud-services/frontend-components-notifications/notificationsMiddleware';
import { mount, shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import PlatformTemplates from '../../../smart-components/platform/platform-templates';
import { CATALOG_INVENTORY_API_BASE } from '../../../utilities/constants';
import { platformInitialState } from '../../../redux/reducers/platform-reducer';
import { FETCH_PLATFORM_ITEMS } from '../../../redux/action-types';
import { mockApi } from '../../../helpers/shared/__mocks__/user-login';

describe('<PlatformTemplates />', () => {
  let initialProps;
  const middlewares = [thunk, promiseMiddleware, notificationsMiddleware()];
  let mockStore;
  let initialState;

  const ComponentWrapper = ({ store, initialEntries = ['/foo'], children }) => (
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>
        <Route path="/platform/platform-templates">{children}</Route>
      </MemoryRouter>
    </Provider>
  );

  beforeEach(() => {
    initialProps = {};
    mockStore = configureStore(middlewares);
    initialState = {
      breadcrumbsReducer: { fragments: [] },
      platformReducer: {
        ...platformInitialState,
        selectedPlatform: {
          id: '1',
          name: 'Foo'
        },
        platformItems: {
          1: {
            meta: {
              limit: 50,
              offset: 0,
              count: 0
            }
          }
        }
      }
    };
  });

  it('should render correctly', () => {
    const store = mockStore(initialState);
    const wrapper = shallow(
      <ComponentWrapper
        store={store}
        initialEntries={['/platform/platform-templates?platform=1']}
      >
        <PlatformTemplates store={mockStore(initialState)} {...initialProps} />
        );
      </ComponentWrapper>
    ).find(PlatformTemplates);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('should mount and fetch data', async () => {
    mockApi
      .onGet(
        `${CATALOG_INVENTORY_API_BASE}/sources/1/service_offerings?filter[archived_at][nil]&limit=50&offset=0`
      )
      .replyOnce(200, {
        data: [
          {
            id: '1',
            name: 'Offering 1'
          }
        ]
      });

    const expectedActions = [
      {
        type: `${FETCH_PLATFORM_ITEMS}_PENDING`,
        meta: { count: 0, filter: '', limit: 50, offset: 0, platformId: '1' }
      },
      {
        meta: { count: 0, filter: '', limit: 50, offset: 0, platformId: '1' },
        type: `${FETCH_PLATFORM_ITEMS}_FULFILLED`,
        payload: { data: [{ id: '1', name: 'Offering 1' }] }
      }
    ];

    const store = mockStore(initialState);
    await act(async () => {
      mount(
        <ComponentWrapper
          store={store}
          initialEntries={['/platform/platform-templates?platform=1']}
        >
          <PlatformTemplates
            {...initialProps}
            store={mockStore(initialState)}
          />
        </ComponentWrapper>
      );
    });
    expect(store.getActions()).toEqual(expectedActions);
  });
});
