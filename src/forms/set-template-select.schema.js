import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import loadTemplatesOptions from './load-templates-debounced';
import worfklowMessages from '../messages/workflows.messages';

const setTemplateSelectSchema = (intl) => ({
  component: componentTypes.SELECT,
  label: intl.formatMessage(worfklowMessages.template),
  name: 'template',
  simpleValue: true,
  loadOptions: loadTemplatesOptions
});

export default setTemplateSelectSchema;
