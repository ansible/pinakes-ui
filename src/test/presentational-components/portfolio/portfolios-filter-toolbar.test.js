import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { shallow, mount } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import ToolbarRenderer from '../../../toolbar/toolbar-renderer';
import createPortfolioToolbarSchema from '../../../toolbar/schemas/portfolios-toolbar.schema';
import { CATALOG_API_BASE } from '../../../utilities/constants';
import { mockApi } from '../../__mocks__/user-login';

describe('<PortfoliosFilterToolbar />', () => {
  let initialProps;
  const mockStore = configureStore([thunk]);

  beforeEach(() => {
    initialProps = {
      schema: createPortfolioToolbarSchema({
        userPermissions: ['catalog:portfolios:create'],
        filterProps: {
          searchValue: '',
          onFilterChange: jest.fn()
        },
        meta: {},
        fetchPortfolios: () => new Promise((resolve) => resolve([]))
      })
    };
  });

  it('should render correctly with create button', () => {
    const wrapper = shallow(<ToolbarRenderer {...initialProps} />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('should render correctly without the create button', () => {
    const noCreateProps = {
      schema: createPortfolioToolbarSchema({
        userPermissions: ['catalog:portfolios:view'],
        filterProps: {
          searchValue: '',
          onFilterChange: jest.fn()
        },
        meta: {},
        fetchPortfolios: () => new Promise((resolve) => resolve([]))
      })
    };
    const wrapper = shallow(<ToolbarRenderer {...noCreateProps} />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('should call filter action', () => {
    mockApi
      .onGet(
        `${CATALOG_API_BASE}/portfolios?filter[name][contains_i]=&limit=50&offset=0`
      )
      .replyOnce(200, { data: [], meta: {} });
    const onFilterChange = jest.fn();
    const wrapper = mount(
      <MemoryRouter>
        <Provider store={mockStore({ breadcrumbsReducer: { fragments: [] } })}>
          <ToolbarRenderer
            schema={createPortfolioToolbarSchema({
              userPermissions: ['catalog:portfolios:create'],
              fetchPortfolios: () => new Promise((resolve) => resolve([])),
              meta: {},
              filterProps: { onFilterChange, searchValue: '' }
            })}
          />
        </Provider>
      </MemoryRouter>
    );

    const input = wrapper.find('input').first();
    input.getDOMNode.value = 'foo';
    input.simulate('change');
    expect(onFilterChange).toHaveBeenCalled();
  });
});
