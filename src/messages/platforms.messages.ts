import { defineMessages } from 'react-intl';

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
  platformsNoDataDescription: {
    id: 'platforms.list.configure-source',
    defaultMessage: 'To get started, add an Ansible Tower cluster as a source.'
  },
  connectSource: {
    id: 'platforms.list.connect-source',
    defaultMessage: 'Go to Sources'
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
  },
  platformVersion: {
    id: 'platforms.version',
    defaultMessage: 'Platform version'
  },
  ansibleVersion: {
    id: 'platforms.ansible.version',
    defaultMessage: 'Platform version'
  },
  platformDetails: {
    id: 'platforms.details',
    defaultMessage: 'Platform details'
  },
  mqttClientId: {
    id: 'platforms.version',
    defaultMessage: 'MQTT Client Id',

    AnsibleformVersion: {
      id: 'platforms.version',
      defaultMessage: 'Platform version'
    }
  }
});

export default platformsMessages;
