import React from 'react';
import { mount, shallow } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { shallowToJson } from 'enzyme-to-json';
import PlatformToolbar from '../../../presentational-components/platform/platform-toolbar';
import { mockBreacrumbsStore } from '../../redux/redux-helpers';

describe('<PlatformToolbar />', () => {
  let initialProps;
  let Provider;
  beforeEach(() => {
    initialProps = {
      searchValue: '',
      onFilterChange: jest.fn(),
      title: 'toolbar title'
    };
    Provider = mockBreacrumbsStore();
  });

  it('should render correctly', () => {
    expect(shallowToJson(shallow(<PlatformToolbar { ...initialProps } />))).toMatchSnapshot();
  });

  it('should call search callback', () => {
    const onFilterChange = jest.fn();
    const wrapper = mount(
      <MemoryRouter initialEntries={ [ '/platforms' ] }>
        <Provider>
          <PlatformToolbar { ...initialProps } onFilterChange={ onFilterChange } />
        </Provider>
      </MemoryRouter>
    );
    wrapper.find('input').simulate('change', { target: { value: 'Foo' }});
    expect(onFilterChange).toHaveBeenLastCalledWith(expect.any(String), expect.objectContaining({ target: { value: 'Foo' }}));
  });
});
