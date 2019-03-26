import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import configureStore from 'redux-mock-store' ;
import { MemoryRouter, Route } from 'react-router-dom';
import CatalogBreadrubms from '../../../presentational-components/Shared/breadcrubms';

describe('<BreadCrumbs />', () => {
  let BreadcrumbWrapper;
  let mockStore;
  beforeEach(() => {
    BreadcrumbWrapper = ({ children, providerProps, ...props }) => (
      <MemoryRouter { ...props }>
        { children }
      </MemoryRouter>
    );
    mockStore = configureStore([]);
  });

  // generated ids
  it.skip('breadcrubms should render correctly empty breadcrumbs', () => {
    const store = mockStore({});
    const wrapper = mount(
      <BreadcrumbWrapper>
        <CatalogBreadrubms store={ store } />
      </BreadcrumbWrapper>
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('breadcrubms should render correctly two portfolio children', () => {
    const store = mockStore({
      portfolioReducer: {
        selectedPortfolio: {
          name: 'Foo'
        }
      }
    });
    const wrapper = mount(
      <MemoryRouter initialEntries={ [ '/portfolios/detail/55' ] } >
        <Route path='/portfolios/detail/55' render={ props => <CatalogBreadrubms store={ store } { ...props } /> }/>
      </MemoryRouter>
    );

    const list = wrapper.find('ol');
    expect(list.children()).toHaveLength(2);
    expect(list.childAt(0).text()).toEqual('Portfolios');
    expect(list.childAt(1).text()).toEqual('Foo');
  });
});
