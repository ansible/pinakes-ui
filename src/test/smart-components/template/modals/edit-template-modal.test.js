import React from 'react';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { act } from 'react-dom/test-utils';

import { MemoryRouter, Route } from 'react-router-dom';
import promiseMiddleware from 'redux-promise-middleware';
import notificationsMiddleware from '@redhat-cloud-services/frontend-components-notifications/notificationsMiddleware';
import EditTemplate from '../../../../smart-components/template/edit-template-modal';
import { IntlProvider } from 'react-intl';
import { APPROVAL_API_BASE } from '../../../../utilities/approval-constants';
import * as wfHelper from '../../../../helpers/template/template-helper';
import { Button } from '@patternfly/react-core';
import routes from '../../../../constants/approval-routes';
import { mockApi } from '../../../../helpers/shared/__mocks__/user-login';

describe('<EditTemplate />', () => {
  let initialProps;
  let initialState;
  const middlewares = [thunk, promiseMiddleware, notificationsMiddleware()];
  let mockStore;
  let template;
  let wrapper;
  const postMethod = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: []
    })
  );

  const ComponentWrapper = ({ store, children }) => (
    <IntlProvider locale="en">
      <Provider store={store}>
        <MemoryRouter
          initialEntries={['/templates/edit-template/?template=123']}
          initialIndex={0}
        >
          {children}
        </MemoryRouter>
      </Provider>
    </IntlProvider>
  );

  beforeEach(() => {
    localStorage.setItem('catalog_standalone', true);
    localStorage.setItem('user', 'testUser');
    initialProps = {
      id: '123',
      title: 'Template name',
      postMethod,
      handleChange: jest.fn()
    };

    template = {
      title: 'Foo',
      id: '123',
      description: 'description'
    };

    initialState = {
      templateReducer: {
        templates: [
          {
            ...template
          }
        ]
      },
      template: { ...template }
    };

    mockStore = configureStore(middlewares);
  });

  afterEach(() => {
    global.localStorage.setItem('catalog_standalone', false);
    global.localStorage.removeItem('user');
  });

  it('should fetch data from api and submit the form', async () => {
    mockApi
      .onGet(`${APPROVAL_API_BASE}/templates/123/`)
      .replyOnce(200, { id: '123', description: 'description', title: 'Foo' });

    expect.assertions(7);

    wfHelper.fetchWorkflowByName = jest
      .fn()
      .mockImplementationOnce((value) => {
        expect(value).toEqual('some-name');

        return Promise.resolve({
          data: []
        });
      })
      .mockImplementationOnce((value) => {
        expect(value).toEqual('some-name');

        return Promise.resolve({
          data: []
        });
      });

   jest.useFakeTimers();

    const store = mockStore(initialState);

    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={store}>
          <Route
            path="/templates/edit-template"
            render={() => <EditTemplate {...initialProps} />}
          />
        </ComponentWrapper>
      );
    });
    wrapper.update();

    await act(async () => {
      wrapper.update();
    });

    expect(
      wrapper
        .find('input')
        .first()
        .props().value
    ).toEqual(template.title);
    expect(
      wrapper
        .find('textarea')
        .first()
        .props().value
    ).toEqual(template.description);

    await act(async () => {
      const name = wrapper.find('input').first();
      name.instance().value = 'some-name';
      name.simulate('change');
    });
    wrapper.update();

    await act(async () => {
      jest.advanceTimersByTime(550); // name async validation
      jest.useRealTimers();
    });
    wrapper.update();

    await act(async () => {
      const description = wrapper.find('textarea').first();
      description.instance().value = 'some-description';
      description.simulate('change');
    });
    wrapper.update();

    wfHelper.updateTemplate = jest
      .fn()
      .mockImplementation(() => Promise.resolve('ok'));

    expect(wfHelper.updateTemplate).not.toHaveBeenCalled();

    await act(async () => {
      wrapper.find('form').simulate('submit');
    });
    wrapper.update();

    expect(wfHelper.updateTemplate).toHaveBeenCalledWith({
      ...template,
      title: 'some-name',
      description: 'some-description'
    });

    expect(postMethod).toHaveBeenCalled();

    expect(
      wrapper.find(MemoryRouter).instance().history.location.pathname
    ).toEqual(routes.templates.index);
  });

  it('should close the form', async () => {
    mockApi
      .onGet(`${APPROVAL_API_BASE}/templates/123/`)
      .replyOnce(200, { ...template });

    wfHelper.fetchTemplate = jest.fn().mockImplementation(() =>
      Promise.resolve({
        data: {}
      })
    );

    jest.useFakeTimers();

    const store = mockStore(initialState);

    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={store}>
          <Route
            path="/templates/edit-template"
            render={() => <EditTemplate {...initialProps} />}
          />
        </ComponentWrapper>
      );
    });
    wrapper.update();

    await act(async () => {
      jest.advanceTimersByTime(550); // initial async validation
      jest.useRealTimers();
    });
    wrapper.update();

    await act(async () => {
      wrapper
        .find(Button)
        .first()
        .simulate('click');
    });
    wrapper.update();

    expect(
      wrapper.find(MemoryRouter).instance().history.location.pathname
    ).toEqual(routes.templates.index);
  });
});
