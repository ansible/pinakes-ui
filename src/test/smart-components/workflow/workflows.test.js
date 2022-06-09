import React from 'react';
import { act } from 'react-dom/test-utils';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';
import { IntlProvider } from 'react-intl';
import Workflows, {
  workflowsListState
} from '../../../smart-components/workflow/workflows';
import workflowReducer, {
  workflowsInitialState
} from '../../../redux/reducers/workflow-reducer';
import notificationsMiddleware from '@redhat-cloud-services/frontend-components-notifications/notificationsMiddleware';
import { groupsInitialState } from '../../../redux/reducers/group-reducer';
import { APPROVAL_API_BASE } from '../../../utilities/approval-constants';
import RemoveWorkflowModal from '../../../smart-components/workflow/remove-workflow-modal';
import AddWorkflowModal from '../../../smart-components/workflow/add-workflow-modal';
import ReducerRegistry, {
  applyReducerHash
} from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry';
import routes from '../../../constants/approval-routes';
import TableEmptyState from '../../../presentational-components/shared/approval-table-empty-state';
import * as edit from '../../../smart-components/workflow/edit-workflow-modal';
import { mockApi } from '../../../helpers/shared/__mocks__/user-login';

const ComponentWrapper = ({
  store,
  initialEntries = [routes.workflows.index],
  children
}) => (
  <Provider store={store}>
    <MemoryRouter initialEntries={initialEntries}>
      <IntlProvider locale="en">{children}</IntlProvider>
    </MemoryRouter>
  </Provider>
);

describe('<Workflows />', () => {
  const middlewares = [thunk, promiseMiddleware, notificationsMiddleware()];
  let mockStore;
  let stateWithData;
  let stateWithWorkflows;

  beforeEach(() => {
    localStorage.setItem('catalog_standalone', true);
    localStorage.setItem('user', 'testUser');
    mockStore = configureStore(middlewares);
    stateWithData = {
      groupReducer: { ...groupsInitialState },
      workflowReducer: {
        ...workflowsInitialState,
        workflows: {
          data: [
            {
              id: 'edit-id',
              name: 'foo',
              group_refs: [{ name: 'group-1', uuid: 'some-uuid' }]
            }
          ],
          meta: {
            count: 1,
            limit: 10,
            offset: 0
          }
        },
        workflow: {},
        filterValue: '',
        isLoading: false,
        isRecordLoading: false
      }
    };
    const wf1 = {
      id: '123',
      name: 'wf1',
      selected: true,
      group_refs: []
    };
    const wf2 = {
      id: '456',
      name: 'wf2',
      selected: true,
      group_refs: []
    };
    const wf3 = {
      id: '789',
      name: 'wf',
      selected: true,
      group_refs: []
    };

    stateWithWorkflows = {
      groupReducer: { ...groupsInitialState },
      workflowReducer: {
        ...workflowsInitialState,
        workflows: {
          data: [wf1, wf2, wf3],
          meta: {
            count: 21,
            limit: 10,
            offset: 0
          }
        },
        workflow: {},
        filterValue: '',
        isLoading: false,
        isRecordLoading: false
      }
    };
  });

  afterEach(() => {
    global.localStorage.setItem('catalog_standalone', false);
    global.localStorage.removeItem('user');
  });

  it('should redirect to Edit info page', async () => {
    edit.default = jest.fn().mockImplementation(() => <span />);

    const store = mockStore(stateWithData);
    let wrapper;
    mockApi
      .onGet(`${APPROVAL_API_BASE}/workflows/?page_size=50&page=1`)
      .replyOnce(200, {
        count: 3,
        data: [
          {
            id: 'edit-id',
            name: 'foo',
            group_refs: [{ name: 'group-1', uuid: 'some-uuid' }]
          }
        ]
      });

    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={store}>
          <Route path={routes.workflows.index} component={Workflows} />
        </ComponentWrapper>
      );
    });
    wrapper.update();
    /**
     * Open action drop down and click on edit info action
     */
    wrapper
      .find('button.pf-c-dropdown__toggle.pf-m-plain')
      .last()
      .simulate('click');
    await act(async () => {
      wrapper
        .find('button.pf-c-dropdown__menu-item')
        .first()
        .simulate('click');
    });

    wrapper.update();

    await act(async () => {
      wrapper.update();
    });

    expect(
      wrapper.find(MemoryRouter).instance().history.location.pathname
    ).toEqual(routes.workflows.edit);
    expect(
      wrapper.find(MemoryRouter).instance().history.location.search
    ).toEqual('?workflow=edit-id');
    expect(wrapper.find(edit.default)).toHaveLength(1);
  });

  it('should redirect to Delete approval process page', async () => {
    const store = mockStore(stateWithData);
    let wrapper;

    mockApi
      .onGet(`${APPROVAL_API_BASE}/workflows/?page_size=50&page=1`)
      .replyOnce({
        body: {
          data: [
            {
              id: 'edit-id',
              name: 'foo',
              group_refs: [{ name: 'group-1', uuid: 'some-uuid' }]
            }
          ]
        }
      });

    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={store}>
          <Route path={routes.workflows.index} component={Workflows} />
        </ComponentWrapper>
      );
    });
    wrapper.update();
    /**
     * Open action drop down and click on delete action
     */
    wrapper
      .find('button.pf-c-dropdown__toggle.pf-m-plain')
      .last()
      .simulate('click');
    await act(async () => {
      wrapper
        .find('button.pf-c-dropdown__menu-item')
        .last()
        .simulate('click');
    });

    wrapper.update();
    expect(
      wrapper.find(MemoryRouter).instance().history.location.pathname
    ).toEqual(routes.workflows.remove);
    expect(
      wrapper.find(MemoryRouter).instance().history.location.search
    ).toEqual('?workflow=edit-id');
    expect(wrapper.find(RemoveWorkflowModal)).toHaveLength(1);
  });

  it('should redirect to add approval process page', async () => {
    const store = mockStore(stateWithData);
    let wrapper;

    mockApi
      .onGet(`${APPROVAL_API_BASE}/workflows/?&name=&page_size=50&page=1`)
      .replyOnce({
        body: {
          data: [
            {
              id: 'edit-id',
              name: 'foo',
              group_refs: [{ name: 'group-1', uuid: 'some-uuid' }],
              group_names: ['group-name-1']
            }
          ]
        }
      });

    // async name validator
    mockApi
      .onGet(`${APPROVAL_API_BASE}/workflows/?page_size=50&page=1`)
      .replyOnce({
        body: {
          data: [
            {
              id: 'edit-id',
              name: 'foo',
              group_refs: [{ name: 'group-1', uuid: 'some-uuid' }]
            }
          ]
        }
      });

    mockApi
      .onGet(
        `${APPROVAL_API_BASE}/groups/?role=approval-approver&role=approval-admin`
      )
      .replyOnce(200, { data: [{ id: 'id', name: 'name' }] });

    mockApi
      .onGet(`${APPROVAL_API_BASE}/templates/`)
      .replyOnce(200, { data: [{ id: 'id', title: 'name' }] });

    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={store}>
          <Route path={routes.workflows.index} component={Workflows} />
        </ComponentWrapper>
      );
    });
    wrapper.update();
    /**
     * Click on add approval process link
     */
    await act(async () => {
      wrapper.find('Link#add-workflow-link').simulate('click', { button: 0 });
    });
    wrapper.update();

    await act(async () => {
      wrapper.update();
    });

    expect(
      wrapper.find(MemoryRouter).instance().history.location.pathname
    ).toEqual(routes.workflows.add);
    expect(wrapper.find(AddWorkflowModal)).toHaveLength(1);
  });

  it('should remove multiple selected workflows from table', async () => {
    const store = mockStore(stateWithData);
    let wrapper;

    mockApi
      .onGet(`${APPROVAL_API_BASE}/workflows/?limit=50&offset=0`)
      .replyOnce(200, {
        data: [
          {
            id: 'edit-id',
            name: 'foo',
            group_refs: [{ name: 'group-1', uuid: 'some-uuid' }],
            group_names: ['group-name-1']
          }
        ]
      });

    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={store}>
          <Route path={routes.workflows.index} component={Workflows} />
        </ComponentWrapper>
      );
    });
    wrapper.update();
    wrapper
      .find('input[type="checkbox"]')
      .last()
      .simulate('change', { target: { checked: true } });
    wrapper
      .find('Link#remove-multiple-workflows')
      .simulate('click', { button: 0 });
    wrapper.update();
    expect(
      wrapper.find(MemoryRouter).instance().history.location.pathname
    ).toEqual(routes.workflows.remove);
    expect(
      wrapper.find(MemoryRouter).instance().history.location.search
    ).toEqual('');
    expect(wrapper.find(RemoveWorkflowModal)).toHaveLength(1);
  });

  it('should render table empty state', async () => {
    mockApi
      .onGet(
        `${APPROVAL_API_BASE}/groups/?role=approval-approver&role=approval-admin`
      )
      .replyOnce(200, { data: [{ id: 'id', name: 'name' }] });
    mockApi
      .onGet(`${APPROVAL_API_BASE}/workflows/?page_size=50&page=1`)
      .replyOnce({
        status: 200,
        body: {
          count: 0,
          results: []
        }
      });
    mockApi
      .onGet(`${APPROVAL_API_BASE}/templates/`)
      .replyOnce(200, { data: [{ id: 'id', title: 'name' }] });

    const registry = new ReducerRegistry({}, [thunk, promiseMiddleware]);
    registry.register({
      workflowReducer: applyReducerHash(workflowReducer, workflowsInitialState)
    });
    const storeReal = registry.getStore();

    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={storeReal}>
          <Route path={routes.workflows.index} component={Workflows} />
        </ComponentWrapper>
      );
    });
    wrapper.update();

    expect(wrapper.find(TableEmptyState)).toHaveLength(1);
  });

  it('should select all workflows and delete them', async () => {
    expect.assertions(3);
    const store = mockStore(stateWithWorkflows);
    let wrapper;

    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={store}>
          <Route path={routes.workflows.index} component={Workflows} />
        </ComponentWrapper>
      );
    });
    wrapper.update();
    mockApi
      .onGet(`${APPROVAL_API_BASE}/workflows/?page_size=50&page=1`)
      .replyOnce((req, res) => {
        expect(req.url().query).toEqual({
          page_size: '50',
          page: '1'
        });
        return res.status(200).body({
          count: 3,
          data: []
        });
      });

    await act(async () => {
      wrapper
        .find('input[type="checkbox"]')
        .first()
        .getDOMNode().checked = true;
      wrapper
        .find('input[type="checkbox"]')
        .first()
        .simulate('change', { target: { checked: true } });
    });
    wrapper.update();
    await act(async () => {
      wrapper
        .find('Link#remove-multiple-workflows')
        .simulate('click', { button: 0 });
    });
    wrapper.update();
    expect(wrapper.find('Modal').instance(0).props['aria-label']).toEqual(
      'Delete approval processes modal'
    );
    expect(
      wrapper.find(MemoryRouter).instance().history.location.pathname
    ).toEqual(routes.workflows.remove);
    expect(
      wrapper.find(MemoryRouter).instance().history.location.search
    ).toEqual('');

    wrapper.update();

    await act(async () => {
      wrapper
        .find('button')
        .at(6)
        .simulate('click');
    });
    wrapper.update();
  });

  it('should select and deselect all workflows', async () => {
    let wrapper;
    const store = mockStore(stateWithWorkflows);
    mockApi
      .onGet(
        `/api/pinakes/v1/groups/?role=approval-approver&role=approval-admin`
      )
      .replyOnce(200, { data: [{ id: 'id', name: 'name' }] });
    // Delete endpoints
    mockApi
      .onDelete(`${APPROVAL_API_BASE}/workflows/123/`)
      .replyOnce((_req, res) => {
        expect(true).toEqual(true); // just check that it was called
        return res.status(200);
      });

    mockApi
      .onDelete(`${APPROVAL_API_BASE}/workflows/456/`)
      .replyOnce((_req, res) => {
        expect(true).toEqual(true); // just check that it was called
        return res.status(200);
      });

    mockApi
      .onDelete(`${APPROVAL_API_BASE}/workflows/789/`)
      .replyOnce((_req, res) => {
        expect(true).toEqual(true); // just check that it was called
        return res.status(200);
      });

    // wf refresh
    mockApi
      .onGet(`${APPROVAL_API_BASE}/workflows/?page_size=50&page=1`)
      .replyOnce((req, res) => {
        expect(req.url().query).toEqual({
          page_size: '50',
          page: '1'
        });
        return res.status(200).body({
          count: 0,
          data: []
        });
      });
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={store}>
          <Route path={routes.workflows.index} component={Workflows} />
        </ComponentWrapper>
      );
    });
    wrapper.update();

    expect(
      wrapper
        .find('Link#remove-multiple-workflows')
        .find('button')
        .props().disabled
    ).toEqual(true);

    await act(async () => {
      wrapper
        .find('input[type="checkbox"]')
        .first()
        .getDOMNode().checked = true;
      wrapper
        .find('input[type="checkbox"]')
        .first()
        .simulate('change');
    });
    wrapper.update();

    expect(
      wrapper
        .find('Link#remove-multiple-workflows')
        .find('button')
        .props().disabled
    ).toEqual(false);

    await act(async () => {
      wrapper
        .find('input[type="checkbox"]')
        .first()
        .getDOMNode().checked = false;
      wrapper
        .find('input[type="checkbox"]')
        .first()
        .simulate('change');
    });
    wrapper.update();

    expect(
      wrapper
        .find('Link#remove-multiple-workflows')
        .find('button')
        .props().disabled
    ).toEqual(true);
  });

  it('should select only one workflow and delete it', async () => {
    expect.assertions(3);
    const store = mockStore(stateWithWorkflows);
    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={store}>
          <Route path={routes.workflows.index} component={Workflows} />
        </ComponentWrapper>
      );
    });
    wrapper.update();
    mockApi
      .onGet(
        `${APPROVAL_API_BASE}/groups/?role=approval-approver&role=approval-admin`
      )
      .replyOnce(200, { data: [{ id: 'id', name: 'name' }] });
    await act(async () => {
      wrapper
        .find('input[type="checkbox"]')
        .at(1)
        .simulate('change', { target: { checked: true } });
    });
    wrapper.update();
    await act(async () => {
      wrapper
        .find('Link#remove-multiple-workflows')
        .simulate('click', { button: 0 });
    });
    wrapper.update();

    expect(wrapper.find('Modal').instance(0).props['aria-label']).toEqual(
      'Delete approval process modal'
    );
    expect(
      wrapper.find(MemoryRouter).instance().history.location.pathname
    ).toEqual(routes.workflows.remove);
    expect(
      wrapper.find(MemoryRouter).instance().history.location.search
    ).toEqual('');

    // Delete endpoints
    mockApi
      .onDelete(`${APPROVAL_API_BASE}/workflows/123/`)
      .replyOnce((_req, res) => {
        expect(true).toEqual(true); // just check that it was called
        return res.status(200);
      });
    wrapper.update();
    // wf refresh
    mockApi
      .onGet(`${APPROVAL_API_BASE}/workflows/?page_size=50&page=1`)
      .replyOnce((req, res) => {
        expect(req.url().query).toEqual({
          page_size: '50',
          page: '1'
        });
        return res.status(200).body({
          count: 2,
          data: []
        });
      });
    wrapper.update();
    await act(async () => {
      wrapper
        .find('button')
        .at(6)
        .simulate('click');
    });
  });

  it('reset selected', () => {
    const state = { selectedWorkflows: ['id1', 'id3'], selectedAll: true };
    const expectedResults = {
      ...state,
      selectedAll: false,
      selectedWorkflows: []
    };

    expect(workflowsListState(state, { type: 'resetSelected' })).toEqual(
      expectedResults
    );
  });

  it('select all on current page', () => {
    const state = { selectedWorkflows: ['id1', 'id3'], selectedAll: false };
    const expectedResults = {
      ...state,
      selectedAll: true,
      selectedWorkflows: ['id1', 'id3', 'id2']
    };

    expect(
      workflowsListState(state, {
        type: 'selectAll',
        payload: ['id1', 'id2']
      })
    ).toEqual(expectedResults);
  });

  it('unselect all on current page', () => {
    const state = {
      selectedWorkflows: ['id1', 'id3', 'id2'],
      selectedAll: true
    };
    const expectedResults = {
      ...state,
      selectedAll: false,
      selectedWorkflows: ['id3']
    };

    expect(
      workflowsListState(state, {
        type: 'unselectAll',
        payload: ['id1', 'id2']
      })
    ).toEqual(expectedResults);
  });

  it('all are selected on new page', () => {
    const rows = [{ id: 'id1' }, { id: 'id3' }];

    const state = {
      selectedWorkflows: ['id1', 'id3', 'id2'],
      selectedAll: false
    };
    const expectedResults = { ...state, selectedAll: true, rows };

    expect(
      workflowsListState(state, { type: 'setRows', payload: rows })
    ).toEqual(expectedResults);
  });

  it('not all are selected on new page', () => {
    const rows = [{ id: 'id1' }, { id: 'id4' }];

    const state = {
      selectedWorkflows: ['id1', 'id3', 'id2'],
      selectedAll: false
    };
    const expectedResults = { ...state, selectedAll: false, rows };

    expect(
      workflowsListState(state, { type: 'setRows', payload: rows })
    ).toEqual(expectedResults);
  });

  it('default', () => {
    const state = {
      selectedWorkflows: ['id1', 'id3', 'id2'],
      selectedAll: false
    };
    const expectedResults = { ...state };

    expect(workflowsListState(state, { type: 'default' })).toEqual(
      expectedResults
    );
  });
});
