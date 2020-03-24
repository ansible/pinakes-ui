import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { MemoryRouter } from 'react-router-dom';

import DetailToolbarActions from '../../../../smart-components/portfolio/portfolio-item-detail/detail-toolbar-actions';

const prepareTruthyCapability = (truthyCapability) => ({
  copy: false,
  update: false,
  ...(truthyCapability
    ? {
        [truthyCapability]: true
      }
    : {})
});

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
      pathname: 'foo/bar',
      userCapabilities: {
        copy: true,
        update: true
      }
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

  it('should show copy action in dropdown', () => {
    const wrapper = mount(
      <MemoryRouter>
        <DetailToolbarActions
          {...initialProps}
          isOpen
          userCapabilities={prepareTruthyCapability('copy')}
        />
      </MemoryRouter>
    );

    expect(wrapper.find('li')).toHaveLength(3);
    expect(wrapper.find('li#copy-portfolio-item')).toHaveLength(1);
  });

  it('should show edit action in dropdown', () => {
    const wrapper = mount(
      <MemoryRouter>
        <DetailToolbarActions
          {...initialProps}
          isOpen
          userCapabilities={prepareTruthyCapability('update')}
        />
      </MemoryRouter>
    );

    expect(wrapper.find('li')).toHaveLength(3);
    expect(wrapper.find('li#edit-portfolio-item')).toHaveLength(1);
  });
});
