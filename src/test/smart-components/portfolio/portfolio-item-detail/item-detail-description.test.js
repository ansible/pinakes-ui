import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { MemoryRouter, Route } from 'react-router-dom';

import ItemDetailDescription from '../../../../SmartComponents/Portfolio/portfolio-item-detail/item-detail-description';

describe('<ItemDetailDescription />', () => {
  let initialProps;

  beforeEach(() => {
    initialProps = {
      product: {
        description: 'Product description',
        long_description: 'Product long description',
        support_url: 'some/support/url',
        documentation_url: 'some/documention/url'
      },
      url: '/base/url',
      workflows: [{
        label: 'Foo',
        value: 'foo'
      }, {
        label: 'Bar',
        value: null
      }],
      workflow: 'foo',
      setWorkflow: jest.fn()
    };
  });

  it('should render correctly', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={ [ '/base/url' ] }>
        <Route path="/base/url" render={ () => <ItemDetailDescription { ...initialProps } /> } />
      </MemoryRouter>
    );
    expect(toJson(wrapper.find(ItemDetailDescription))).toMatchSnapshot();
  });

  it('should render correctly in edit variant', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={ [ '/base/url/edit' ] }>
        <Route path="/base/url/edit" render={ () => <ItemDetailDescription { ...initialProps } /> } />
      </MemoryRouter>
    );
    expect(toJson(wrapper.find(ItemDetailDescription))).toMatchSnapshot();
  });
});
