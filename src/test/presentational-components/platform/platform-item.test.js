import React from 'react';
import { mount, shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import PlatformItem from '../../../presentational-components/platform/platform-item';

describe('<PlatformItem />', () => {
  let initialProps;
  beforeEach(() => {
    initialProps = {};
  });

  it('should render correctly', () => {
    expect(shallowToJson(shallow(<PlatformItem { ...initialProps } />))).toMatchSnapshot();
  });

  it('should call handle check callback', () => {
    const onToggleItemSelect = jest.fn();
    const wrapper = mount(<PlatformItem { ...initialProps } editMode onToggleItemSelect={ onToggleItemSelect } description="Foo" id="foo" />);
    wrapper.find('input').simulate('change');
    expect(onToggleItemSelect).toHaveBeenCalled();
  });
});
