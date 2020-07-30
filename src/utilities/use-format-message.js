const { useIntl } = require('react-intl');

const useFormatMessage = () => {
  const { formatMessage } = useIntl();
  return (message, values) => {
    try {
      return formatMessage(message, values);
    } catch (error) {
      console.error(error);
      return `Unable to translate message. Definition: ${message}, values: ${values}, intl-error: ${error}`;
    }
  };
};

export default useFormatMessage;
