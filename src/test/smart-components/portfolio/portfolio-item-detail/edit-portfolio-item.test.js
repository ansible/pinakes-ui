import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';
import notificationsMiddleware from '@redhat-cloud-services/frontend-components-notifications/notificationsMiddleware';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import EditPortfolioItem from '../../../../smart-components/portfolio/portfolio-item-detail/edit-portfolio-item';
import {
  APPROVAL_API_BASE,
  CATALOG_API_BASE
} from '../../../../utilities/constants';
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

  afterEach(() => {
    localStorage.setItem('catalog_standalone', false);
    localStorage.removeItem('user');
  });

  it('should submit form data', async () => {
    const store = mockStore({
      ...intialState,
      openApiReducer: openApiReducerMock
    });
    mockApi.onGet(`${CATALOG_API_BASE}/schema/openapi.json`).replyOnce(200, {});
    mockApi
      .onPatch(`${CATALOG_API_BASE}/portfolio_items/123/`)
      .replyOnce((req) => {
        expect(JSON.parse(req.data)).toEqual({
          name: 'foo',
          metadata: { user_capabilities: {} },
          description: 'https://www.google.com/'
        });
        return [200, { id: '123', ...JSON.parse(req.data) }];
      });
    const expectedActions = [
      {
        payload: {},
        type: '@@open-api/set-schema'
      },
      {
        payload: {
          description: 'https://www.google.com/',
          id: '123',
          metadata: {
            user_capabilities: {}
          },
          name: 'foo'
        },
        type: 'UPDATE_TEMPORARY_PORTFOLIO_ITEM'
      },
      {
        payload: {
          description: 'https://www.google.com/',
          id: '123',
          metadata: {
            user_capabilities: {}
          },
          name: 'foo'
        },
        type: 'UPDATE_PORTFOLIO_ITEM'
      },
      {
        payload: {
          dismissable: true,
          title: 'Product "foo" was successfully updated',
          variant: 'success'
        },
        type: '@@INSIGHTS-CORE/NOTIFICATIONS/ADD_NOTIFICATION'
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
    let input = wrapper.find('input#description');
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
    mockApi.onGet(`${CATALOG_API_BASE}/schema/openapi.json`).replyOnce(200, {});
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
