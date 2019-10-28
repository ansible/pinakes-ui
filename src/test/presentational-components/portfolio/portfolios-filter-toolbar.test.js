import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { shallow, mount } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import { mockBreacrumbsStore } from '../../redux/redux-helpers';
import ToolbarRenderer from '../../../toolbar/toolbar-renderer';
import createPortfolioToolbarSchema from '../../../toolbar/schemas/portfolios-toolbar.schema';
import { CATALOG_API_BASE } from '../../../utilities/constants';

describe('<PortfoliosFilterToolbar />', () => {
  let initialProps;

  beforeEach(() => {
    initialProps = {
      schema: createPortfolioToolbarSchema({
        filterProps: {
          searchValue: '',
          onFilterChange: jest.fn()
        },
        fetchPortfolios: () => new Promise(resolve => resolve([]))
      })
    };
  });

  it('should render correctly', () => {
    const wrapper = shallow(<ToolbarRenderer { ...initialProps } />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('should call filter action', () => {

    apiClientMock.get(`${CATALOG_API_BASE}/portfolios?filter%5Bname%5D%5Bcontains_i%5D=&limit=50&offset=0`,
      mockOnce({ body: [{ data: [], meta: {}}]}));
    const onFilterChange = jest.fn();
    const Provider = mockBreacrumbsStore();
    const wrapper = mount(
      <MemoryRouter>
        <Provider>
          <ToolbarRenderer schema={ createPortfolioToolbarSchema({
            fetchPortfolios: () => new Promise(resolve => resolve([])),
            filterProps: { onFilterChange, searchValue: '' }}) }
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
