import React from 'react';
import configureStore from 'redux-mock-store' ;
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import { MemoryRouter } from 'react-router-dom';
import { notificationsMiddleware } from '@red-hat-insights/insights-frontend-components/components/Notifications';
import { mount, shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Platform from '../../../SmartComponents/Platform/Platform';
import { TOPOLOGICAL_INVENTORY_API_BASE } from '../../../Utilities/Constants';
import { platformInitialState } from '../../../redux/reducers/platformReducer';
import PlatformItem from '../../../presentational-components/platform/platform-item';
import { mockBreacrumbsStore } from '../../redux/redux-helpers';

describe('<Platform />', () => {
  let initialProps;
  const middlewares = [ thunk, promiseMiddleware(), notificationsMiddleware() ];
  let mockStore;
  let intiailState;

  beforeEach(() => {
    initialProps = {
      match: {
        params: {
          id: 1
        }
      }
    };
    mockStore = configureStore(middlewares);
    intiailState = {
      platformReducer: { ...platformInitialState }
    };
  });

  afterEach(() => {
    fetchMock.reset();
  });

  it('should render correctly', () => {
    const wrapper = shallow(<Platform store={ mockStore(intiailState) } { ...initialProps } />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('should mount and fetch data after mount and after source change', (done) => {
    const Provider = mockBreacrumbsStore();
    expect.assertions(3);
    apiClientMock.get(`${TOPOLOGICAL_INVENTORY_API_BASE}/sources/1`, mockOnce({ body: { name: 'Foo' }}));
    apiClientMock.get(`${TOPOLOGICAL_INVENTORY_API_BASE}/sources/2`, mockOnce({ body: { name: 'Foo' }}));

    fetchMock.getOnce(`${TOPOLOGICAL_INVENTORY_API_BASE}/sources/1/service_offerings?archived_at=&limit=50&offset=0`, {
      data: [{ id: 111 }]});

    fetchMock.getOnce(`${TOPOLOGICAL_INVENTORY_API_BASE}/sources/2/service_offerings?archived_at=&limit=50&offset=0`, {
      data: [{ id: 111 }]});
    const Root = props => <Provider><MemoryRouter><Platform store={ mockStore(intiailState) } { ...props } /></MemoryRouter></Provider>;
    const wrapper = mount(<Root { ...initialProps } />);
    wrapper.setProps({ match: { params: { id: 2 }}});
    wrapper.update();
    setImmediate(() => {
      expect(fetchMock.calls()).toHaveLength(2);
      expect(fetchMock.calls()[0][0]).toEqual(`${TOPOLOGICAL_INVENTORY_API_BASE}/sources/1/service_offerings?archived_at=&limit=50&offset=0`);
      expect(fetchMock.lastCall()[0]).toEqual(`${TOPOLOGICAL_INVENTORY_API_BASE}/sources/2/service_offerings?archived_at=&limit=50&offset=0`);
      done();
    });
  });

  /**
   * issues with promisses
   */
  it('should filter platforms correctly', (done) => {
    const stateWithItems = {
      platformReducer: {
        ...intiailState.platformReducer,
        selectedPlatform: {
          id: '11',
          name: 'Foo'
        },
        platforms: [{
          id: '11',
          name: 'Foo'
        }],
        platformItems: {
          11: {
            data: [
              { id: '111', name: 'Platform item 1', description: 'description 1' },
              { id: '222', name: 'Platform item 2', description: 'description 1' }
            ],
            limit: 50
          }
        }
      }
    };
    const Provider = mockBreacrumbsStore(stateWithItems);

    apiClientMock.get(`${TOPOLOGICAL_INVENTORY_API_BASE}/sources/11`, mockOnce({ body: { name: 'Foo', id: '11' }}));
    apiClientMock.get(`${TOPOLOGICAL_INVENTORY_API_BASE}/sources/1`, mockOnce({ body: { name: 'Foo', id: '11' }}));
    fetchMock.getOnce(`${TOPOLOGICAL_INVENTORY_API_BASE}/sources/11/service_offerings?archived_at=&limit=50&offset=0`, {
      data: [{ id: 111, name: 'Platform item 1', description: 'description 1' }, { id: 2, name: 'Platform item 2', description: 'description 2' }],
      meta: {
        count: 2,
        limit: 50,
        offset: 0
      }
    });
    fetchMock.getOnce(`${TOPOLOGICAL_INVENTORY_API_BASE}/sources/1/service_offerings?archived_at=&limit=50&offset=0`, {
      data: []
    });

    const Root = props => <Provider><MemoryRouter><Platform { ...props } /></MemoryRouter></Provider>;
    const wrapper = mount(<Root { ...initialProps } />);
    setImmediate(() => {
      wrapper.setProps({ platformItems: [
        { id: '111', name: 'Platform item 1', description: 'description 1' },
        { id: '222', name: 'Platform item 2', description: 'description 1' }
      ]});
      expect(wrapper.find(PlatformItem)).toHaveLength(2);
      const search = wrapper.find('input').first();
      search.getDOMNode().value = 'item 1';
      search.simulate('change');
      wrapper.update();
      expect(wrapper.find(Platform).children().instance().state.filterValue).toEqual('item 1');
      expect(wrapper.find(PlatformItem)).toHaveLength(1);
      done();
    });
  });
});
