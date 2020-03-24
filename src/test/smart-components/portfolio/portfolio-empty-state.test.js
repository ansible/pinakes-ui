import React from 'react';
import { mount } from 'enzyme';
import PortfolioEmptyState from '../../../smart-components/portfolio/portfolio-empty-state';
import UserContext from '../../../user-context';
import CatalogLink from '../../../smart-components/common/catalog-link';
import { MemoryRouter } from 'react-router-dom';

describe('<PortfolioEmptyState />', () => {
  const initialProps = {
    url: 'foo/bar',
    handleFilterChange: jest.fn()
  };

  it('should render empty state for noData and no permissions', () => {
    const wrapper = mount(
      <UserContext.Provider
        value={{ permissions: [{ permission: 'wrong:permission:rule' }] }}
      >
        <PortfolioEmptyState {...initialProps} meta={{ noData: true }} />
      </UserContext.Provider>
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
          <PortfolioEmptyState {...initialProps} meta={{ noData: true }} />
        </UserContext.Provider>
      </MemoryRouter>
    );

    expect(wrapper.find(CatalogLink)).toHaveLength(1);
  });

  it('should render empty state for no filter result with clear filters action', () => {
    const handleFilterChange = jest.fn();
    const wrapper = mount(
      <UserContext.Provider
        value={{ permissions: [{ permission: 'wrong:permission:rule' }] }}
      >
        <PortfolioEmptyState
          {...initialProps}
          handleFilterChange={handleFilterChange}
          meta={{ noData: false }}
        />
      </UserContext.Provider>
    );

    expect(wrapper.find('button#clear-portfolio-filter')).toHaveLength(1);
    wrapper.find('button#clear-portfolio-filter').simulate('click');
    expect(handleFilterChange).toHaveBeenCalledWith('');
  });
});
