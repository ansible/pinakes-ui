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
      approvalReducer: {
        isFetching: false,
        isResolving: false,
        resolvedWorkflows: [],
        workflows: []
      },
      breadcrumbsReducer: {
        fragments: []
      },
      i18nReducer: {
        formatMessage: {}
      },
      notifications: [],
      openApiReducer: {},
      orderProcessReducer: {
        filterValue: '',
        isLoading: false,
        orderProcesses: {
          data: [],
          meta: {
            count: 0,
            limit: 50,
            offset: 0
          }
        },
        sortBy: {
          direction: 'asc',
          index: 0,
          property: 'name'
        }
      },
      orderReducer: {
        isLoading: false,
        orderDetail: {
          order: {},
          platform: {},
          portfolio: {},
          portfolioItem: {}
        },
        orders: {
          data: [],
          meta: {
            count: 0,
            filter: '',
            limit: 50,
            offset: 0
          }
        },
        requests: [],
        selectedPlan: {},
        serviceData: {},
        servicePlans: []
      },
      platformReducer: {
        filterValue: '',
        isPlatformDataLoading: false,
        platform: {},
        platformIconMapping: {},
        platformInventories: {
          meta: {
            count: 0,
            filter: '',
            limit: 50,
            offset: 0
          }
        },
        platformItem: {},
        platformItems: {},
        platforms: [],
        selectedPlatform: {},
        serviceOffering: {
          service: {},
          source: {}
        },
        sourceTypeIcons: {}
      },
      portfolioReducer: {
        filterValue: '',
        isLoading: false,
        portfolio: {},
        portfolioItem: {
          portfolioItem: {
            metadata: {
              statistics: {},
              user_capabilities: {}
            }
          }
        },
        portfolioItems: {
          data: [],
          meta: {
            filter: '',
            limit: 50,
            offset: 0
          }
        },
        portfolios: {
          data: [],
          meta: {
            limit: 50,
            offset: 0
          }
        },
        selectedPortfolio: {
          metadata: {
            statistics: {},
            user_capabilities: {}
          }
        }
      },
      rbacReducer: {
        isLoading: false,
        rbacGroups: []
      },
      shareReducer: {
        isLoading: false,
        shareInfo: []
      }
    };
    expect(wrapper.props().store.getState()).toEqual(expectedState);
  });
});
