import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import PlatformDashboard from '../../../presentational-components/platform/platform-dashboard';

describe('<PlatformDashboard />', () => {
  it('should render correctly', () => {
    expect(shallowToJson(shallow(<PlatformDashboard />))).toMatchSnapshot();
  });
});
