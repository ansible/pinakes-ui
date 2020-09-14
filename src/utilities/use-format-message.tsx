import React, { Fragment, ReactNode } from 'react';
import { useIntl, MessageDescriptor } from 'react-intl';
import { AnyObject } from '../types/common-types';

export type UseFormatMessage<T = undefined> = () => (
  message: MessageDescriptor,
  values?: AnyObject
) => ReactNode | React.ComponentType<T>;

const useFormatMessage: UseFormatMessage = () => {
  const { formatMessage } = useIntl();
  return (message: MessageDescriptor, values = {}) => {
    const internalValues = Object.entries(values).reduce(
      (acc, [key, value]) => {
        return {
          ...acc,
          [key]:
            typeof value === 'function'
              ? (chunks: any) => <Fragment key={key}>{value(chunks)}</Fragment>
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
