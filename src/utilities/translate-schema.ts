import { Field, Schema } from '@data-driven-forms/react-form-renderer';
import { MessageDescriptor } from 'react-intl';
import schemasMessages from '../messages/schemas.messages';
import { FormatMessage } from '../types/common-types';

const translateString = (
  string: MessageDescriptor,
  formatMessage?: FormatMessage
) => {
  try {
    return formatMessage!(string);
  } catch {
    return string;
  }
};

const translateField = (
  field: Field,
  formatMessage: FormatMessage,
  translateKeys: string[]
) => {
  const fieldCopy: Field = { ...field };
  translateKeys.forEach((key) => {
    if (
      Object.prototype.hasOwnProperty.call(fieldCopy, key) &&
      typeof fieldCopy[key] === 'string' &&
      schemasMessages[fieldCopy[key] as keyof typeof schemasMessages]
    ) {
      fieldCopy[key] = translateString(
        schemasMessages[fieldCopy[key] as keyof typeof schemasMessages],
        formatMessage
      );
    }
  });
  if (
    Object.prototype.hasOwnProperty.call(fieldCopy, 'options') &&
    Array.isArray(fieldCopy.options)
  ) {
    fieldCopy.options = fieldCopy.options.map((option) =>
      translateString(
        schemasMessages[option.label as keyof typeof schemasMessages]
      )
        ? {
            ...option,
            label: translateString(
              schemasMessages[option.label as keyof typeof schemasMessages],
              formatMessage
            )
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
  schema: Schema,
  formatMessage: FormatMessage,
  translateKeys = ['label', 'placeholder', 'title', 'description']
): Schema => {
  const schemaCopy = { ...schema };
  schemaCopy.fields = schemaCopy.fields.map((field) =>
    translateField(field, formatMessage, translateKeys)
  );
  return schemaCopy;
};

export default translateSchema;
