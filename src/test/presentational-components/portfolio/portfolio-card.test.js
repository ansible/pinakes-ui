import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { shallow, mount } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import PortfolioCard from '../../../presentational-components/portfolio/portfolio-card';
import { Dropdown } from '@patternfly/react-core';
import {
  StyledClipboardCheckIcon,
  StyledShareIcon
} from '../../../presentational-components/styled-components/icons';

import { render, screen, waitFor } from '@testing-library/react';

import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

const prepareTruthyCapability = (truthyCapability) => ({
  user_capabilities: {
    destroy: false,
    update: false,
    share: false,
    unshare: false,
    tags: false,
    ...(truthyCapability
      ? {
          [truthyCapability]: true
        }
      : {})
  },
  statistics: {}
});

describe('<PortfolioCard />', () => {
  let initialProps;

  beforeEach(() => {
    initialProps = {
      portfolioName: 'foo',
      description: 'description',
      modified: 'modified',
      name: 'name',
      id: '123',
      created_at: 'created',
      owner: 'Owner',
      handleCopyPortfolio: jest.fn(),
      metadata: {
        user_capabilities: {
          copy: true,
          destroy: true,
          update: true,
          share: true,
          unshare: true,
          tags: true
        },
        statistics: {}
      }
    };
  });

  it('should render correctly', () => {
    const wrapper = shallow(<PortfolioCard {...initialProps} />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('should render and create correct card actions', () => {
    const wrapper = mount(
      <MemoryRouter>
        <PortfolioCard {...initialProps} canLinkOrderProcesses={true} />
      </MemoryRouter>
    );
    expect(wrapper.find('button')).toHaveLength(1);
    wrapper.find('button#portfolio-123-toggle').simulate('click');
    expect(wrapper.find('li')).toHaveLength(6);
  });

  it('should show share dropdown option if only unshare is set to true', () => {
    const wrapper = mount(
      <MemoryRouter>
        <PortfolioCard
          {...initialProps}
          metadata={prepareTruthyCapability('unshare')}
          canLinkOrderProcesses={true}
        />
      </MemoryRouter>
    );
    wrapper.find('button#portfolio-123-toggle').simulate('click');
    expect(wrapper.find('li')).toHaveLength(1);
    expect(wrapper.find('li#share-portfolio-action'));
  });

  it('should have edit portfolio action and set order processes in dropdown', () => {
    const wrapper = mount(
      <MemoryRouter>
        <PortfolioCard
          {...initialProps}
          metadata={prepareTruthyCapability('update')}
          canLinkOrderProcesses={true}
        />
      </MemoryRouter>
    );
    wrapper.find('button#portfolio-123-toggle').simulate('click');
    expect(wrapper.find('li')).toHaveLength(2);
    expect(wrapper.find('li#edit-portfolio-action'));
    expect(wrapper.find('li#attach-order-processes')).toHaveLength(1);
  });

  it('should have remove portfolio action in dropdown', () => {
    const wrapper = mount(
      <MemoryRouter>
        <PortfolioCard
          {...initialProps}
          metadata={prepareTruthyCapability('destroy')}
        />
      </MemoryRouter>
    );
    wrapper.find('button#portfolio-123-toggle').simulate('click');
    expect(wrapper.find('li')).toHaveLength(1);
    expect(wrapper.find('li#remove-portfolio-action'));
  });

  it('should have set approval action in dropdown', () => {
    const wrapper = mount(
      <MemoryRouter>
        <PortfolioCard
          {...initialProps}
          metadata={prepareTruthyCapability('tags')}
        />
      </MemoryRouter>
    );
    wrapper.find('button#portfolio-123-toggle').simulate('click');
    expect(wrapper.find('li')).toHaveLength(1);
    expect(wrapper.find('li#set-approval-portfolio-action'));
  });

  it('should have copy action in dropdown', () => {
    const wrapper = mount(
      <MemoryRouter>
        <PortfolioCard
          {...initialProps}
          metadata={prepareTruthyCapability('copy')}
        />
      </MemoryRouter>
    );
    wrapper.find('button#portfolio-123-toggle').simulate('click');
    expect(wrapper.find('li')).toHaveLength(1);
    expect(wrapper.find('li#copy-portfolio-action'));
  });

  it('should not render dropdown', () => {
    const wrapper = mount(
      <MemoryRouter>
        <PortfolioCard
          {...initialProps}
          metadata={{ user_capabilities: {}, statistics: {} }}
        />
      </MemoryRouter>
    );
    expect(wrapper.find(Dropdown)).toHaveLength(0);
  });

  it('should render with shared icon', () => {
    const wrapper = mount(
      <MemoryRouter>
        <PortfolioCard
          {...initialProps}
          metadata={{
            ...initialProps.metadata,
            statistics: { shared_groups: 2 }
          }}
        />
      </MemoryRouter>
    );
    expect(wrapper.find(StyledShareIcon)).toHaveLength(1);
  });

  it('should render with shared icon with tooltip', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <PortfolioCard
          {...initialProps}
          metadata={{
            ...initialProps.metadata,
            statistics: { shared_groups: 2 }
          }}
        />
      </MemoryRouter>
    );
    await user.hover(screen.getByTestId('share-icon'));

    await waitFor(() => {
      expect(screen.getByText('Shared with 2 group(s)')).toBeInTheDocument();
    });
  });

  it('should render with approval processes set icon', () => {
    const wrapper = mount(
      <MemoryRouter>
        <PortfolioCard
          {...initialProps}
          metadata={{
            ...initialProps.metadata,
            statistics: { approval_processes: 1 }
          }}
        />
      </MemoryRouter>
    );
    expect(wrapper.find(StyledClipboardCheckIcon)).toHaveLength(1);
  });

  it('should render with approval processes icon and tooltip', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <PortfolioCard
          {...initialProps}
          metadata={{
            ...initialProps.metadata,
            statistics: { approval_processes: 1 }
          }}
        />
      </MemoryRouter>
    );
    await user.hover(screen.getByTestId('approval-set-icon'));
    await waitFor(() => {
      expect(screen.getByText('Approval process set')).toBeInTheDocument();
    });
  });
});
