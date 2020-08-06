import schemasMessages from '../messages/schemas.messages';

const translateString = (string, formatMessage) => {
  try {
    return formatMessage(string);
  } catch {
    return string;
  }
};

const translateField = (field, formatMessage, translateKeys) => {
  const fieldCopy = { ...field };
  translateKeys.forEach((key) => {
    if (
      Object.prototype.hasOwnProperty.call(fieldCopy, key) &&
      typeof fieldCopy[key] === 'string' &&
      schemasMessages[fieldCopy[key]]
    ) {
      fieldCopy[key] = translateString(
        schemasMessages[fieldCopy[key]],
        formatMessage
      );
    }
  });
  if (
    Object.prototype.hasOwnProperty.call(fieldCopy, 'options') &&
    Array.isArray(fieldCopy.options)
  ) {
    fieldCopy.options = fieldCopy.options.map((option) =>
      translateString(schemasMessages[option.label])
        ? {
            ...option,
            label: translateString(schemasMessages[option.label], formatMessage)
          }
        : option
    );
  }

  if (
    Object.prototype.hasOwnProperty.call(fieldCopy, 'fields') &&
    Array.isArray(fieldCopy.fields)
  ) {
    fieldCopy.fields = fieldCopy.fields.map((field) =>
      translateField(field, formatMessage, translateKeys)
    );
  }

  return fieldCopy;
};

const translateSchema = (
  schema,
  formatMessage,
  translateKeys = ['label', 'placeholder', 'title', 'description']
) => {
  const schemaCopy = { ...schema };
  schemaCopy.fields = schemaCopy.fields.map((field) =>
    translateField(field, formatMessage, translateKeys)
  );
  return schemaCopy;
};

export default translateSchema;
