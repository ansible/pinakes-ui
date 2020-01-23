import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import CatalogLink from '../../../smart-components/common/catalog-link';

const RouterWrapper = ({ initialEntries = ['/'], children }) => (
  <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
);

const simulateLinkClick = (component) =>
  component.simulate('click', { button: 0 });

const getHistory = (component) => component.instance().history;

const locationMatcher = ({ pathname, search }) =>
  expect.objectContaining({
    pathname,
    search
  });

describe('<CatalogLink />', () => {
  it('should create withouth any search params', () => {
    const wrapper = mount(
      <RouterWrapper>
        <CatalogLink id="normal-link" pathname="/normal-link">
          Normal link
        </CatalogLink>
      </RouterWrapper>
    );

    expect(getHistory(wrapper.find(MemoryRouter)).location).toEqual(
      locationMatcher({
        pathname: '/',
        search: ''
      })
    );
    simulateLinkClick(wrapper.find('a#normal-link'));
    expect(getHistory(wrapper.find(MemoryRouter)).location).toEqual(
      locationMatcher({
        pathname: '/normal-link',
        search: ''
      })
    );
  });
  it('should create with search params', () => {
    const wrapper = mount(
      <RouterWrapper>
        <CatalogLink
          id="search-link"
          pathname="/search-link"
          searchParams={{ 'param-1': '1', 'param-2': '2' }}
        >
          Link with 2 params
        </CatalogLink>
      </RouterWrapper>
    );

    expect(getHistory(wrapper.find(MemoryRouter)).location).toEqual(
      locationMatcher({ pathname: '/', search: '' })
    );
    simulateLinkClick(wrapper.find('a#search-link'));
    expect(getHistory(wrapper.find(MemoryRouter)).location).toEqual(
      locationMatcher({
        pathname: '/search-link',
        search: '?param-1=1&param-2=2'
      })
    );
  });
  it('should create with search params and override current search query', () => {
    const wrapper = mount(
      <RouterWrapper initialEntries={['/foo?initial-search=bar']}>
        <CatalogLink
          id="override-link"
          pathname="/override-link"
          searchParams={{ param: 'override' }}
        >
          Link with override params
        </CatalogLink>
      </RouterWrapper>
    );

    expect(getHistory(wrapper.find(MemoryRouter)).location).toEqual(
      locationMatcher({ pathname: '/foo', search: '?initial-search=bar' })
    );
    simulateLinkClick(wrapper.find('a#override-link'));
    expect(getHistory(wrapper.find(MemoryRouter)).location).toEqual(
      locationMatcher({
        pathname: '/override-link',
        search: '?param=override'
      })
    );
  });
  it('should create without search params and use current search query', () => {
    const wrapper = mount(
      <RouterWrapper initialEntries={['/foo?initial-search=bar']}>
        <CatalogLink
          id="preserve-link"
          pathname="/preserve-link"
          preserveSearch
        >
          Link with preserved params
        </CatalogLink>
      </RouterWrapper>
    );

    expect(getHistory(wrapper.find(MemoryRouter)).location).toEqual(
      locationMatcher({ pathname: '/foo', search: '?initial-search=bar' })
    );
    simulateLinkClick(wrapper.find('a#preserve-link'));
    expect(getHistory(wrapper.find(MemoryRouter)).location).toEqual(
      locationMatcher({
        pathname: '/preserve-link',
        search: '?initial-search=bar'
      })
    );
  });
  it('should create with search params and append them to current search query', () => {
    const wrapper = mount(
      <RouterWrapper initialEntries={['/foo?initial-search=bar']}>
        <CatalogLink
          id="append-link"
          pathname="/append-link"
          preserveSearch
          searchParams={{ append: 'append' }}
        >
          Link with append params
        </CatalogLink>
      </RouterWrapper>
    );

    expect(getHistory(wrapper.find(MemoryRouter)).location).toEqual(
      locationMatcher({ pathname: '/foo', search: '?initial-search=bar' })
    );
    simulateLinkClick(wrapper.find('a#append-link'));
    expect(getHistory(wrapper.find(MemoryRouter)).location).toEqual(
      locationMatcher({
        pathname: '/append-link',
        search: '?initial-search=bar&append=append'
      })
    );
  });
});
