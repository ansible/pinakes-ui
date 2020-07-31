import React, { Fragment } from 'react';
const { useIntl } = require('react-intl');

const useFormatMessage = () => {
  const { formatMessage } = useIntl();
  return (message, values = {}) => {
    const internalValues = Object.entries(values).reduce(
      (acc, [key, value]) => {
        return {
          ...acc,
          [key]:
            typeof value === 'function'
              ? (chunks) => <Fragment key={key}>{value(chunks)}</Fragment>
              : value
        };
      },
      {}
    );
    try {
      return formatMessage(message, internalValues);
    } catch (error) {
      return `Unable to translate message. Definition: ${message}, values: ${values}, intl-error: ${error}`;
    }
  };
};

export default useFormatMessage;
