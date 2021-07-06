import React from 'react';
import { mount } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import promiseMiddleware from 'redux-promise-middleware';
import notificationsMiddleware from '@redhat-cloud-services/frontend-components-notifications/notificationsMiddleware';
import { platformInitialState } from '../../../redux/reducers/platform-reducer';

import PlatformCard from '../../../presentational-components/platform/platform-card';

describe('<PlatformCard />', () => {
  let initialProps;
  let initialState;
  const middlewares = [thunk, promiseMiddleware, notificationsMiddleware()];
  let mockStore;

  const ComponentWrapper = ({ store, children }) => (
    <Provider store={store}>
      <MemoryRouter>{children}</MemoryRouter>
    </Provider>
  );

  beforeEach(() => {
    initialProps = {
      id: 'Foo'
    };
    mockStore = configureStore(middlewares);
    initialState = {
      platformReducer: { ...platformInitialState, isLoading: false }
    };
  });

  it('should render correctly', (done) => {
    const store = mockStore(initialState);
    const wrapper = mount(
      <ComponentWrapper store={store}>
        <PlatformCard {...initialProps} />
      </ComponentWrapper>
    );
    expect(shallowToJson(wrapper.find(PlatformCard))).toMatchSnapshot();
    done();
  });
});
