import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import StepLabel from '../../../smart-components/order/step-label';

describe('<StepLabel />', () => {
  let initialProps;

  beforeEach(() => {
    initialProps = {
      index: 123456789,
      text: 'Foo'
    };
  });

  it('should render correctly', () => {
    const wrapper = mount(<StepLabel { ...initialProps } />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
