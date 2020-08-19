const { defineMessages } = require('react-intl');

const platformsMessages = defineMessages({
  workflowColumn: {
    id: 'platform.inventories.columns.workflow',
    defaultMessage: 'Workflow'
  },
  noInventoriesDescription: {
    id: 'platform.inventories.empty.no-inventories',
    defaultMessage: 'No inventories found.'
  },
  noInventoriesFilterDescription: {
    id: 'platform.inventories.empty.no-results',
    defaultMessage: 'No inventories match your filter criteria.'
  },
  inventoriesFilter: {
    id: 'platform.inventories.filter.placeholder',
    defaultMessage: 'Filter by inventory'
  },
  templatesFilter: {
    id: 'platform.templates.filter.placeholder',
    defaultMessage: 'Filter by template'
  },
  noTemplatesTitle: {
    id: 'platform.templates.no-templates',
    defaultMessage: 'No templates'
  },
  noTemplatesDescription: {
    id: 'platform.templates.empty.no-templates',
    defaultMessage: 'This platform has no templates.'
  },
  configureSourceTitle: {
    id: 'platforms.list.configure-source',
    defaultMessage: 'Configure a source in order to add products to portfolios.'
  },
  connectSource: {
    id: 'platforms.list.connect-source',
    defaultMessage:
      'To connect to a source, go to <a>Sources</a> under Settings.'
  },
  contactAdmin: {
    id: 'platforms.list.contact-admin',
    defaultMessage:
      'Contact your organization administrator to setup sources for Catalog.'
  },
  title: {
    id: 'platforms.title',
    defaultMessage: 'Platforms'
  },
  noPlatforms: {
    id: 'platforms.list.empty.title',
    defaultMessage: 'No platforms yet'
  },
  offeringTitle: {
    id: 'platforms.offerings.detail.title',
    defaultMessage: 'Service offering'
  },
  offeringParameters: {
    id: 'platforms.offerings.detail.extra-params',
    defaultMessage: 'Extra parameters'
  }
});

export default platformsMessages;
