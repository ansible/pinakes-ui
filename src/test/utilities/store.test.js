import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';

import store from '../../utilities/store';

describe('redux store', () => {
  it('should create redux store context', () => {
    const wrapper = mount(
      <Provider store={store()}>
        <div>Foo</div>
      </Provider>
    );
    const expectedState = {
      breadcrumbsReducer: expect.any(Object),
      orderReducer: expect.any(Object),
      platformReducer: expect.any(Object),
      orderProcessReducer: expect.any(Object),
      portfolioReducer: expect.any(Object),
      approvalReducer: expect.any(Object),
      rbacReducer: expect.any(Object),
      shareReducer: expect.any(Object),
      groupReducer: expect.any(Object),
      requestReducer: expect.any(Object),
      workflowReducer: expect.any(Object),
      templateReducer: expect.any(Object),
      notificationSettingsReducer: expect.any(Object),
      notifications: expect.any(Object),
      openApiReducer: expect.any(Object),
      i18nReducer: expect.any(Object)
    };
    expect(wrapper.props().store.getState()).toEqual(expectedState);
  });
});
