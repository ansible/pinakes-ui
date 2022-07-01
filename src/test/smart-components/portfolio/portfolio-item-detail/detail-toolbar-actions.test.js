import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { MemoryRouter } from 'react-router-dom';

import DetailToolbarActions from '../../../../smart-components/portfolio/portfolio-item-detail/detail-toolbar-actions';
import { Dropdown } from '@patternfly/react-core';

const prepareTruthyCapability = (truthyCapability) => ({
  copy: false,
  update: false,
  tags: false,
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
        update: true,
        tags: true
      },
      canLinkOrderProcesses: true
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

    expect(wrapper.find('li')).toHaveLength(1);
    expect(wrapper.find('li#copy-portfolio-item')).toHaveLength(1);
  });

  it('should disable the Order button if orderable is false', () => {
    const wrapper = mount(
      <MemoryRouter>
        <DetailToolbarActions
          {...initialProps}
          isOpen
          orderable={false}
          userCapabilities={prepareTruthyCapability('copy')}
        />
      </MemoryRouter>
    );

    expect(wrapper.find('Button').props().isDisabled).toBeTruthy();
  });

  it('should disable the Order button if orderable is false', () => {
    const wrapper = mount(
      <MemoryRouter>
        <DetailToolbarActions
          {...initialProps}
          isOpen
          orderable={true}
          userCapabilities={prepareTruthyCapability('copy')}
        />
      </MemoryRouter>
    );

    expect(wrapper.find('Button').props().isDisabled).toBeFalsy();
  });

  it('should show edit, set order processes and edit survey actions in dropdown', () => {
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
    expect(wrapper.find('li#edit-survey')).toHaveLength(1);
    expect(wrapper.find('li#attach-order-processes')).toHaveLength(1);
  });

  it('should show set_approval action in dropdown', () => {
    const wrapper = mount(
      <MemoryRouter>
        <DetailToolbarActions
          {...initialProps}
          isOpen
          userCapabilities={prepareTruthyCapability('tags')}
        />
      </MemoryRouter>
    );

    expect(wrapper.find('li')).toHaveLength(1);
    expect(wrapper.find('li#set-approval_workflow')).toHaveLength(1);
  });

  it('should not render dropdown', () => {
    const wrapper = mount(
      <MemoryRouter>
        <DetailToolbarActions {...initialProps} isOpen userCapabilities={{}} />
      </MemoryRouter>
    );

    expect(wrapper.find(Dropdown)).toHaveLength(0);
  });
});
