import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import TopToolbar from '../../../PresentationalComponents/Shared/top-toolbar';

describe('<TopToolbar />', () => {
  it('should render correctly', () => {
    expect(toJson(mount(<TopToolbar />))).toMatchSnapshot();
  });
});
