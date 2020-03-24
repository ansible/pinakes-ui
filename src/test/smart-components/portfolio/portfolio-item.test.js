import React from 'react';
import { mount } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import promiseMiddleware from 'redux-promise-middleware';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications/';

import PortfolioItem from '../../../smart-components/portfolio/portfolio-item';

describe('<PortfolioItem />', () => {
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
      orderUrl: '/order',
      id: '1',
      name: 'Foo',
      description: 'Bar',
      display_name: 'quux',
      metadata: {
        user_capabilities: {
          destroy: true
        }
      }
    };
    initialState = {
      platformReducer: {
        platformIconMapping: {}
      },
      portfolioReducer: {
        portfolioItems: {
          data: [
            {
              orderUrl: '/order',
              id: '1',
              name: 'Foo',
              description: 'Bar',
              display_name: 'quux',
              metadata: {
                user_capabilities: {
                  destroy: true
                }
              }
            }
          ]
        }
      }
    };
    mockStore = configureStore(middlewares);
  });

  it('should render correctly', (done) => {
    const store = mockStore(initialState);
    const wrapper = mount(
      <ComponentWrapper store={store}>
        <PortfolioItem {...initialProps} />
      </ComponentWrapper>
    );
    setImmediate(() => {
      expect(shallowToJson(wrapper.find(PortfolioItem))).toMatchSnapshot();
      done();
    });
  });

  it('should check the item correctly', (done) => {
    const onSelect = jest.fn();
    const store = mockStore(initialState);
    const wrapper = mount(
      <ComponentWrapper store={store}>
        <PortfolioItem {...initialProps} onSelect={onSelect} isSelectable />
      </ComponentWrapper>
    );
    setImmediate(() => {
      wrapper
        .find(PortfolioItem)
        .find('input')
        .simulate('change');
      expect(onSelect).toHaveBeenCalledWith('1');
      done();
    });
  });

  it('should not render checkbox if capability destroy is set to false', () => {
    const onSelect = jest.fn();
    const store = mockStore(initialState);
    const wrapper = mount(
      <ComponentWrapper store={store}>
        <PortfolioItem
          {...initialProps}
          metadata={{
            user_capabilities: {
              destroy: false
            }
          }}
          onSelect={onSelect}
          isSelectable
        />
      </ComponentWrapper>
    );
    expect(wrapper.find(PortfolioItem).find('input')).toHaveLength(0);
  });
});
