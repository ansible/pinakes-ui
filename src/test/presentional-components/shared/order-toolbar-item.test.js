import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import toJson from 'enzyme-to-json';
import OrderToolbarItem from '../../../PresentationalComponents/Shared/OrderToolbarItem';

describe('<OrderToolbarItem />', () => {
  let initialProps;
  beforeEach(() => {
    initialProps = {};
  });

  it('should render correcntly', () => {
    const wrapper = mount(<MemoryRouter><OrderToolbarItem { ...initialProps } /></MemoryRouter>).find(OrderToolbarItem);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render correcntly when required', () => {
    const wrapper = mount(<MemoryRouter><OrderToolbarItem { ...initialProps } /></MemoryRouter>).find(OrderToolbarItem);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
