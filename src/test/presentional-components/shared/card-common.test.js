import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import ItemDetails from '../../../PresentationalComponents/Shared/CardCommon';

describe('<CardCommon />', () => {
  let initialProps;
  beforeEach(() => {
    initialProps = {};
  });

  it('should render correctly empty', () => {
    const wrapper = (mount(<ItemDetails { ...initialProps } />));
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render correctly with content', () => {
    const wrapper = (mount(<ItemDetails { ...initialProps } foo="Foo content" bar={ <h1>Bar content</h1> } toDisplay={ [ 'foo', 'bar' ] }/>));
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
