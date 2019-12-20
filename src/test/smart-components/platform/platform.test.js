import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications/';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Platform from '../../../smart-components/platform/platform';
import { platformInitialState } from '../../../redux/reducers/platform-reducer';
import { Provider } from 'react-redux';
import { Route, MemoryRouter } from 'react-router-dom';

describe('<Platform />', () => {
  let initialProps;
  const middlewares = [thunk, promiseMiddleware, notificationsMiddleware()];
  let mockStore;
  let initialState;

  const ComponentWrapper = ({ store, initialEntries = ['/foo'], children }) => (
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>
        <Route path="/platforms">{children}</Route>
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
        platforms: [
          {
            id: '1',
            name: 'Foo'
          }
        ]
      }
    };
  });

  it('should render correctly', () => {
    const store = mockStore(initialState);
    const wrapper = shallow(
      <ComponentWrapper store={store} initialEntries={['/platforms']}>
        <Platform store={mockStore(initialState)} {...initialProps} />
        );
      </ComponentWrapper>
    ).find(Platform);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
