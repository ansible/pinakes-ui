import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import PortfolioFilterToolbar from '../../../presentational-components/Portfolio/PortfolioFilterToolbar';

describe('<PortfolioFilterToolbar />', () => {
  let initialProps;

  beforeEach(() => {
    initialProps = {
      addProductsRoute: '/add',
      isLoading: false,
      editPortfolioRoute: '/edit',
      removePortfolioRoute: '/remove-portfolio',
      removeProductsRoute: '/remove-products',
      onFilterChange: jest.fn()
    };
  });

  it('should render correctly', () => {
    const wrapper = shallow(<PortfolioFilterToolbar { ...initialProps } />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
