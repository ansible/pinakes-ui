import React from 'react';
import thunk from 'redux-thunk';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { shallowToJson } from 'enzyme-to-json';
import { MemoryRouter, Route } from 'react-router-dom';
import promiseMiddleware from 'redux-promise-middleware';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications/';

import DetailToolbarActions from '../../../../smart-components/portfolio/portfolio-item-detail/detail-toolbar-actions';
import { PortfolioItemDetailToolbar } from '../../../../smart-components/portfolio/portfolio-item-detail/portfolio-item-detail-toolbar';

describe('<PortfolioItemDetailToolbar />', () => {
  let initialProps;
  let initialState;
  const middlewares = [thunk, promiseMiddleware, notificationsMiddleware()];
  let mockStore;

  const ComponentWrapper = ({ store, children, initialEntries = [] }) => (
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    </Provider>
  );

  beforeEach(() => {
    initialProps = {
      url: '/foo',
      isOpen: false,
      product: {
        name: 'bar'
      },
      setOpen: jest.fn(),
      setWorkflow: jest.fn(),
      handleUpdate: jest.fn(),
      userCapabilities: {
        copy: true,
        update: true
      }
    };

    initialState = {
      breadcrumbsReducer: { fragments: [] },
      platformReducer: { platforms: [], platformIconMapping: {} }
    };
    mockStore = configureStore(middlewares);
  });

  it('should render correctly', () => {
    const wrapper = shallow(
      <MemoryRouter>
        <PortfolioItemDetailToolbar {...initialProps} />
      </MemoryRouter>
    ).find(PortfolioItemDetailToolbar);
    expect(
      shallowToJson(wrapper.find(PortfolioItemDetailToolbar))
    ).toMatchSnapshot();
  });

  it('should render view variant', () => {
    const store = mockStore(initialState);
    const wrapper = mount(
      <ComponentWrapper store={store} initialEntries={['/foo']}>
        <Route
          path="/foo"
          render={() => <PortfolioItemDetailToolbar {...initialProps} />}
        />
      </ComponentWrapper>
    );
    expect(wrapper.find(DetailToolbarActions)).toHaveLength(1);
  });
});
