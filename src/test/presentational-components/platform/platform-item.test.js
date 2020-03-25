import React from 'react';
import { mount } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import promiseMiddleware from 'redux-promise-middleware';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications/';
import { platformInitialState } from '../../../redux/reducers/platform-reducer';
import PlatformItem from '../../../presentational-components/platform/platform-item';

describe('<PlatformItem />', () => {
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
        <PlatformItem {...initialProps} />
      </ComponentWrapper>
    );
    setImmediate(() => {
      expect(shallowToJson(wrapper.find(PlatformItem))).toMatchSnapshot();
      done();
    });
  });

  it('should call handle check callback', (done) => {
    const onToggleItemSelect = jest.fn();
    const store = mockStore(initialState);
    const wrapper = mount(
      <ComponentWrapper store={store}>
        <PlatformItem
          {...initialProps}
          editMode
          onToggleItemSelect={onToggleItemSelect}
          description="Foo"
          id="foo"
        />
        );
      </ComponentWrapper>
    );
    setImmediate(() => {
      wrapper
        .find(PlatformItem)
        .find('input')
        .simulate('change');
      expect(onToggleItemSelect).toHaveBeenCalled();
      done();
    });
  });
});
