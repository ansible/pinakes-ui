import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { MemoryRouter, Link } from 'react-router-dom';
import ConditionalLink from '../../../presentational-components/shared/conditional-link';

describe('<ConditionalLink', () => {
  it('should render children wrapped in router Link component', () => {
    const wrapper = mount(
      <MemoryRouter>
        <ConditionalLink to="/some/url">
          <div>Link children</div>
        </ConditionalLink>
      </MemoryRouter>
    );
    expect(wrapper.find(Link)).toHaveLength(1);
    expect(toJson(wrapper.find(ConditionalLink))).toMatchSnapshot();
  });

  it('should render only children withouth link', () => {
    const wrapper = mount(
      <MemoryRouter>
        <ConditionalLink>
          <div>Link children</div>
        </ConditionalLink>
      </MemoryRouter>
    );
    expect(wrapper.find(Link)).toHaveLength(0);
    expect(toJson(wrapper.find(ConditionalLink))).toMatchSnapshot();
  });
});
