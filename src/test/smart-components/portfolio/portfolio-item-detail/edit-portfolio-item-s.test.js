import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';
import { ADD_NOTIFICATION } from '@redhat-cloud-services/frontend-components-notifications/redux';
import notificationsMiddleware from '@redhat-cloud-services/frontend-components-notifications/notificationsMiddleware';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import EditPortfolioItem from '../../../../smart-components/portfolio/portfolio-item-detail/edit-portfolio-item';
import { CATALOG_API_BASE } from '../../../../utilities/constants';
import {
  UPDATE_TEMPORARY_PORTFOLIO_ITEM,
  UPDATE_PORTFOLIO_ITEM
} from '../../../../redux/action-types';
import { openApiReducerMock } from '../../../__mocks__/open-api-mock';
import { mockApi } from '../../../../helpers/shared/__mocks__/user-login';

describe('<EditPortfolioItem />', () => {
  const middlewares = [thunk, promiseMiddleware, notificationsMiddleware()];
  let mockStore;
  let initialProps;
  const intialState = { platformReducer: { platformIconMapping: {} } };

  const ComponentWrapper = ({ store, children }) => (
    <Provider store={store}>
      <MemoryRouter>{children}</MemoryRouter>
    </Provider>
  );
  beforeEach(() => {
    localStorage.setItem('catalog_standalone', true);
    localStorage.setItem('user', 'testUser');
    mockStore = configureStore(middlewares);
    initialProps = {
      uploadIcon: jest.fn(),
      resetIcon: jest.fn(),
      workflows: [],
      cancelUrl: '/cancel',
      userCapabilities: {},
      product: {
        name: 'foo',
        id: '123'
      }
    };
  });

  it('should fail form validation and not submit the data', () => {
    const store = mockStore(intialState);
    const wrapper = mount(
      <ComponentWrapper store={store}>
        <EditPortfolioItem {...initialProps} />
      </ComponentWrapper>
    );
    const input = wrapper.find('input#documentation_url');
    input.getDOMNode().value = 'foo';
    input.simulate('change');
    wrapper.update();
    wrapper
      .find('button')
      .first()
      .simulate('click');
    expect(store.getActions()).toEqual([]);
  });

  it('should submit form data', async () => {
    const store = mockStore({
      ...intialState,
      openApiReducer: openApiReducerMock
    });
    mockApi
      .onPatch(`${CATALOG_API_BASE}/portfolio_items/123/`)
      .replyOnce((req) => {
        expect(JSON.parse(req.data)).toEqual({
          name: 'foo',
          metadata: { user_capabilities: {} },
          documentation_url: 'https://www.google.com/',
          support_url: 'https://www.google.com/',
          long_description: 'https://www.google.com/',
          description: 'https://www.google.com/',
          distributor: 'https://www.google.com/'
        });
        return [200, { id: '123', ...JSON.parse(req.data) }];
      });
    const expectedActions = [
      {
        type: UPDATE_TEMPORARY_PORTFOLIO_ITEM,
        payload: {
          name: 'foo',
          id: '123',
          metadata: { user_capabilities: {} },
          documentation_url: 'https://www.google.com/',
          support_url: 'https://www.google.com/',
          long_description: 'https://www.google.com/',
          description: 'https://www.google.com/',
          distributor: 'https://www.google.com/'
        }
      },
      {
        type: UPDATE_PORTFOLIO_ITEM,
        payload: {
          name: 'foo',
          id: '123',
          metadata: { user_capabilities: {} },
          documentation_url: 'https://www.google.com/',
          support_url: 'https://www.google.com/',
          long_description: 'https://www.google.com/',
          description: 'https://www.google.com/',
          distributor: 'https://www.google.com/'
        }
      },
      {
        type: ADD_NOTIFICATION,
        payload: expect.any(Object)
      }
    ];
    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={store}>
          <EditPortfolioItem {...initialProps} />
        </ComponentWrapper>
      );
    });
    let input = wrapper.find('input#documentation_url');
    input.getDOMNode().value = 'https://www.google.com/';
    await act(async () => {
      input.simulate('change');
    });
    input = wrapper.find('input#support_url');
    input.getDOMNode().value = 'https://www.google.com/';
    await act(async () => {
      input.simulate('change');
    });
    input = wrapper.find('input#long_description');
    input.getDOMNode().value = 'https://www.google.com/';
    await act(async () => {
      input.simulate('change');
    });
    input = wrapper.find('input#long_description');
    input.getDOMNode().value = 'https://www.google.com/';
    await act(async () => {
      input.simulate('change');
    });
    input = wrapper.find('input#description');
    input.getDOMNode().value = 'https://www.google.com/';
    await act(async () => {
      input.simulate('change');
    });
    input = wrapper.find('input#distributor');
    input.getDOMNode().value = 'https://www.google.com/';
    await act(async () => {
      input.simulate('change');
    });
    wrapper.update();
    await act(async () => {
      wrapper.find('form').simulate('submit');
    });
    expect(store.getActions()).toEqual(expectedActions);
    expect(
      wrapper.find(MemoryRouter).instance().history.location.pathname
    ).toEqual('/cancel');
  });

  it('should trigger cancel callback', async () => {
    expect.assertions(1);
    const store = mockStore(intialState);
    const wrapper = mount(
      <ComponentWrapper store={store}>
        <EditPortfolioItem {...initialProps} />
      </ComponentWrapper>
    );
    await act(async () => {
      wrapper
        .find('button')
        .last()
        .simulate('click');
    });
    expect(
      wrapper.find(MemoryRouter).instance().history.location.pathname
    ).toEqual('/cancel');
  });
});
