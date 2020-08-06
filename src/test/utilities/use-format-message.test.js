import React from 'react';
import { mount } from 'enzyme';
import { mountToJson } from 'enzyme-to-json';

const { IntlProvider, defineMessage } = require('react-intl');
const {
  default: useFormatMessage
} = require('../../utilities/use-format-message');

describe('useFormatMessage', () => {
  const HookedComponent = ({ definedMessage, messageValues }) => {
    const formatMessage = useFormatMessage();
    return <span>{formatMessage(definedMessage, messageValues)}</span>;
  };

  const MessageDummy = ({ definedMessage, messageValues }) => (
    <IntlProvider locale="en">
      <HookedComponent
        messageValues={messageValues}
        definedMessage={definedMessage}
      />
    </IntlProvider>
  );

  it('should return translated simple message', () => {
    const message = defineMessage({ id: 'foo', defaultMessage: 'Foo' });
    const wrapper = mount(<MessageDummy definedMessage={message} />);
    expect(mountToJson(wrapper)).toMatchSnapshot();
  });

  it('should return fallback message if the message is not defined properly', () => {
    let message = defineMessage({ defaultMessage: 'Foo' });
    let wrapper = mount(<MessageDummy definedMessage={message} />);
    expect(mountToJson(wrapper)).toMatchSnapshot();

    message = defineMessage('nonsense');
    wrapper = mount(<MessageDummy definedMessage={message} />);
    expect(mountToJson(wrapper)).toMatchSnapshot();
  });

  it('should assign values to message properly', () => {
    const message = defineMessage({
      id: 'foo',
      defaultMessage: 'Foo {foo} bar {bar}'
    });
    const wrapper = mount(
      <MessageDummy
        definedMessage={message}
        messageValues={{ foo: 'foo value', bar: 'bar value' }}
      />
    );
    expect(mountToJson(wrapper)).toMatchSnapshot();
  });

  /**
   * Fragment is not visible in snapshot, but it does not throw that missing key error in the console.
   * Can do really spy on console.error since that can return false negative due to other tests
   */
  it('should wrap rich text value to fragment to prevent missing key error', () => {
    const message = defineMessage({
      id: 'foo',
      defaultMessage: 'Foo {foo} bar <b>{bar}</b>'
    });
    const wrapper = mount(
      <MessageDummy
        definedMessage={message}
        messageValues={{
          foo: 'foo value',
          bar: 'bar value',
          b: (chunks) => <b>{chunks}</b>
        }}
      />
    );
    expect(mountToJson(wrapper)).toMatchSnapshot();
  });
});
