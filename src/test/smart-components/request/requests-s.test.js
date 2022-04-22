/* eslint-disable camelcase */
import React from 'react';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import promiseMiddleware from 'redux-promise-middleware';
import { IntlProvider } from 'react-intl';
import Requests from '../../../smart-components/request/requests';
import requestReducer, {
  requestsInitialState
} from '../../../redux/reducers/request-reducer';
import { act } from 'react-dom/test-utils';
import ReducerRegistry, {
  applyReducerHash
} from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry';
import {
  APPROVAL_API_BASE,
  APPROVAL_APPR_ROLE
} from '../../../utilities/approval-constants';
import TableEmptyState from '../../../presentational-components/shared/approval-table-empty-state';
import UserContext from '../../../user-context';
import routes from '../../../constants/approval-routes';
import ActionModal from '../../../smart-components/request/action-modal';
import { mockApi } from '../../../helpers/shared/__mocks__/user-login';

const roles = [APPROVAL_APPR_ROLE];

const ComponentWrapper = ({
  store,
  initialEntries = ['/requests'],
  children
}) => (
  <IntlProvider locale="en">
    <UserContext.Provider value={{ userRoles: roles }}>
      <Provider store={store}>
        <MemoryRouter initialEntries={initialEntries}>
          <IntlProvider locale="en">{children}</IntlProvider>
        </MemoryRouter>
      </Provider>
    </UserContext.Provider>
  </IntlProvider>
);

describe('<Requests />', () => {
  let initialProps;

  const request = {
    id: '299',
    state: 'notified',
    decision: 'undecided',
    workflow_id: '1',
    created_at: '2020-01-08T19:37:59Z',
    notified_at: '2020-01-08T19:37:59Z',
    number_of_children: 0,
    number_of_finished_children: 0,
    owner: 'jsmith@redhat.com',
    requester_name: 'John Smith',
    name: 'QA Password survey field'
  };

  beforeEach(() => {
    global.localStorage.setItem('catalog_standalone', true);
    global.localStorage.setItem('user', 'testUser');
    initialProps = {};
  });

  afterEach(() => {
    global.localStorage.setItem('catalog_standalone', false);
    global.localStorage.removeItem('user');
  });
  it('should render table empty state', async () => {
    mockApi
      .onGet(
        `${APPROVAL_API_BASE}/requests/?limit=50&offset=0&sort_by=created_at%3Adesc`
      )
      .replyOnce({
        status: 200,
        body: {
          meta: { count: 0, limit: 50, offset: 0 },
          data: []
        }
      });

    const registry = new ReducerRegistry({}, [thunk, promiseMiddleware]);
    registry.register({
      requestReducer: applyReducerHash(requestReducer, requestsInitialState)
    });
    const store = registry.getStore();

    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={store}>
          <Requests {...initialProps} />
        </ComponentWrapper>
      );
    });
    wrapper.update();

    expect(wrapper.find(TableEmptyState)).toHaveLength(1);
  });

  describe('Actions', () => {
    const request = {
      id: '703',
      state: 'notified',
      decision: 'undecided',
      workflow_id: '168',
      created_at: '2020-05-13T13:35:48Z',
      notified_at: '2020-05-13T13:36:29Z',
      number_of_children: 0,
      number_of_finished_children: 0,
      owner: 'insights-qa',
      requester_name: 'Insights QA',
      name: 'Hello World',
      group_name: 'Test Approval Group',
      parent_id: '702',
      metadata: {
        user_capabilities: {
          show: true,
          create: true,
          approve: true,
          cancel: false,
          deny: true,
          memo: true
        }
      }
    };

    beforeEach(() => {
      mockApi
        .onGet(
          `${APPROVAL_API_BASE}/requests/?persona=approver&page_size=50&page=1&sort_by=created_at%3Adesc`
        )
        .replyOnce({
          status: 200,
          body: {
            meta: { count: 1, limit: 50, offset: 0 },
            data: [request]
          }
        });
    });
  });
});
