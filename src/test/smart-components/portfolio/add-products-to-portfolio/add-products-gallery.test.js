import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import AddProductsGallery from '../../../../smart-components/portfolio/add-products-to-portfolio/add-products-gallery';

describe('<AddProductsGallery />', () => {
  let initialProps;
  beforeEach(() => {
    initialProps = {};
  });

  it('should render correctly', () => {
    const wrapper = shallow(<AddProductsGallery {...initialProps} />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
