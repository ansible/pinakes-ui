import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter, Route, Switch } from 'react-router-dom';

import CatalogRoute from '../../routing/catalog-route';
import CommonApiError from '../../smart-components/error-pages/common-api-error';
import UserContext from '../../user-context';

describe('<CatalogRoute />', () => {
  it('should redirect to unauthorized page if capabilities is an array and fail', () => {
    const wrapper = mount(
      <UserContext.Provider value={{ permissions: [] }}>
        <MemoryRouter initialEntries={['/protected']}>
          <Switch>
            <CatalogRoute
              path="/protected"
              requiredCapabilities={['protected']}
              userCapabilities={{ protected: false }}
            >
              <div id="behind-protected-route"></div>
            </CatalogRoute>
            <Route path="/401">
              <CommonApiError />
            </Route>
          </Switch>
        </MemoryRouter>
      </UserContext.Provider>
    );
    expect(
      wrapper.find(MemoryRouter).instance().history.location.pathname
    ).toEqual('/401');
    expect(wrapper.find(CommonApiError)).toHaveLength(1);
    expect(wrapper.find('#behind-protected-route')).toHaveLength(0);
  });

  it('should redirect to unauthorized page if capabilities is string and fail', () => {
    const wrapper = mount(
      <UserContext.Provider value={{ permissions: [] }}>
        <MemoryRouter initialEntries={['/protected']}>
          <Switch>
            <CatalogRoute
              path="/protected"
              requiredCapabilities="protected"
              userCapabilities={{ protected: false }}
            >
              <div id="behind-protected-route"></div>
            </CatalogRoute>
            <Route path="/401">
              <CommonApiError />
            </Route>
          </Switch>
        </MemoryRouter>
      </UserContext.Provider>
    );
    expect(
      wrapper.find(MemoryRouter).instance().history.location.pathname
    ).toEqual('/401');
    expect(wrapper.find(CommonApiError)).toHaveLength(1);
    expect(wrapper.find('#behind-protected-route')).toHaveLength(0);
  });

  it('should allow rending route if user has capabilities', () => {
    const wrapper = mount(
      <UserContext.Provider value={{ permissions: [] }}>
        <MemoryRouter initialEntries={['/protected']}>
          <Switch>
            <CatalogRoute
              path="/protected"
              requiredCapabilities="protected"
              userCapabilities={{ protected: true }}
            >
              <div id="behind-protected-route"></div>
            </CatalogRoute>
            <Route path="/401">
              <CommonApiError />
            </Route>
          </Switch>
        </MemoryRouter>
      </UserContext.Provider>
    );
    expect(
      wrapper.find(MemoryRouter).instance().history.location.pathname
    ).toEqual('/protected');
    expect(wrapper.find(CommonApiError)).toHaveLength(0);
    expect(wrapper.find('#behind-protected-route')).toHaveLength(1);
  });

  it('should redirect to unauthorized page if user does not have necessary permissions', () => {
    const wrapper = mount(
      <UserContext.Provider value={{ permissions: [] }}>
        <MemoryRouter initialEntries={['/protected']}>
          <Switch>
            <CatalogRoute
              path="/protected"
              requiredCapabilities="protected"
              userCapabilities={{ protected: true }}
              permissions={['user:needs:permission']}
            >
              <div id="behind-protected-route"></div>
            </CatalogRoute>
            <Route path="/401">
              <CommonApiError />
            </Route>
          </Switch>
        </MemoryRouter>
      </UserContext.Provider>
    );
    expect(
      wrapper.find(MemoryRouter).instance().history.location.pathname
    ).toEqual('/401');
    expect(wrapper.find(CommonApiError)).toHaveLength(1);
    expect(wrapper.find('#behind-protected-route')).toHaveLength(0);
  });

  it('should render page if user has necessary permissions', () => {
    const wrapper = mount(
      <UserContext.Provider
        value={{
          permissions: [
            {
              permission: 'user:needs:permission'
            }
          ]
        }}
      >
        <MemoryRouter initialEntries={['/protected']}>
          <Switch>
            <CatalogRoute
              path="/protected"
              requiredCapabilities="protected"
              userCapabilities={{ protected: true }}
              permissions={['user:needs:permission']}
            >
              <div id="behind-protected-route"></div>
            </CatalogRoute>
            <Route path="/401">
              <CommonApiError />
            </Route>
          </Switch>
        </MemoryRouter>
      </UserContext.Provider>
    );
    expect(
      wrapper.find(MemoryRouter).instance().history.location.pathname
    ).toEqual('/protected');
    expect(wrapper.find(CommonApiError)).toHaveLength(0);
    expect(wrapper.find('#behind-protected-route')).toHaveLength(1);
  });
});
