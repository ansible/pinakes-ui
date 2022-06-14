import { fetchWorkflowByName } from '../helpers/workflow/workflow-helper';
import asyncDebounce from '../utilities/async-form-validator';
import formMessages from '../messages/form.messages';

const validateName = (name, id, intl) => {
  return name
    ? fetchWorkflowByName(name).then(({ data }) => {
        const workflow = id
          ? data.find((wf) => name === wf.name && id !== wf.id)
          : data.find((wf) => name === wf.name);

        if (workflow) {
          throw intl.formatMessage(formMessages.nameTaken);
        }
      })
    : true;
};

export default asyncDebounce(validateName);
