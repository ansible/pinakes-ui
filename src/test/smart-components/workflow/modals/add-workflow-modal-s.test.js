import React from 'react';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store' ;
import { act } from 'react-dom/test-utils';

import { MemoryRouter, Route } from 'react-router-dom';
import promiseMiddleware from 'redux-promise-middleware';
import notificationsMiddleware from '@redhat-cloud-services/frontend-components-notifications/notificationsMiddleware';
import AddWorkflow from '../../../../smart-components/workflow/add-workflow-modal';
import { IntlProvider } from 'react-intl';
import { APPROVAL_API_BASE } from '../../../../utilities/constants';
import * as wfHelper from '../../../../helpers/workflow/workflow-helper-s';
import { Button } from '@patternfly/react-core';
import routes from '../../../../constants/routes';

localStorage.setItem('catalog_standalone', true);
localStorage.setItem('user', 'testUser');

describe('<AddWorkflow />', () => {
  let initialProps;
  let initialState;
  const middlewares = [ thunk, promiseMiddleware, notificationsMiddleware() ];
  let mockStore;
  localStorage.setItem('catalog_standalone', true);
  localStorage.setItem('user', 'testUser');

  const ComponentWrapper = ({ store, children }) => (
    <IntlProvider locale="en">
      <Provider store={ store }>
        <MemoryRouter initialEntries={ [ '/workflows/add-workflow/' ] } initialIndex={ 0 }>
          { children }
        </MemoryRouter>
      </Provider>
    </IntlProvider>
  );

  beforeEach(() => {
    initialProps = {
      id: '123',
      postMethod: jest.fn(),
      handleChange: jest.fn()
    };
    initialState = {};
    mockStore = configureStore(middlewares);
    localStorage.setItem('catalog_standalone', true);
    localStorage.setItem('user', 'testUser');
  });

  it('should submit the form', async () => {
    expect.assertions(4);

    apiClientMock.get(`${APPROVAL_API_BASE}/groups/?role=approval-approver&role=approval-admin`,
      mockOnce({ body: { results: [{ uuid: 'id', name: 'name' }]}}));

    apiClientMock.get(`${APPROVAL_API_BASE}/workflows/?filter%5Bname%5D%5Bcontains_i%5D=some-name&limit=50&offset=0`,
      mockOnce({ body: { results: []}}));
    apiClientMock.get(`${APPROVAL_API_BASE}/workflows/?filter%5Bname%5D%5Bcontains_i%5D=&limit=50&offset=0`,
      mockOnce({ body: { results: []}}));

    jest.useFakeTimers();

    const store = mockStore(initialState);
    const wrapper = mount(
      <ComponentWrapper store={ store }>
        <Route path="/workflows/add-workflow/" render={ () => <AddWorkflow { ...initialProps } /> } />
      </ComponentWrapper>
    );

    await act(async () => {
      jest.advanceTimersByTime(550); // initial async validation
    });
    wrapper.update();

    await act(async () => {
      const name = wrapper.find('input').first();
      name.instance().value = 'some-name';
      name.simulate('change');
    });
    wrapper.update();

    await act(async () => {
      jest.advanceTimersByTime(550); // name async validaton
    });
    wrapper.update();

    jest.useRealTimers();

    await act(async () => {
      const description = wrapper.find('textarea').first();
      description.instance().value = 'some-description';
      description.simulate('change');
    });
    wrapper.update();

    wfHelper.addWorkflow = jest.fn().mockImplementation(() => Promise.resolve('ok'));

    expect(wfHelper.addWorkflow).not.toHaveBeenCalled();

    await act(async () => {
      wrapper.find('form').simulate('submit');
    });
    wrapper.update();

    expect(wfHelper.addWorkflow).toHaveBeenCalledWith({
      group_refs: [],
      name: 'some-name',
      description: 'some-description'
    });
    expect(initialProps.postMethod).toHaveBeenCalled();
    expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(routes.workflows.index);
  });

  it('should close the form', async () => {
    localStorage.setItem('catalog_standalone', true);
    localStorage.setItem('user', 'testUser');

    apiClientMock.get(`${APPROVAL_API_BASE}/groups/?role=approval-approver&role=approval-admin`,
      mockOnce({ body: { data: [{ uuid: 'id', name: 'name' }]}}));
    apiClientMock.get(`${APPROVAL_API_BASE}/workflows/?filter%5Bname%5D%5Bcontains_i%5D=some-name&limit=50&offset=0`,
      mockOnce({ body: { results: []}}));
    apiClientMock.get(`${APPROVAL_API_BASE}/workflows/?filter%5Bname%5D%5Bcontains_i%5D=&limit=50&offset=0`,
      mockOnce({ body: { results: []}}));

    jest.useFakeTimers();

    const store = mockStore(initialState);

    const wrapper = mount(
      <ComponentWrapper store={ store }>
        <Route path="/workflows/add-workflow/" render={ () => <AddWorkflow { ...initialProps } /> } />
      </ComponentWrapper>
    );

    await act(async () => {
      jest.advanceTimersByTime(550); // initial async validation
    });
    wrapper.update();

    jest.useRealTimers();

    await act(async () => {
      wrapper.find(Button).first().simulate('click');
    });
    wrapper.update();
    expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(routes.workflows.index);
  });
});
