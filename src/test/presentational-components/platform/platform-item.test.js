import React from 'react';
import { mount, shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import configureStore from 'redux-mock-store' ;
import { Provider, thunk } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications/index';
import promiseMiddleware from 'redux-promise-middleware';

describe('<PlatformItem />', () => {
  let initialProps;
  let initialState;
  const middlewares = [ thunk, promiseMiddleware(), notificationsMiddleware() ];
  let mockStore;

  const PlatformItemWrapper = ({ store, children }) => (
    <Provider store={ store }>
      <MemoryRouter>
        { children }
      </MemoryRouter>
    </Provider>
  );

  beforeEach(() => {
    initialProps = {
      id: 'Foo'
    };
    mockStore = configureStore(middlewares);
  });

  it('should render correctly', () => {
    const store = mockStore(initialState);
    const wrapper = mount(<PlatformItemWrapper  store={ store } { ...initialProps } />);
    expect(shallowToJson(shallow(wrapper))).toMatchSnapshot();
  });

  it('should call handle check callback', () => {
    const store = mockStore(initialState);
    const onToggleItemSelect = jest.fn();
    const wrapper = mount(<PlatformItemWrapper  store={ store } { ...initialProps }
      editMode onToggleItemSelect={ onToggleItemSelect } description="Foo" id="foo" />);
    wrapper.find('input').simulate('change');
    expect(onToggleItemSelect).toHaveBeenCalled();
  });
});
