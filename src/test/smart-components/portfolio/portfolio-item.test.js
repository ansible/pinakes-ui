import React from 'react';
import { shallow, mount } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import { MemoryRouter } from 'react-router-dom';

import PortfolioItem from '../../../smart-components/portfolio/portfolio-item';

describe('<PortfolioItem />', () => {
  let initialProps;

  beforeEach(() => {
    initialProps = {
      orderUrl: '/order',
      id: '1',
      name: 'Foo',
      description: 'Bar',
      display_name: 'quux'
    };
  });

  it('should render correctly', () => {
    const wrapper = shallow(<PortfolioItem { ...initialProps } />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('should check the item corecttly', () => {
    const onSelect = jest.fn();
    const wrapper = mount(
      <MemoryRouter>
        <PortfolioItem { ...initialProps } onSelect={ onSelect } isSelectable />
      </MemoryRouter>
    );
    wrapper.find('input').simulate('change');
    expect(onSelect).toHaveBeenCalledWith('1');
  });
});
