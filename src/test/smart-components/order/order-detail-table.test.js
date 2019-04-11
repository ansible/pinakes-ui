import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import OrderDetailTable from '../../../smart-components/order/order-detail-table';

describe('<OrderDetailTable />', () => {
  let initialProps;

  beforeEach(() => {
    initialProps = {
      requests: [{
        reason: 'foo',
        requester: 'bar',
        updated_at: 'Wed Apr 10 2019 14:26:42 GMT+0200 (Central European Summer Time)',
        state: 'baz'
      }]
    };
  });

  it('should render correctly', () => {
    const wrapper = shallow(<OrderDetailTable { ...initialProps } />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
