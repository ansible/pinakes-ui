import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { shallow, mount } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import PortfoliosFilterToolbar from '../../../PresentationalComponents/Portfolio/PortfoliosFilterToolbar';

describe('<PortfoliosFilterToolbar />', () => {
  let initialProps;

  beforeEach(() => {
    initialProps = {
      onFilterChange: jest.fn(),
      filterValue: ''
    };
  });

  it('should render correctly', () => {
    const wrapper = shallow(<PortfoliosFilterToolbar { ...initialProps } />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('should call filter action', () => {
    const onFilterChange = jest.fn();
    const wrapper = mount(
      <MemoryRouter>
        <PortfoliosFilterToolbar { ...initialProps } onFilterChange={ onFilterChange } />
      </MemoryRouter>
    );

    const input = wrapper.find('input');
    input.getDOMNode.value = 'foo';
    input.simulate('change');
    expect(onFilterChange).toHaveBeenCalled();
  });
});
