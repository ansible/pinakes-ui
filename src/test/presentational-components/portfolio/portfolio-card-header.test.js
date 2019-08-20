import React from 'react';
import { shallow, mount } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import { MemoryRouter } from 'react-router-dom';

import PortfolioCardHeader from '../../../presentational-components/portfolio/portfolio-card-header';

describe('<PortfolioCardHeader />', () => {
  let initialProps;
  beforeEach(() => {
    initialProps = {
      portfolioName: 'foo'
    };
  });

  it('should render correctly', () => {
    const wrapper = shallow(<PortfolioCardHeader { ...initialProps } />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('should render actions and react on user events', () => {
    const actionClick = jest.fn();
    const actions = [
      <button key="foo" onClick={ () => actionClick('foo') }></button>
    ];
    const wrapper = mount(
      <MemoryRouter>
        <PortfolioCardHeader { ...initialProps } headerActions={ actions } />
      </MemoryRouter>
    );

    const buttons = wrapper.find('button');
    expect(buttons).toHaveLength(1);
    buttons.simulate('click');
    expect(actionClick).toHaveBeenCalledWith('foo');
  });
});
