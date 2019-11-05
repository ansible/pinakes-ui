import React from 'react';
import configureStore from 'redux-mock-store' ;
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications/';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Platform from '../../../smart-components/platform/platform';
import { platformInitialState } from '../../../redux/reducers/platform-reducer';

describe('<Platform />', () => {
  let initialProps;
  const middlewares = [ thunk, promiseMiddleware(), notificationsMiddleware() ];
  let mockStore;
  let intialState;

  beforeEach(() => {
    initialProps = {
      match: {
        params: {
          id: 1
        }
      }
    };
    mockStore = configureStore(middlewares);
    intialState = {
      platformReducer: {
        ...platformInitialState,
        selectedPlatform: {
          id: '1',
          name: 'Foo'
        },
        platformItems: {
          1: {
            meta: {
              limit: 50,
              offset: 0,
              count: 0
            }
          }
        }
      }
    };
  });

  it('should render correctly', () => {
    const wrapper = shallow(<Platform store={ mockStore(intialState) } { ...initialProps } />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
