import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { shallow, mount } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import { mockBreacrumbsStore } from '../../redux/redux-helpers';
import ToolbarRenderer from '../../../toolbar/toolbar-renderer';
import createPortfolioToolbarSchema from '../../../toolbar/schemas/portfolios-toolbar.schema';

describe('<PortfoliosFilterToolbar />', () => {
  let initialProps;

  beforeEach(() => {
    initialProps = {
      schema: createPortfolioToolbarSchema({ filterProps: {
        searchValue: '',
        onFilterChange: jest.fn()
      }})
    };
  });

  it('should render correctly', () => {
    const wrapper = shallow(<ToolbarRenderer { ...initialProps } />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('should call filter action', () => {
    const onFilterChange = jest.fn();
    const Provider = mockBreacrumbsStore();
    const wrapper = mount(
      <MemoryRouter>
        <Provider>
          <ToolbarRenderer schema={ createPortfolioToolbarSchema({ filterProps: { onFilterChange, searchValue: '' }}) } />
        </Provider>
      </MemoryRouter>
    );

    const input = wrapper.find('input').first();
    input.getDOMNode.value = 'foo';
    input.simulate('change');
    expect(onFilterChange).toHaveBeenCalled();
  });
});
