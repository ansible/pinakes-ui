import React from 'react';
import configureStore from 'redux-mock-store' ;
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import promiseMiddleware from 'redux-promise-middleware';
import { Route, MemoryRouter } from 'react-router-dom';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications/';
import { mount, shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import PlatformTemplates from '../../../smart-components/platform/platform-templates';
import { TOPOLOGICAL_INVENTORY_API_BASE, SOURCES_API_BASE } from '../../../utilities/constants';
import { platformInitialState } from '../../../redux/reducers/platform-reducer';
import { FETCH_PLATFORM, FETCH_PLATFORM_ITEMS } from '../../../redux/action-types';
import { act } from 'react-dom/test-utils';
import { mockApi } from '../../__mocks__/user-login';

describe('<PlatformTemplates />', () => {
  let initialProps;
  const middlewares = [ thunk, promiseMiddleware, notificationsMiddleware() ];
  let mockStore;
  let initialState;

  const ComponentWrapper = ({ store, initialEntries = [ '/foo' ], children }) => (
    <Provider store={ store }>
      <MemoryRouter initialEntries={ initialEntries }>
        <Route path='/platforms/detail/:id/platform-templates'>
          { children }
        </Route>
      </MemoryRouter>
    </Provider>
  );

  beforeEach(() => {
    initialProps = {};
    mockStore = configureStore(middlewares);
    initialState = {
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
      <ComponentWrapper store={ store } initialEntries={ [ '/platforms/detail/1/platform-templates' ] }>
        <PlatformTemplates store={ mockStore(initialState) } { ...initialProps } />);
      </ComponentWrapper>).find(PlatformTemplates);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('should mount and fetch data', async done => {
    mockApi.onGet(`${SOURCES_API_BASE}/sources/1`).replyOnce(200, { name: 'Foo' });
    mockApi.onGet(`${TOPOLOGICAL_INVENTORY_API_BASE}/sources/1/service_offerings?filter[archived_at][nil]&limit=50&offset=0`)
    .replyOnce(200, {
      data: [{
        id: '1',
        name: 'Offering 1'
      }]
    });

    const expectedActions = [
      { type: `${FETCH_PLATFORM}_PENDING` },
      { type: `${FETCH_PLATFORM_ITEMS}_PENDING`,
        meta: { platformId: '1' }
      },
      { type: `${FETCH_PLATFORM}_FULFILLED`, payload: { name: 'Foo' }},
      {
        meta: { platformId: '1' },
        type: `${FETCH_PLATFORM_ITEMS}_FULFILLED`,
        payload: { data: [{ id: '1', name: 'Offering 1' }]}
      }];

    const store = mockStore(initialState);
    await act(async () => {
      mount(<ComponentWrapper store={ store } initialEntries={ [ '/platforms/detail/1/platform-templates' ] }>
        <PlatformTemplates { ...initialProps } store={ mockStore(initialState) }/>
      </ComponentWrapper>);
    });
    setImmediate(() => {
      expect(store.getActions()).toEqual(expectedActions);
      done();
    });
  });
});
