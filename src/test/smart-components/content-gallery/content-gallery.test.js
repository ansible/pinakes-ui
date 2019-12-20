import React from 'react';
import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import ContentGallery from '../../../smart-components/content-gallery/content-gallery';

describe('<ContentGallery />', () => {
  it('should render in loading state', () => {
    expect(toJson(shallow(<ContentGallery isLoading />))).toMatchSnapshot();
  });

  it('should render no items placeholder', () => {
    const props = {
      isLoading: false,
      items: []
    };

    const wrapper = mount(<ContentGallery {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render all items', () => {
    const props = {
      isLoading: false,
      items: [1, 2, 3].map((item) => <div key={item}>{item}</div>)
    };

    const wrapper = mount(<ContentGallery {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
