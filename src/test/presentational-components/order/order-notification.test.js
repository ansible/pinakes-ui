import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { shallow, mount } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import { CLEAR_NOTIFICATIONS } from '@redhat-cloud-services/frontend-components-notifications';

import OrderNotification from '../../../presentational-components/order/order-notification';

describe('<OrderNotification />', () => {
  let initialProps;
  beforeEach(() => {
    initialProps = {
      id: '123',
      dispatch: jest.fn()
    };
  });

  it('should render correctly', () => {
    const wrapper = shallow(
      <MemoryRouter>
        <OrderNotification {...initialProps} />
      </MemoryRouter>
    );
    expect(shallowToJson(wrapper.find(OrderNotification))).toMatchSnapshot();
  });

  it('should call dispatch on link click with correct arguments', () => {
    const dispatch = jest.fn();
    const wrapper = mount(
      <MemoryRouter>
        <OrderNotification {...initialProps} dispatch={dispatch} />
      </MemoryRouter>
    );
    wrapper.find('a').simulate('click');
    expect(dispatch).toHaveBeenCalledWith({ type: CLEAR_NOTIFICATIONS });
  });
});
