import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { MemoryRouter, Route } from 'react-router-dom';

import ItemDetailDescription from '../../../../smart-components/portfolio/portfolio-item-detail/item-detail-description';

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
        value: 'bar'
      }],
      workflow: 'foo',
      setWorkflow: jest.fn()
    };
  });

  it('should render correctly in edit variant', () => {
    const wrapper = shallow(
      <MemoryRouter initialEntries={ [ '/base/url/edit' ] }>
        <Route path="/base/url/edit" render={ () => <ItemDetailDescription { ...initialProps } /> } />
      </MemoryRouter>
    );
    expect(toJson(wrapper.find(ItemDetailDescription))).toMatchSnapshot();
  });
});
