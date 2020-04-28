import React from 'react';
import { mount, render } from 'enzyme';
import PortfolioEmptyState from '../../../smart-components/portfolio/portfolio-empty-state';
import CatalogLink from '../../../smart-components/common/catalog-link';
import { MemoryRouter } from 'react-router-dom';
import UserContext from '../../../user-context';

describe('<PortfolioEmptyState />', () => {
  const initialProps = {
    url: 'foo/bar',
    handleFilterChange: jest.fn()
  };

  it('should render empty state for noData and no permissions', () => {
    const wrapper = render(
      <PortfolioEmptyState
        {...initialProps}
        meta={{ noData: true }}
        userCapabilities={{}}
      />
    );

    expect(wrapper.find(CatalogLink)).toHaveLength(0);
  });

  it('should render empty state for noData with add products button', () => {
    const wrapper = mount(
      <MemoryRouter>
        <UserContext.Provider
          value={{
            permissions: [{ permission: 'catalog:portfolio_items:create' }]
          }}
        >
          <PortfolioEmptyState
            {...initialProps}
            meta={{ noData: true }}
            userCapabilities={{ update: true }}
          />
        </UserContext.Provider>
      </MemoryRouter>
    );

    expect(wrapper.find(CatalogLink)).toHaveLength(1);
  });

  it('should render empty state for no filter result with clear filters action', () => {
    const handleFilterChange = jest.fn();
    const wrapper = mount(
      <PortfolioEmptyState
        {...initialProps}
        handleFilterChange={handleFilterChange}
        userCapabilities={{ update: true }}
        meta={{ noData: false }}
      />
    );

    expect(wrapper.find('button#clear-portfolio-filter')).toHaveLength(1);
    wrapper.find('button#clear-portfolio-filter').simulate('click');
    expect(handleFilterChange).toHaveBeenCalledWith('');
  });
});
