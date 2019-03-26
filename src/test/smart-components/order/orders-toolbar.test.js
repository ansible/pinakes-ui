import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import OrdersToolbar from '../../../smart-components/order/orders-toolbar';

describe('<OrdersToolbar />', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<OrdersToolbar />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
