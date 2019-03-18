import React from 'react';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import configureStore from 'redux-mock-store' ;
import { shallowToJson } from 'enzyme-to-json';
import { MemoryRouter } from 'react-router-dom';
import promiseMiddleware from 'redux-promise-middleware';
import { orderInitialState } from '../../../redux/reducers/orderReducer';
import { notificationsMiddleware } from '@red-hat-insights/insights-frontend-components/components/Notifications';

import OrderModal from '../../../SmartComponents/Common/OrderModal';
import { CATALOG_API_BASE } from '../../../Utilities/Constants';

const dummySchema = {
  create_json_schema: {
    type: 'object',
    $schema: 'http://json-schema.org/draft-04/schema',
    properties: {
      NAMESPACE: {
        type: 'string',
        title: 'Jenkins ImageStream Namespace',
        default: 'openshift',
        description: 'The OpenShift Namespace where the Jenkins ImageStream resides.'
      },
      ENABLE_OAUTH: {
        type: 'string',
        title: 'Enable OAuth in Jenkins',
        default: 'true',
        description: 'Whether to enable OAuth OpenShift integration. If false, the static account \'admin\' will be initialized with the password \'password\'.'
      },
      MEMORY_LIMIT: {
        type: 'string',
        title: 'Memory Limit',
        default: '512Mi',
        description: 'Maximum amount of memory the container can use.'
      }
    },
    additionalProperties: false
  }
};

describe('<OrderModal />', () => {
  let initialProps;
  const middlewares = [ thunk, promiseMiddleware(), notificationsMiddleware() ];
  let mockStore;
  let initialState;

  const OrderWrapper = ({ store, children }) => (
    <Provider store={ store }>
      <MemoryRouter>
        { children }
      </MemoryRouter>
    </Provider>
  );

  beforeEach(() => {
    initialProps = {
      closeUrl: '/close',
      serviceData: {
        name: 'Foo',
        id: '1'
      }
    };
    mockStore = configureStore(middlewares);
    initialState = {
      orderReducer: {
        ...orderInitialState,
        serviceData: {
          name: 'Foo',
          id: '1'
        }
      }
    };
  });

  it('should render correctly', () => {
    const wrapper = shallow(<OrderModal { ...initialProps } />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('should proceed to order', (done) => {
    const store = mockStore(initialState);
    const wrapper = mount(<OrderWrapper store={ store }><OrderModal { ...initialProps } /></OrderWrapper>);

    // mock api calls
    apiClientMock.get(`${CATALOG_API_BASE}/portfolio_items/1/service_plans`, mockOnce({
      body: [ dummySchema ]
    }));

    fetchMock.getOnce(`${CATALOG_API_BASE}/portfolio_items/1/provider_control_parameters`, {
      required: [ 'namespace' ],
      type: 'object',
      properties: {
        namespace: {
          title: 'Namespace',
          enum: [ '1', '2', '3', '4' ]
        }
      }
    });

    //go to next step
    wrapper.find('button').last().simulate('click');
    wrapper.update();
    setImmediate(() => {
      expect(wrapper.find(OrderModal).children().children().children().instance().state.activeStepIndex).toEqual(1);
      done();
    });
  });
});
