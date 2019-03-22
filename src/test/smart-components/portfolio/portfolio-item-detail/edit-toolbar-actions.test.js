import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { MemoryRouter } from 'react-router-dom';

import EditToolbarActions from '../../../../SmartComponents/Portfolio/portfolio-item-detail/edit-toolbar-actions';

describe('<EditToolbarActions />', () => {
  let initialProps;

  beforeEach(() => {
    initialProps = {
      detailUrl: '/foo/bar',
      onSave: jest.fn(),
      resetWorkflow: jest.fn()
    };
  });

  it('should render correctly', () => {
    const wrapper = mount(
      <MemoryRouter>
        <EditToolbarActions { ...initialProps } />
      </MemoryRouter>
    );
    expect(toJson(wrapper.find(EditToolbarActions))).toMatchSnapshot();
  });
});
