import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import RemovePortfolioItems from '../../../SmartComponents/Portfolio/RemovePortfolioItems';

describe('<RemovePortfolioItems />', () => {
  let initialProps;
  beforeEach(() => {
    initialProps = {
      filterValue: '',
      onFilterChange: jest.fn(),
      portfolioRoute: '/',
      portfolioName: 'Foo'
    };
  });

  it('should render correctly', () => {
    const wrapper = shallow(<RemovePortfolioItems { ...initialProps } />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
