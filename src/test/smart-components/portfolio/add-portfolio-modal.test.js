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

import { APPROVAL_API_BASE, CATALOG_API_BASE } from '../../../utilities/constants';
import FormRenderer from '../../../smart-components/common/form-renderer';
import AddPortfolioModal from '../../../smart-components/portfolio/add-portfolio-modal';

describe('<AddPortfolioModal />', () => {
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

    };
    initialState = {
      approvalReducer: {
        workflows: [{
          label: 'foo',
          value: 'bar'
        }]
      },
      portfolioReducer: {
        portfolios: { data: [{
          id: '123',
          name: 'Portfolio'
        }]}
      }
    };
    mockStore = configureStore(middlewares);
  });

  it('should render correctly', () => {
    const store = mockStore({});
    apiClientMock.get(`${APPROVAL_API_BASE}/workflows`, mockOnce({ body: { data: []}}));
    const wrapper = shallow(<ComponentWrapper store={ store }><AddPortfolioModal { ...initialProps } /></ComponentWrapper>).dive();

    setImmediate(() => {
      expect(shallowToJson(wrapper)).toMatchSnapshot();
    });
  });

  it('should create edit variant of portfolio modal', done => {
    const store = mockStore(initialState);

    apiClientMock.get(`${APPROVAL_API_BASE}/workflows`, mockOnce({
      body: {
        data: [{
          name: 'workflow',
          id: '123'
        }]
      }
    }));

    const expectedSchema = {
      fields: [{
        component: componentTypes.TEXT_FIELD,
        isRequired: true,
        label: 'Portfolio Name',
        name: 'name',
        validate: [ expect.any(Function) ]
      }, {
        component: componentTypes.TEXTAREA,
        label: 'Description',
        name: 'description'
      }, {
        component: componentTypes.SELECT,
        label: 'Approval workflow',
        name: 'workflow_ref',
        options: [
          {
            label: 'foo',
            value: 'bar'
          }
        ]
      }]
    };

    const wrapper = mount(
      <ComponentWrapper store={ store } portfolioId="123">
        <Route path="portfolios/:id?" render={ () => <AddPortfolioModal { ...initialProps } match={ { params: { id: '123' }} } /> }/>
      </ComponentWrapper>
    );

    setImmediate(() => {
      const modal = wrapper.find(Modal);
      const form = wrapper.find(FormRenderer);
      expect(modal.props().title).toEqual('Edit portfolio');
      expect(form.props().schema).toEqual(expectedSchema);
      done();
    });
  });

  it('should create edit variant of portfolio modal and call updatePortfolio on submit', () => {
    const store = mockStore(initialState);

    apiClientMock.patch(`${CATALOG_API_BASE}/portfolios/123`, ((req, res) => {
      expect(JSON.parse(req.body())).toEqual({ id: '123', name: 'Portfolio', workflow_ref: null });
      return res.body(200);
    }));

    apiClientMock.get(`${APPROVAL_API_BASE}/workflows`, mockOnce({ body: {
      data: [{
        label: 'foo',
        value: 'bar'
      }]
    }}));

    const wrapper = mount(
      <ComponentWrapper store={ store } portfolioId="123">
        <Route
          path="portfolios/:id?"
          render={ () => <AddPortfolioModal { ...initialProps } match={ { params: { id: '123' }} }/> }
        />
      </ComponentWrapper>
    );

    const button = wrapper.find('button').last();
    button.simulate('click');
  });
});
