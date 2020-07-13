import React from 'react';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Breadcrumb, BreadcrumbItem } from '@patternfly/react-core';

import CatalogBreadcrumbs from '../../../smart-components/common/catalog-breadcrumbs';
import { MemoryRouter } from 'react-router-dom';

describe('<CatalogBreadcrumbs />', () => {
  const mockStore = configureStore([thunk]);

  it('should not render anything', () => {
    const store = mockStore({ breadcrumbsReducer: { fragments: [{}] } });
    const wrapper = mount(
      <Provider store={store}>
        <CatalogBreadcrumbs />
      </Provider>
    );
    expect(wrapper.find(Breadcrumb)).toHaveLength(0);
  });

  it('should render two conditional links', () => {
    const store = mockStore({
      breadcrumbsReducer: {
        fragments: [
          {
            title: 'First',
            pathname: '/first'
          },
          {
            title: 'Second',
            pathname: '/first/second'
          }
        ]
      }
    });
    const wrapper = mount(
      <MemoryRouter>
        <Provider store={store}>
          <CatalogBreadcrumbs />
        </Provider>
      </MemoryRouter>
    );
    expect(wrapper.find(Breadcrumb)).toHaveLength(1);
    expect(wrapper.find(BreadcrumbItem)).toHaveLength(2);
    expect(
      wrapper
        .find(BreadcrumbItem)
        .last()
        .props()
    ).toEqual({ children: 'Second', isActive: true, showDivider: true });
  });
});
