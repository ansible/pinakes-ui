import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import NoMatch from '../../../presentational-components/Shared/404Route';

describe('<NoMatch />', () => {
  it('should render correctly', () => {
    expect(toJson(mount(<NoMatch />))).toMatchSnapshot();
  });
});
