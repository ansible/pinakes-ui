import React from 'react';
import thunk from 'redux-thunk';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store' ;
import { Modal } from '@patternfly/react-core';
import { shallowToJson } from 'enzyme-to-json';
import { MemoryRouter, Route } from 'react-router-dom';
import promiseMiddleware from 'redux-promise-middleware';
import { componentTypes } from '@data-driven-forms/react-form-renderer';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications/';
import { APPROVAL_API_BASE } from '../../../utilities/constants';
import FormRenderer from '../../../smart-components/common/form-renderer';
import EditApprovalWorkflow from '../../../smart-components/common/edit-approval-workflow';

describe('<EditApprovalWorkflow />', () => {
  let initialProps;
  let initialState;
  const middlewares = [ thunk, promiseMiddleware(), notificationsMiddleware() ];
  let mockStore;
  const ComponentWrapper = ({ store, children, portfolioId }) => (
    <Provider store={ store }>
      <MemoryRouter initialEntries={ [ `portfolios/${portfolioId}` ] }>
        { children }
      </MemoryRouter>
    </Provider>
  );

  beforeEach(() => {
    initialProps = {
      fetchWorkflows: jest.fn(),
      closeUrl: 'foo',
      objectType: 'Portfolio',
      workflows: [{ name: 'workflow', id: '123' }]
    };
    initialState = {
      approvalReducer: {
        workflows: [{
          label: 'foo',
          value: 'bar'
        }]
      }
    };
    mockStore = configureStore(middlewares);
  });

  it('should render correctly', () => {
    const store = mockStore({});
    apiClientMock.get(`${APPROVAL_API_BASE}/workflows`, mockOnce({ body: { data: []}}));
    const wrapper = shallow(<ComponentWrapper store={ store }><EditApprovalWorkflow { ...initialProps } /></ComponentWrapper>).dive();

    setImmediate(() => {
      expect(shallowToJson(wrapper)).toMatchSnapshot();
    });
  });

  it('should create the edit workflow modal', done => {
    const store = mockStore(initialState);

    apiClientMock.get(`${APPROVAL_API_BASE}/workflows`, mockOnce({
      body: {
        data: [{
          name: 'workflow',
          id: '123'
        }]
      }
    }));
    apiClientMock.post(`${APPROVAL_API_BASE}/workflows/resolve`, mockOnce({ body: { name: 'workflow', id: '123' }}));

    const expectedSchema = {
      fields: [{
        component: componentTypes.SELECT,
        name: 'workflow',
        label: 'Approval workflow',
        loadOptions: expect.any(Function),
        isSearchable: true,
        isClearable: true
      }]
    };

    const wrapper = mount(
      <ComponentWrapper store={ store } portfolioId="123">
        <Route path="portfolios/:id?" render={ () => <EditApprovalWorkflow { ...initialProps } match={ { params: { id: '123' }} } /> }/>
      </ComponentWrapper>
    );

    setImmediate(() => {
      const modal = wrapper.find(Modal);
      const form = wrapper.find(FormRenderer);
      expect(modal.props().title).toEqual('Set approval workflow');
      expect(form.props().schema).toEqual(expectedSchema);
      done();
    });
  });
});
