import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import toJson from 'enzyme-to-json';
import PlatformCard from '../../../presentational-components/platform/platform-card';

describe('<PlatformCard />', () => {
  let initialProps;
  beforeEach(() => {
    initialProps = {
      description: 'desc',
      modified: 'Foo'
    };
  });

  it('should render correctly', () => {
    const wrapper = mount(
      <MemoryRouter>
        <PlatformCard { ...initialProps } />
      </MemoryRouter>
    );
    expect(toJson(wrapper.find(PlatformCard))).toMatchSnapshot();
  });

  it('should choose card image', () => {
    let wrapper = mount(
      <MemoryRouter>
        <PlatformCard { ...initialProps } />
      </MemoryRouter>
    );
    expect(toJson(wrapper.find(PlatformCard))).toMatchSnapshot();
  });
});
