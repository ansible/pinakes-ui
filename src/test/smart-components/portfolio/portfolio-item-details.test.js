import React from 'react';
import thunk from 'redux-thunk';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store' ;
import { shallowToJson } from 'enzyme-to-json';
import { MemoryRouter } from 'react-router-dom';
import promiseMiddleware from 'redux-promise-middleware';
import { notificationsMiddleware } from '@red-hat-insights/insights-frontend-components/components/Notifications';

import PortfolioItemDetail from '../../../SmartComponents/Portfolio/portfolio-item-detail';
import { ProductLoaderPlaceholder } from '../../../PresentationalComponents/Shared/LoaderPlaceholders';

describe('<PortfolioItemDetail />', () => {
  let initialProps;
  let initialState;
  const middlewares = [ thunk, promiseMiddleware(), notificationsMiddleware() ];
  let mockStore;

  const ComponentWrapper = ({ store, children }) => (
    <Provider store={ store }>
      <MemoryRouter>
        { children }
      </MemoryRouter>
    </Provider>
  );

  beforeEach(() => {
    initialProps = {};
    initialState = {
      portfolioReducer: {
        portfolioItem: {
          id: 123,
          service_offering_source_ref: '123'
        }
      },
      platformReducer: {
        platforms: [{
          id: '123'
        }]
      }
    };
    mockStore = configureStore(middlewares);
  });

  afterEach(() => {
    fetchMock.reset();
  });

  it('should render correctly', () => {
    const wrapper = shallow(<PortfolioItemDetail { ...initialProps } />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('should mount and fetch all data', done => {
    const store = mockStore(initialState);
    const wrapper = mount(
      <ComponentWrapper store={ store }>
        <PortfolioItemDetail { ...initialProps } />
      </ComponentWrapper>
    );
    expect(wrapper.find(ProductLoaderPlaceholder)).toHaveLength(1);
    setImmediate(() => {
      done();
    });
  });
});
