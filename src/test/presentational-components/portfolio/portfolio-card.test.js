import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { shallow, mount } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import PortfolioCard from '../../../presentational-components/portfolio/porfolio-card';

const prepareTruthyCapability = (truthyCapability) => ({
  user_capabilities: {
    destroy: false,
    update: false,
    share: false,
    unshare: false,
    ...(truthyCapability
      ? {
          [truthyCapability]: true
        }
      : {})
  }
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
      created_at: 'created at',
      owner: 'Owner',
      metadata: {
        user_capabilities: {
          destroy: true,
          update: true,
          share: true,
          unshare: true
        }
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
    expect(wrapper.find('li')).toHaveLength(4);
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
    expect(wrapper.find('li')).toHaveLength(2);
    expect(wrapper.find('li#share-portfolio-action'));
  });

  it('should have edit portfolio action in dropdown', () => {
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
    expect(wrapper.find('li')).toHaveLength(2);
    expect(wrapper.find('li#remove-portfolio-action'));
  });
});
