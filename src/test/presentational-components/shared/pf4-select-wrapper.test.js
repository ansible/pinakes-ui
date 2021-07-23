import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Pf4SelectWrapper } from '../../../presentational-components/shared/pf4-select-wrapper';
import { InternalSelect } from '@data-driven-forms/pf4-component-mapper/select';
import Form from '@data-driven-forms/react-form-renderer/form';

describe('<Pf4SelectWrapper />', () => {
  let initialProps;
  beforeEach(() => {
    initialProps = {
      id: 'bazz',
      name: 'bazz',
      options: [
        {
          label: 'Foo',
          value: 'bar'
        }
      ]
    };
  });

  it('should render correctly', () => {
    const wrapper = shallow(
      <Form onSubmit={Function}>
        {() => <Pf4SelectWrapper {...initialProps} />}
      </Form>
    ).dive();
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should create empty option', () => {
    const wrapper = mount(
      <Form onSubmit={Function}>
        {() => <Pf4SelectWrapper {...initialProps} />}
      </Form>
    );
    const options = wrapper.find(InternalSelect).props().options;
    expect(options).toHaveLength(2);
  });

  it('should create empty option for required field', () => {
    const wrapper = mount(
      <Form onSubmit={Function}>
        {() => <Pf4SelectWrapper isRequired {...initialProps} />}
      </Form>
    );
    const options = wrapper.find(InternalSelect).props().options;
    expect(options).toHaveLength(2);
    expect(options[0].label).toEqual('Please choose');
  });

  it('should not create empty option', () => {
    const wrapper = mount(
      <Form onSubmit={Function}>
        {() => (
          <Pf4SelectWrapper
            {...initialProps}
            options={[{ label: 'Foo', value: 'bar' }, { label: 'Empty value' }]}
          />
        )}
      </Form>
    );
    const options = wrapper.find(InternalSelect).props().options;
    expect(options).toHaveLength(2);
  });

  it('should not create empty option if select has value and is required', () => {
    const wrapper = mount(
      <Form onSubmit={Function}>
        {() => (
          <Pf4SelectWrapper
            isRequired
            {...initialProps}
            initialValue="bar"
            options={[{ label: 'Foo', value: 'bar' }]}
          />
        )}
      </Form>
    );
    const options = wrapper.find(InternalSelect).props().options;
    expect(options).toHaveLength(1);
  });

  it('should render correctly in error state', () => {
    const wrapper = shallow(
      <Form onSubmit={Function}>
        {() => (
          <Pf4SelectWrapper
            {...initialProps}
            isRequired
            validate={() => false}
          />
        )}
      </Form>
    ).dive();
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render correctly with description', () => {
    const wrapper = shallow(
      <Form onSubmit={Function}>
        {() => <Pf4SelectWrapper {...initialProps} description="description" />}
      </Form>
    ).dive();
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
