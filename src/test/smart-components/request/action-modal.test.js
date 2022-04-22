import React from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';
import thunk from 'redux-thunk';
import notificationsMiddleware from '@redhat-cloud-services/frontend-components-notifications/notificationsMiddleware';
import ActionModal from '../../../smart-components/request/action-modal';
import { APPROVAL_API_BASE } from '../../../utilities/approval-constants';
import routes from '../../../constants/approval-routes';
import { IntlProvider } from 'react-intl';
import { mockApi } from '../../../helpers/shared/__mocks__/user-login';

const ComponentWrapper = ({ store, children }) => (
  <IntlProvider locale="en">
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[
          { pathname: routes.request.index, search: '?request=123' }
        ]}
      >
        {children}
      </MemoryRouter>
    </Provider>
  </IntlProvider>
);

describe('<ActionModal />', () => {
  let initialProps;
  const middlewares = [thunk, promiseMiddleware, notificationsMiddleware()];
  let mockStore;
  let initialState;

  beforeEach(() => {
    localStorage.setItem('catalog_standalone', true);
    localStorage.setItem('user', 'testUser');
    initialProps = {
      postMethod: jest.fn(),
      title: 'Action',
      actionType: 'Comment'
    };
    mockStore = configureStore(middlewares);
    initialState = {
      requestReducer: { isRequestDataLoading: true }
    };
  });

  afterEach(() => {
    localStorage.setItem('catalog_standalone', false);
    localStorage.removeItem('user');
  });

  it('should render action modal and post submit data ', async () => {
    expect.assertions(1);
    const store = mockStore(initialState);
    let wrapper;

    mockApi
      .onPost(`${APPROVAL_API_BASE}/requests/123/actions/`)
      .replyOnce((req, response) => {
        expect(JSON.parse(req.data)).toEqual({
          operation: 'memo',
          comments: 'foo'
        });
        return response.status(200);
      });

    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={store}>
          <ActionModal {...initialProps} />
        </ComponentWrapper>
      );
    });
    wrapper.update();

    const textarea = wrapper.find('textarea#comments');
    textarea.getDOMNode().value = 'foo';
    textarea.simulate('change');
    wrapper.update();

    await act(async () => {
      wrapper.find('form').simulate('submit');
    });
    wrapper.update();
  });

  it('should call cancel callback', async () => {
    const store = mockStore(initialState);
    let wrapper;

    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={store}>
          <ActionModal {...initialProps} />
        </ComponentWrapper>
      );
    });
    wrapper.update();

    wrapper
      .find('button.pf-c-button')
      .first()
      .simulate('click');
    wrapper.update();
    expect(
      wrapper.find(MemoryRouter).instance().history.location.pathname
    ).toEqual('/approval/requests');
  });
});
