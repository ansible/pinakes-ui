import React from 'react';
import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import CardCheckbox from '../../../PresentationalComponents/Shared/CardCheckbox';

describe('<CardCheckbox />', () => {
  let initialProps;

  beforeEach(() => {
    initialProps = {
      handleCheck: jest.fn(),
      isChecked: false,
      id: 'foo-id'
    };
  });

  it('should render correctly', () => {
    const wrapper = shallow(<CardCheckbox { ...initialProps }/>);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should call handleCheck on checkbock click', () => {
    const wrapper = mount(<CardCheckbox { ...initialProps }/>);
    wrapper.find('input').simulate('change');
    expect(initialProps.handleCheck).toHaveBeenCalledWith(false, expect.any(Object));
  });
});
