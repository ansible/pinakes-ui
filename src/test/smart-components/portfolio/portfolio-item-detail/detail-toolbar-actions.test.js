import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { MemoryRouter } from 'react-router-dom';

import DetailToolbarActions from '../../../../SmartComponents/Portfolio/portfolio-item-detail/detail-toolbar-actions';

describe('<DetailToolbarActions />', () => {
  let initialProps;

  beforeEach(() => {
    initialProps = {
      orderUrl: 'foo/bar',
      editUrl: 'foo/baz',
      isOpen: false,
      setOpen: jest.fn()
    };
  });

  it('should render correctly', () => {
    const wrapper = mount(
      <MemoryRouter>
        <DetailToolbarActions { ...initialProps } />
      </MemoryRouter>
    );
    expect(toJson(wrapper.find(DetailToolbarActions))).toMatchSnapshot();
  });
});
