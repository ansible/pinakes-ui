export default {
  create_json_schema: {
    type: 'object',
    $schema: 'http://json-schema.org/draft-04/schema',
    properties: {
      NAMESPACE: {
        type: 'string',
        title: 'Jenkins ImageStream Namespace',
        default: 'openshift',
        description: 'The OpenShift Namespace where the Jenkins ImageStream resides.'
      },
      ENABLE_OAUTH: {
        type: 'string',
        title: 'Enable OAuth in Jenkins',
        default: 'true',
        description: 'Whether to enable OAuth OpenShift integration. If false, the static account \'admin\' will be initialized with the password \'password\'.' // eslint-disable-line max-len
      },
      MEMORY_LIMIT: {
        type: 'string',
        title: 'Memory Limit',
        default: '512Mi',
        description: 'Maximum amount of memory the container can use.'
      }
    },
    additionalProperties: false
  }
};
