import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import ItemDetailInfoBar from '../../../../smart-components/portfolio/portfolio-item-detail/item-detail-info-bar';

describe('<ItemDetailInfoBar />', () => {
  let initialProps;
  beforeAll(() => {
    Date.now = jest
      .spyOn(Date, 'now')
      .mockImplementation(() =>
        new Date(
          'Fri Mar 22 2018 08:36:57 GMT+0100 (Central European Standard Time)'
        ).getTime()
      );
  });
  beforeEach(() => {
    initialProps = {
      product: {
        distributor: 'foo',
        service_offering_source_ref: '111',
        updated_at:
          'Fri Mar 22 2019 08:36:57 GMT+0100 (Central European Standard Time)',
        created_at:
          'Fri Mar 22 2019 08:36:57 GMT+0100 (Central European Standard Time)'
      },
      source: {
        id: '111',
        name: 'bar'
      },
      portfolio: {
        display_name: 'baz',
        name: 'quux'
      }
    };
  });

  it('should render correctly', () => {
    const wrapper = mount(<ItemDetailInfoBar {...initialProps} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render correctly with fallback values without vendor', () => {
    initialProps = {
      product: {
        created_at:
          'Fri Mar 22 2019 08:36:57 GMT+0100 (Central European Standard Time)',
        service_offering_source_ref: '111'
      },
      source: {
        id: '111',
        name: 'bar'
      },
      portfolio: {
        name: 'quux'
      }
    };
    const wrapper = mount(<ItemDetailInfoBar {...initialProps} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render correctly with vendor', () => {
    const wrapper = mount(
      <ItemDetailInfoBar {...initialProps} distributor="Foo distributor" />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
