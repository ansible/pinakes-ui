import React from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import promiseMiddleware from 'redux-promise-middleware';
import { MemoryRouter, Route } from 'react-router-dom';
import thunk from 'redux-thunk';
import notificationsMiddleware from '@redhat-cloud-services/frontend-components-notifications/notificationsMiddleware';
import ReactJsonView from 'react-json-view';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';

import ServiceOfferingDetail from '../../../../smart-components/platform/service-offering/service-offering-detail';
import {
  CATALOG_INVENTORY_API_BASE,
  SOURCES_API_BASE
} from '../../../../utilities/constants';
import { Text, Breadcrumb } from '@patternfly/react-core';
import { mockApi } from '../../../../helpers/shared/__mocks__/user-login';

describe('<ServiceOfferingDetail />', () => {
  const middlewares = [thunk, promiseMiddleware, notificationsMiddleware()];
  let mockStore;

  const ComponentWrapper = ({ store, children, ...props }) => (
    <Provider store={store}>
      <MemoryRouter {...props}>{children}</MemoryRouter>
    </Provider>
  );

  beforeEach(() => {
    mockStore = configureStore(middlewares);
  });

  it('should mount and request data', async () => {
    const store = mockStore({
      breadcrumbsReducer: {
        fragments: [
          {
            pathname: '/platforms',
            title: 'Platforms',
            searchParams: {}
          },
          {
            pathname: '/platform',
            title: 'Source name',
            searchParams: {
              source: '352'
            }
          },
          {
            pathname: '/platform/service-offering',
            title: 'Name',
            searchParams: {
              source: '352',
              service: '2266193'
            }
          }
        ]
      },
      platformReducer: {
        serviceOffering: {
          service: {
            id: '2266193',
            name: 'Name',
            description: 'Description',
            create_at: 'now',
            extra: { foo: 'bar' }
          },
          source: {
            id: '352',
            icon_url: '/icon/url',
            name: 'Source name'
          }
        }
      }
    });

    mockApi
      .onGet(`${CATALOG_INVENTORY_API_BASE}/service_offerings/2266193`)
      .replyOnce(200, {
        id: '2266193',
        name: 'Name',
        description: 'Description',
        create_at: 'now',
        extra: { foo: 'bar' }
      });
    mockApi.onGet(`${SOURCES_API_BASE}/sources/352`).replyOnce(200, {
      id: '352',
      source_type_id: 'source-type-id',
      name: 'Source name'
    });
    mockApi
      .onGet(`${SOURCES_API_BASE}/source_types/source-type-id`)
      .replyOnce(200, { id: 'source-type-id', icon_url: '/icon/url' });
    let wrapper;

    await act(async () => {
      wrapper = mount(
        <ComponentWrapper
          store={store}
          initialEntries={[
            '/platform/service-offerings?service=2266193&source=352'
          ]}
        >
          <Route path="/platform/service-offerings">
            <ServiceOfferingDetail />
          </Route>
        </ComponentWrapper>
      );
    });
    wrapper.update();
    expect(wrapper.find(ReactJsonView)).toHaveLength(1);
    expect(wrapper.find(Text)).toHaveLength(11);
    expect(wrapper.find(Breadcrumb)).toHaveLength(1);
  });
});
