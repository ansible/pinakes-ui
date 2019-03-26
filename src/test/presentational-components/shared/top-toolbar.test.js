import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import TopToolbar from '../../../presentational-components/shared/top-toolbar';

describe('<TopToolbar />', () => {
  it('should render correctly', () => {
    expect(shallowToJson(shallow(
      <TopToolbar>
        <div>Children</div>
      </TopToolbar>
    ))).toMatchSnapshot();
  });
});
