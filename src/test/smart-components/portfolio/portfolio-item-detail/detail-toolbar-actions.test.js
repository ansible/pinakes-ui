import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { MemoryRouter } from 'react-router-dom';

import DetailToolbarActions from '../../../../smart-components/portfolio/portfolio-item-detail/detail-toolbar-actions';

describe('<DetailToolbarActions />', () => {
  let initialProps;

  beforeEach(() => {
    initialProps = {
      orderUrl: 'foo/bar',
      editUrl: 'foo/baz',
      isOpen: false,
      setOpen: jest.fn(),
      copyUrl: 'foo/copy',
      availability: 'available',
      editSurveyUrl: 'foo/edit-survey',
      workflowUrl: 'foo/workflow',
      pathname: 'foo/bar'
    };
  });

  it('should render correctly', () => {
    const wrapper = mount(
      <MemoryRouter>
        <DetailToolbarActions {...initialProps} />
      </MemoryRouter>
    );
    expect(toJson(wrapper.find(DetailToolbarActions))).toMatchSnapshot();
  });

  it('should render order button when source is available', () => {
    const wrapper = mount(
      <MemoryRouter>
        <DetailToolbarActions {...initialProps} />
      </MemoryRouter>
    );
    expect(wrapper.find('button#order-portfolio-item')).toHaveLength(1);
    expect(
      wrapper.find('#unavailable-alert-info.pf-c-alert.pf-m-inline')
    ).toHaveLength(0);
  });

  it('should render alert when source is unavailable', () => {
    const wrapper = mount(
      <MemoryRouter>
        <DetailToolbarActions {...initialProps} availability="unavailable" />
      </MemoryRouter>
    );
    expect(
      wrapper.find('#unavailable-alert-info.pf-c-alert.pf-m-inline')
    ).toHaveLength(1);
    expect(wrapper.find('button#order-portfolio-item')).toHaveLength(0);
  });
});
