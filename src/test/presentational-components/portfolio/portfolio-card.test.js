import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { shallow, mount } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import PortfolioCard from '../../../presentational-components/portfolio/porfolio-card';
import { Dropdown, Label } from '@patternfly/react-core';

const prepareTruthyCapability = (truthyCapability) => ({
  user_capabilities: {
    destroy: false,
    update: false,
    share: false,
    unshare: false,
    set_approval: false,
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
          set_approval: true
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
        <PortfolioCard {...initialProps} />
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
          metadata={prepareTruthyCapability('set_approval')}
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

  it('should render with shared label', () => {
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
    expect(wrapper.find(Label)).toHaveLength(1);
    expect(wrapper.find(Label).text()).toEqual('Shared');
  });
});
