import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { shallow, mount } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import PortfolioCard from '../../../PresentationalComponents/Portfolio/PorfolioCard';

describe('<PortfolioCard />', () => {
  let initialProps;

  beforeEach(() => {
    initialProps = {
      portfolioName: 'foo',
      description: 'description',
      modified: 'modified',
      name: 'name',
      id: '123'
    };
  });

  it('should render correctly', () => {
    const wrapper = shallow(<PortfolioCard { ...initialProps } />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('should render and create correct card actions', () => {
    const wrapper = mount(
      <MemoryRouter>
        <PortfolioCard { ...initialProps } />
      </MemoryRouter>
    );
    expect(wrapper.find('button')).toHaveLength(2);

  });
});
