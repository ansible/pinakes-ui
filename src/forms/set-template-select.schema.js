import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import loadTemplatesOptions from './load-templates-debounced';
import worfklowMessages from '../messages/workflows.messages';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';

const setTemplateSelectSchema = (intl) => ({
  component: componentTypes.SELECT,
  label: intl.formatMessage(worfklowMessages.template),
  name: 'template',
  isSearchable: true,
  isRequired: true,
  loadOptions: loadTemplatesOptions,
  validate: [{ type: validatorTypes.REQUIRED }]
});

export default setTemplateSelectSchema;
