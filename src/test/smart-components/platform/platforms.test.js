import React from 'react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import { MemoryRouter } from 'react-router-dom';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications/';
import { platformInitialState } from '../../../redux/reducers/platform-reducer';
import Platforms from '../../../smart-components/platform/platforms';
import { SOURCES_API_BASE } from '../../../utilities/constants';
import { FETCH_PLATFORMS } from '../../../redux/action-types';
import { mockGraphql } from '../../__mocks__/user-login';
import { Provider } from 'react-redux';

describe('<Platforms />', () => {
  let initialProps;
  let initialState;
  const middlewares = [thunk, promiseMiddleware, notificationsMiddleware()];
  let mockStore;
  beforeEach(() => {
    mockStore = configureStore(middlewares);
    initialProps = {};
    initialState = {
      breadcrumbsReducer: { fragments: [] },
      platformReducer: {
        ...platformInitialState
      }
    };
  });

  it('should mount and fetch platforms data', (done) => {
    const store = mockStore(initialState);
    mockGraphql.onPost(`${SOURCES_API_BASE}/graphql`).replyOnce(200, {
      data: { application_types: [{ sources: [{ id: '1', name: 'foo' }] }] }
    });
    mount(
      <MemoryRouter>
        <Provider store={store}>
          <Platforms {...initialProps} />
        </Provider>
      </MemoryRouter>
    );
    setImmediate(() => {
      const expectedActions = [
        {
          type: `${FETCH_PLATFORMS}_PENDING`
        },
        {
          type: `${FETCH_PLATFORMS}_FULFILLED`,
          payload: [{ id: '1', name: 'foo' }]
        }
      ];
      expect(store.getActions()).toEqual(expectedActions);
      done();
    });
  });

  it('should call filter handler and filter data', (done) => {
    const initialState = {
      breadcrumbsReducer: { fragments: [] },
      platformReducer: {
        ...platformInitialState,
        platforms: [
          {
            id: '1',
            name: 'Foo',
            description: 'desc',
            modified: 'mod'
          },
          {
            id: '2',
            name: 'Bar',
            description: 'desc',
            modified: 'mod'
          },
          {
            id: '3',
            name: 'baz',
            description: 'desc',
            modified: 'mod'
          }
        ]
      }
    };
    const store = mockStore(initialState);
    mockGraphql.onPost(`${SOURCES_API_BASE}/graphql`).replyOnce(200, {
      data: { application_types: [{ sources: [{ id: '1', name: 'foo' }] }] }
    });
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/platforms']}>
          <Platforms {...initialProps} />
        </MemoryRouter>
      </Provider>
    );

    setImmediate(() => {
      const search = wrapper.find('input');

      search.getDOMNode().value = 'foo';
      search.simulate('change');
      wrapper.update();
      expect(wrapper.find('input').instance().value).toEqual('foo');
      done();
    });
  });
});
