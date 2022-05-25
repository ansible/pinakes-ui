const { defineMessages } = require('react-intl');

const templateMessages = defineMessages({
  edit: {
    id: 'templateMessages.edit',
    defaultMessage: 'Edit'
  },
  editInformation: {
    id: 'templateMessages.editInformation',
    defaultMessage: 'Edit information'
  },
  deleteTemplateTitle: {
    id: 'templateMessages.deleteTemplateTitle',
    defaultMessage: 'Delete template'
  },
  template: {
    id: 'templateMessages.template',
    defaultMessage: 'template'
  },
  templates: {
    id: 'templateMessages.templates',
    defaultMessage: 'templates'
  },
  noTemplates: {
    id: 'templateMessages.noTemplates',
    defaultMessage: 'No templates'
  },
  createTemplate: {
    id: 'templateMessages.createTemplate',
    defaultMessage: 'Create template'
  },
  removeTemplateTitle: {
    id: 'templateMessages.removeTemplateTitle',
    defaultMessage: 'Delete {count, plural, one {template} other {templates}}?'
  },
  removeTemplateAriaLabel: {
    id: 'templateMessages.removeTemplateTitle',
    defaultMessage:
      'Delete {count, plural, one {template} other {templates}} modal'
  },
  removeTemplateDescription: {
    id: 'templateMessages.removeTemplateDescription',
    defaultMessage: '{name} will be removed.'
  },
  removeTemplateDescriptionWithDeps: {
    id: 'templateMessages.removeTemplateDescriptionWithDeps',
    defaultMessage:
      '{name} will be removed from the following applications: {dependenciesList}'
  },
  editTemplateTitle: {
    id: 'templateMessages.editTemplateTitle',
    defaultMessage: 'Make any changes to template {name}'
  },
  addTemplateSuccessTitle: {
    id: 'templateMessages.addTemplateSuccessTitle',
    defaultMessage: 'Success adding template'
  },
  addTemplateSuccessDescription: {
    id: 'templateMessages.addTemplateSuccessDescription',
    defaultMessage: 'The template was added successfully.'
  },
  updateTemplateSuccessTitle: {
    id: 'templateMessages.updateTemplateSuccessTitle',
    defaultMessage: 'Success updating template'
  },
  updateTemplateSuccessDescription: {
    id: 'templateMessages.updateTemplateSuccessDescription',
    defaultMessage: 'The template was updated successfully.'
  },
  repositionTemplateSuccessTitle: {
    id: 'templateMessages.repositionTemplateSuccessTitle',
    defaultMessage: 'Success updating template sequence'
  },
  repositionTemplateSuccessDescription: {
    id: 'templateMessages.repositionTemplateSuccessDescription',
    defaultMessage: `The template' sequence was updated successfully.`
  },
  removeTemplateSuccessTitle: {
    id: 'templateMessages.removeTemplateSuccessTitle',
    defaultMessage: 'Success removing template'
  },
  removeTemplateSuccessDescription: {
    id: 'templateMessages.removeTemplateSuccessDescription',
    defaultMessage: 'The template was removed successfully.'
  },
  removeTemplatesSuccessTitle: {
    id: 'templateMessages.removeTemplatesSuccessTitle',
    defaultMessage: 'Success removing templates'
  },
  removeTemplatesSuccessDescription: {
    id: 'templateMessages.removeTemplatesSuccessDescription',
    defaultMessage: 'The selected templates were removed successfully.'
  },
  up: {
    id: 'templateMessages.up',
    defaultMessage: 'up'
  },
  down: {
    id: 'templateMessages.down',
    defaultMessage: 'down'
  },
  processMethod: {
    id: 'templateMessages.processMethod',
    defaultMessage: 'Process method'
  },
  signalMethod: {
    id: 'templateMessages.signalMethod',
    defaultMessage: 'Signal method'
  }
});

export default templateMessages;
