import React from 'react';
import ToolbarRenderer from '../../toolbar/toolbar-renderer';
import createPortfolioToolbarSchema from '../../toolbar/schemas/portfolio-toolbar.schema';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Dropdown } from '@patternfly/react-core';

const prepareTruthyCapability = (truthyCapability) => ({
  destroy: false,
  update: false,
  share: false,
  unshare: false,
  show: false,
  copy: false,
  tags: false,
  ...(truthyCapability
    ? {
        [truthyCapability]: true
      }
    : {})
});

describe('portfolio toolbar schema', () => {
  const initialProps = {
    title: 'foo',
    addProductsRoute: 'foo',
    copyPortfolio: jest.fn(),
    sharePortfolioRoute: 'foo',
    editPortfolioRoute: 'foo',
    workflowPortfolioRoute: 'foo',
    removePortfolioRoute: 'foo',
    copyInProgress: false,
    isLoading: false,
    removeProducts: jest.fn(),
    itemsSelected: false,
    meta: {},
    fetchPortfolioItemsWithPortfolio: jest.fn(),
    portfolioId: 'foo',
    description: 'fii',
    filterProps: {
      searchValue: '',
      onFilterChange: jest.fn(),
      placeholder: ''
    },
    userCapabilities: {
      share: true,
      unshare: true,
      copy: true,
      update: true,
      destroy: true,
      tags: true
    },
    canLinkOrderProcesses: true
  };

  const mockStore = configureStore();
  const store = mockStore({ breadcrumbsReducer: { fragments: [] } });

  const ToolbarWrapper = ({ children }) => (
    <Provider store={store}>
      <MemoryRouter>{children}</MemoryRouter>
    </Provider>
  );

  it('should render portfolio actions dropdown with all actions', () => {
    const wrapper = mount(
      <ToolbarWrapper>
        <ToolbarRenderer schema={createPortfolioToolbarSchema(initialProps)} />
      </ToolbarWrapper>
    );
    wrapper.find('button#toggle-portfolio-actions').simulate('click');
    expect(wrapper.find('li')).toHaveLength(5);
    expect(wrapper.find('a#portfolio-share-button')).toHaveLength(1);
  });

  it('should render share action when only unshare is truthy', () => {
    const wrapper = mount(
      <ToolbarWrapper>
        <ToolbarRenderer
          schema={createPortfolioToolbarSchema({
            ...initialProps,
            userCapabilities: prepareTruthyCapability('unshare')
          })}
        />
      </ToolbarWrapper>
    );
    expect(wrapper.find('a#portfolio-share-button')).toHaveLength(1);
    expect(wrapper.find(Dropdown)).toHaveLength(0);
  });

  it('should only render copy action', () => {
    const wrapper = mount(
      <ToolbarWrapper>
        <ToolbarRenderer
          schema={createPortfolioToolbarSchema({
            ...initialProps,
            userCapabilities: prepareTruthyCapability('copy')
          })}
        />
      </ToolbarWrapper>
    );
    wrapper.find('button#toggle-portfolio-actions').simulate('click');
    expect(wrapper.find('li')).toHaveLength(1);
    expect(wrapper.find('li#copy-portfolio')).toHaveLength(1);
    expect(wrapper.find('button#portfolio-share-button')).toHaveLength(0);
  });

  it('should only render edit action', () => {
    const wrapper = mount(
      <ToolbarWrapper>
        <ToolbarRenderer
          schema={createPortfolioToolbarSchema({
            ...initialProps,
            userCapabilities: prepareTruthyCapability('update'),
            canLinkOrderProcesses: true
          })}
        />
      </ToolbarWrapper>
    );
    wrapper.find('button#toggle-portfolio-actions').simulate('click');
    expect(wrapper.find('li')).toHaveLength(2);
    expect(wrapper.find('li#edit-portfolio')).toHaveLength(1);
    expect(wrapper.find('li#attach-order-processes')).toHaveLength(1);
    expect(wrapper.find('button#portfolio-share-button')).toHaveLength(0);
  });

  it('should only render remove action', () => {
    const wrapper = mount(
      <ToolbarWrapper>
        <ToolbarRenderer
          schema={createPortfolioToolbarSchema({
            ...initialProps,
            userCapabilities: prepareTruthyCapability('destroy')
          })}
        />
      </ToolbarWrapper>
    );
    wrapper.find('button#toggle-portfolio-actions').simulate('click');
    expect(wrapper.find('li')).toHaveLength(1);
    expect(wrapper.find('li#delete-portfolio')).toHaveLength(1);
    expect(wrapper.find('button#portfolio-share-button')).toHaveLength(0);
  });

  it('should only render set approval action', () => {
    const wrapper = mount(
      <ToolbarWrapper>
        <ToolbarRenderer
          schema={createPortfolioToolbarSchema({
            ...initialProps,
            userCapabilities: prepareTruthyCapability('tags')
          })}
        />
      </ToolbarWrapper>
    );
    wrapper.find('button#toggle-portfolio-actions').simulate('click');
    expect(wrapper.find('li')).toHaveLength(1);
    expect(wrapper.find('li#set-approval-portfolio-action')).toHaveLength(1);
  });

  it('should not render dropdown', () => {
    const wrapper = mount(
      <ToolbarWrapper>
        <ToolbarRenderer
          schema={createPortfolioToolbarSchema({
            ...initialProps,
            userCapabilities: {}
          })}
        />
      </ToolbarWrapper>
    );
    expect(wrapper.find(Dropdown)).toHaveLength(0);
  });
});
