import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import ServiceOfferingCardBody from '../../../presentational-components/Shared/service-offering-body';

describe('<ServiceOfferingCardBody />', () => {
  let initialProps;
  beforeEach(() => {
    initialProps = {
      name: 'Foo',
      display_name: 'display name',
      distributor: 'Red Hat',
      long_description: 'long description'
    };
  });

  it('should render correctly', () => {
    const wrapper = mount(<ServiceOfferingCardBody { ...initialProps } />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render correctly with alternative values', () => {
    const wrapper = mount(<ServiceOfferingCardBody name="Foo" description="Bar" />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
