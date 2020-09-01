import React from 'react';
import { act } from 'react-dom/test-utils';
import thunk from 'redux-thunk';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Modal } from '@patternfly/react-core';
import { shallowToJson } from 'enzyme-to-json';
import { MemoryRouter, Route } from 'react-router-dom';
import promiseMiddleware from 'redux-promise-middleware';
import { componentTypes } from '@data-driven-forms/react-form-renderer';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications/';

import { CATALOG_API_BASE } from '../../../utilities/constants';
import FormRenderer from '../../../smart-components/common/form-renderer';
import AddPortfolioModal from '../../../smart-components/portfolio/add-portfolio-modal';
import { mockApi } from '../../../helpers/shared/__mocks__/user-login';

describe('<AddPortfolioModal />', () => {
  let initialProps;
  let initialState;
  const middlewares = [thunk, promiseMiddleware, notificationsMiddleware()];
  let mockStore;
  const ComponentWrapper = ({ store, children, initialEntries }) => (
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    </Provider>
  );

  beforeEach(() => {
    initialProps = {
      fetchPortfolios: jest.fn(),
      closeTarget: '/close-target'
    };
    initialState = {
      portfolioReducer: {
        selectedPortfolio: {
          name: 'Selected portfolio',
          id: '123',
          metadata: {
            user_capabilities: {
              update: true
            },
            statistics: {}
          }
        },
        portfolios: { data: [] }
      }
    };
    mockStore = configureStore(middlewares);
  });

  it('should render correctly', async () => {
    const store = mockStore({});
    let wrapper;
    await act(async () => {
      wrapper = shallow(
        <ComponentWrapper store={store} initialEntries={['/portfolios']}>
          <AddPortfolioModal {...initialProps} />
        </ComponentWrapper>
      ).dive();
    });

    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('should create edit variant of portfolio modal', async () => {
    const store = mockStore(initialState);

    const expectedSchema = {
      fields: [
        {
          component: componentTypes.TEXT_FIELD,
          isRequired: true,
          label: 'schemas.portfolio.name',
          name: 'name',
          maxLength: 64,
          validate: [expect.any(Function)]
        },
        {
          component: componentTypes.TEXTAREA,
          label: 'schemas.portfolio.description',
          name: 'description'
        }
      ]
    };

    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper
          store={store}
          initialEntries={['/portfolio/edit-portfolio?portfolio=123']}
        >
          <Route
            path="/portfolio"
            render={() => <AddPortfolioModal {...initialProps} />}
          />
        </ComponentWrapper>
      );
    });

    wrapper.update();

    const modal = wrapper.find(Modal);
    const form = wrapper.find(FormRenderer);
    expect(modal.props().title).toEqual('Edit portfolio');
    expect(form.props().schema).toEqual(expectedSchema);
  });

  it('should create edit variant of portfolio modal and call updatePortfolio on submit', async () => {
    const store = mockStore(initialState);

    mockApi.onPatch(`${CATALOG_API_BASE}/portfolios/123`).replyOnce((req) => {
      expect(JSON.parse(req.data)).toEqual({ id: '123', name: 'Portfolio' });
      return [200, {}];
    });

    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper
          store={store}
          initialEntries={['/portfolio/edit-portfolio?portfolio=123']}
        >
          <Route
            path="/portfolio"
            render={() => <AddPortfolioModal {...initialProps} />}
          />
        </ComponentWrapper>
      );
    });

    wrapper.update();

    const button = wrapper.find('button').last();
    button.simulate('click');
  });

  it('should redirect away from edit variant if update capability is set to false', () => {
    const store = mockStore({
      ...initialState,
      portfolioReducer: {
        ...initialState.portfolioReducer,
        selectedPortfolio: {
          ...initialState.portfolioReducer.selectedPortfolio,
          metadata: {
            user_capabilities: {
              update: false
            },
            statistics: {}
          }
        }
      }
    });

    const wrapper = mount(
      <ComponentWrapper
        store={store}
        initialEntries={['/portfolio/edit-portfolio?portfolio=123']}
      >
        <Route
          path="/portfolio"
          render={() => <AddPortfolioModal {...initialProps} />}
        />
      </ComponentWrapper>
    );

    expect(
      wrapper.find(MemoryRouter).instance().history.location.pathname
    ).toEqual('/403');
  });
});
