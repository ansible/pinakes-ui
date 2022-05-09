import { fetchTemplateByName } from '../helpers/template/template-helper';
import asyncDebounce from '../utilities/async-form-validator';
import formMessages from '../messages/form.messages';

const validateTitle = (title, id, intl) =>
  fetchTemplateByName(title).then(({ data }) => {
    const template = id
      ? data.find((t) => title === t.title && id !== t.id)
      : data.find((t) => title === t.title);

    if (template) {
      throw intl.formatMessage(formMessages.nameTaken);
    }
  });

export default asyncDebounce(validateTitle);
