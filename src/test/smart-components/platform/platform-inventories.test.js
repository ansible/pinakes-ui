import React from 'react';
import configureStore from 'redux-mock-store' ;
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import promiseMiddleware from 'redux-promise-middleware';
import { MemoryRouter } from 'react-router-dom';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications/';
import { mount, shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import PlatformInventories from '../../../smart-components/platform/platform-inventories';
import { TOPOLOGICAL_INVENTORY_API_BASE, SOURCES_API_BASE } from '../../../utilities/constants';
import { FETCH_PLATFORM, FETCH_PLATFORM_INVENTORIES } from '../../../redux/action-types';
import { platformInitialState } from '../../../redux/reducers/platform-reducer';
import { act } from 'react-dom/test-utils';

describe('<PlatformInventories />', () => {
  let initialProps;
  const middlewares = [ thunk, promiseMiddleware(), notificationsMiddleware() ];
  let mockStore;
  let initialState;

  const ComponentWrapper = ({ store, initialEntries = [ '/foo' ], children }) => (
    <Provider store={ store }>
      <MemoryRouter initialEntries={ initialEntries }>
        { children }
      </MemoryRouter>
    </Provider>
  );

  beforeEach(() => {
    initialProps = {
      match: {
        params: {
          id: 123
        }
      }
    };
    mockStore = configureStore(middlewares);
    initialState = {
      platformReducer: {
        ...platformInitialState,
        selectedPlatform: {
          id: '123',
          name: 'Foo'
        },
        platformInventories: {
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
      <ComponentWrapper store={ store } initialEntries={ [ '/platforms' ] }>
        <PlatformInventories store={ mockStore(initialState) } { ...initialProps } />);
      </ComponentWrapper>).find(PlatformInventories);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('should mount and fetch data', async done=> {
    const store = mockStore(initialState);
    expect.assertions(1);
    apiClientMock.get(`${SOURCES_API_BASE}/sources/123`, mockOnce({ body: { name: 'Foo' }}));
    apiClientMock.get(`${TOPOLOGICAL_INVENTORY_API_BASE}/sources/123/service_inventories?filter%5Bname%5D%5Bcontains_i%5D=&limit=50&offset=0`,
      mockOnce({
        body: {
          data: [{ id: 111 }]}
      }));

    const expectedActions = [
      { type: `${FETCH_PLATFORM}_PENDING` },
      { type: `${FETCH_PLATFORM_INVENTORIES}_PENDING` },
      { type: `${FETCH_PLATFORM}_FULFILLED`, payload: { name: 'Foo' }},
      { type: `${FETCH_PLATFORM_INVENTORIES}_FULFILLED`, payload: { data: [{ id: 111 }]}}
    ];

    await act(async () => {
      mount(<ComponentWrapper store={ store } initialEntries={ [ '/platforms' ] }>
        <PlatformInventories { ...initialProps } store={ mockStore(initialState) }/>
      </ComponentWrapper>);
    });

    setImmediate(() => {
      expect(store.getActions()).toEqual(expectedActions);
      done();
    });
  });
});
