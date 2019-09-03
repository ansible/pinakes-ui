import React from 'react';
import { act } from 'react-dom/test-utils';
import thunk from 'redux-thunk';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store' ;
import { MemoryRouter, Route } from 'react-router-dom';
import promiseMiddleware from 'redux-promise-middleware';
import ReactFormRender from '@data-driven-forms/react-form-renderer';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications/';

import FormRenderer from '../../../smart-components/common/form-renderer';
import { CATALOG_API_BASE, RBAC_API_BASE } from '../../../utilities/constants';
import SharePortfolioModal from '../../../smart-components/portfolio/share-portfolio-modal';

describe('<SharePortfolioModal', () => {
  let initialProps;
  let initialState;
  const middlewares = [ thunk, promiseMiddleware(), notificationsMiddleware() ];
  let mockStore;

  const ComponentWrapper = ({ store, children, initialEntries }) => (
    <Provider store={ store }>
      <MemoryRouter initialEntries={ initialEntries }>
        { children }
      </MemoryRouter>
    </Provider>
  );

  beforeEach(() => {
    initialProps = {
      addNotification: jest.fn(),
      portfolioId: '123',
      closeUrl: '/foo'
    };
    initialState = {
      portfolioReducer: {
        portfolios: { data: [{
          id: '123',
          name: 'Portfolio 1'
        }]}
      },
      shareReducer: {
        shareInfo: [{
          group_name: 'share info 1',
          permissions: [ 'all', 'nothing' ]
        }],
        isLoading: false
      },
      rbacReducer: {
        rbacGroups: [{
          value: 1,
          label: 'Group 1'
        }, {
          value: 2,
          label: 'Group 2'
        }]
      }
    };
    mockStore = configureStore(middlewares);
  });

  it('should mount and load data', async (done) => {
    const store = mockStore(initialState);

    apiClientMock.get(`${CATALOG_API_BASE}/portfolios/123/share_info`, mockOnce({ body: { data: {}}}));
    apiClientMock.get(`${RBAC_API_BASE}/groups/`, mockOnce({ body: { data: []}}));

    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={ store } initialEntries={ [ '/portfolio/123' ] }>
          <Route path="/portfolio/:id" render={ args => <SharePortfolioModal { ...args } { ...initialProps } /> }/>
        </ComponentWrapper>
      );
    });

    setImmediate(() => {
      wrapper.update();
      expect(wrapper.find(SharePortfolioModal)).toHaveLength(1);
      expect(wrapper.find(FormRenderer)).toHaveLength(1);
      done();
    });
  });

  it('should submit share data', async (done) => {
    expect.assertions(3);
    const store = mockStore(initialState);

    /**
     * download data endpoints
     */
    apiClientMock.get(`${CATALOG_API_BASE}/portfolios/123/share_info`, mockOnce({ body: { data: {}}}));
    apiClientMock.get(`${RBAC_API_BASE}/groups/`, mockOnce({ body: { data: []}}));

    /**
     * submit data endpoints
     */
    apiClientMock.post(`${CATALOG_API_BASE}/portfolios/123/share`, mockOnce((req, res) => {
      expect(JSON.parse(req.body())).toEqual({
        permissions: [ 'all' ],
        group_uuids: [ '123' ]
      });
      return res.status(200);
    }));
    apiClientMock.post(`${CATALOG_API_BASE}/portfolios/123/unshare`, mockOnce((req, res) => {
      expect(JSON.parse(req.body())).toEqual({
        permissions: [ 'catalog:portfolios:write' ],
        group_uuids: [ null ]
      });
      return res.status(200);
    }));
    apiClientMock.get(`${CATALOG_API_BASE}/portfolios`, mockOnce((req, res) => {
      expect(req).toBeTruthy();
      return res.status(200).body({
        data: []
      });
    }));
    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={ store } initialEntries={ [ '/portfolio/123' ] }>
          <Route path="/portfolio/:id" render={ (args) => <SharePortfolioModal { ...args } { ...initialProps } /> }/>
        </ComponentWrapper>
      );
    });

    setImmediate(async () => {
      wrapper.update();
      const form = wrapper.find(ReactFormRender).children().instance().form;
      /*
      * simulate form changes
      * group_uuid
      * permissions
      */

      form.change('group_uuid', '123');
      form.change('permissions', 'all');
      await act(async () => {
        wrapper.find(ReactFormRender).find('button').last().simulate('click');
      });
      setImmediate(() => {
        done();
      });
    });
  });
});
