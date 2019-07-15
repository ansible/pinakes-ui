import React from 'react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { mount } from 'enzyme';
import { MemoryRouter, Route } from 'react-router-dom';
import { shallowToJson } from 'enzyme-to-json';
import PortfolioItem from '../../../smart-components/portfolio/portfolio-item';
import configureStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications/index';
import { platformInitialState } from '../../../redux/reducers/platform-reducer';

describe('<PortfolioItem />', () => {
  let initialProps;
  const middlewares = [ thunk, promiseMiddleware(), notificationsMiddleware() ];
  let mockStore;
  let initialState;

  const PortfolioItemWrapper = ({ store, children, initialEntries = []}) => (
    <Provider store={ store }>
      <MemoryRouter initialEntries={ initialEntries }>
        { children }
      </MemoryRouter>
    </Provider>
  );

  beforeEach(() => {
    initialProps = {
      closeUrl: '/close',
      serviceData: {
        name: 'Foo',
        id: '1'
      }
    };
    mockStore = configureStore(middlewares);
    initialState = {
      platformReducer: {
        ...platformInitialState,
        isLoading: true,
        platforms: {
          name: 'Foo',
          id: '1'
        }
      }
    };
  });

  it('should render correctly', () => {
    const store = mockStore(initialState);
    const wrapper = mount(
      <PortfolioItemWrapper store={ store } initialEntries={ [ '/foo/url' ] }>
        <Route to="/foo/url" render={ args => <PortfolioItem { ...initialProps } { ...args } /> }  />
      </PortfolioItemWrapper>
    );
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('should check the item correctly', () => {
    const onSelect = jest.fn();
    const wrapper = mount(
      <MemoryRouter>
        <PortfolioItem { ...initialProps } onSelect={ onSelect } isSelectable />
      </MemoryRouter>
    );
    wrapper.find('input').simulate('change');
    expect(onSelect).toHaveBeenCalledWith('1');
  });
});
