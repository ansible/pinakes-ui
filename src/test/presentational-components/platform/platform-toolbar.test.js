import React from 'react';
import { mount, shallow } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { shallowToJson } from 'enzyme-to-json';
import PlatformToolbar from '../../../PresentationalComponents/Platform/PlatformToolbar';

describe('<PlatformToolbar />', () => {
  let initialProps;
  beforeEach(() => {
    initialProps = {
      searchValue: '',
      onFilterChange: jest.fn()
    };
  });

  it('should render correctly', () => {
    expect(shallowToJson(shallow(<PlatformToolbar { ...initialProps } />))).toMatchSnapshot();
  });

  it('should call search callback', () => {
    const onFilterChange = jest.fn();
    const wrapper = mount(<MemoryRouter><PlatformToolbar { ...initialProps } onFilterChange={ onFilterChange } /></MemoryRouter>);
    wrapper.find('input').simulate('change', { target: { value: 'Foo' }});
    expect(onFilterChange).toHaveBeenLastCalledWith(expect.any(String), expect.objectContaining({ target: { value: 'Foo' }}));
  });
});
