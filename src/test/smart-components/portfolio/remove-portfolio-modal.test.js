import React from 'react';
import thunk from 'redux-thunk';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store' ;
import { shallowToJson } from 'enzyme-to-json';
import { MemoryRouter, Route } from 'react-router-dom';
import promiseMiddleware from 'redux-promise-middleware';
import { notificationsMiddleware, ADD_NOTIFICATION } from '@red-hat-insights/insights-frontend-components/components/Notifications';

import RemovePortfolioModal from '../../../SmartComponents/Portfolio/remove-portfolio-modal';
import { CATALOG_API_BASE } from '../../../Utilities/Constants';
import { REMOVE_PORTFOLIO, FETCH_PORTFOLIOS } from '../../../redux/action-types';

describe('<RemovePortfolioModal />', () => {
  let initialProps;
  let initialState;
  const middlewares = [ thunk, promiseMiddleware(), notificationsMiddleware() ];
  let mockStore;

  const ComponentWrapper = ({ store, children }) => (
    <Provider store={ store }>
      <MemoryRouter initialEntries={ [ '/foo', '/foo/123', '/foo' ] } initialIndex={ 1 }>
        { children }
      </MemoryRouter>
    </Provider>
  );

  beforeEach(() => {
    initialProps = {
      id: '123'
    };
    initialState = {
      portfolioReducer: {
        portfolios: [{
          id: '123'
        }]
      }
    };
    mockStore = configureStore(middlewares);
  });

  it('should render correctly', () => {
    const wrapper = shallow(<RemovePortfolioModal { ...initialProps } />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('should call cancel action', () => {
    const store = mockStore(initialState);
    const wrapper = mount(
      <ComponentWrapper store={ store }>
        <Route path="/foo/:id" render={ (...args) => <RemovePortfolioModal { ...args } { ...initialProps } /> } />
      </ComponentWrapper>
    );
    wrapper.find('button').first().simulate('click');
    expect(wrapper.find(MemoryRouter).children().props().history.location.pathname).toEqual('/foo');
  });

  it('should call remove action', (done) => {
    expect.assertions(3);
    const store = mockStore(initialState);

    apiClientMock.delete(`${CATALOG_API_BASE}/portfolios/123`, mockOnce((req, res) => {
      expect(req).toBeTruthy();
      return res.status(200);
    }));

    apiClientMock.get(`${CATALOG_API_BASE}/portfolios`, mockOnce((req, res) => {
      expect(req).toBeTruthy();
      return res.status(200).body({ data: []});
    }));

    const wrapper = mount(
      <ComponentWrapper store={ store }>
        <Route path="/foo/:id" render={ (...args) => <RemovePortfolioModal { ...args } { ...initialProps } /> } />
      </ComponentWrapper>
    );
    const expectedActions = [{
      type: `${REMOVE_PORTFOLIO}_PENDING`,
      meta: expect.any(Object)
    }, expect.objectContaining({
      type: ADD_NOTIFICATION,
      payload: expect.objectContaining({ variant: 'success' })
    }), expect.objectContaining({
      type: `${REMOVE_PORTFOLIO}_FULFILLED`
    }), expect.objectContaining({
      type: `${FETCH_PORTFOLIOS}_PENDING`
    }), expect.objectContaining({
      type: `${FETCH_PORTFOLIOS}_FULFILLED`,
      payload: []
    }) ];

    wrapper.find('button').last().simulate('click');
    setImmediate(() => {
      expect(store.getActions()).toEqual(expectedActions);
      done();
    });
  });
});
