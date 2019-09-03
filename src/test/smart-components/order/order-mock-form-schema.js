export default {
  name: '',
  description: '',
  id: '911153',
  create_json_schema: {
    schema: {
      title: '',
      fields: [
        {
          name: 'username',
          label: 'What is your name',
          component: 'text-field',
          helperText: '',
          isRequired: true,
          initialValue: ''
        },
        {
          name: 'quest',
          label: 'What is your quest?',
          options: [
            {
              label: 'Test Approval',
              value: 'Test Approval'
            },
            {
              label: 'Test Catalog',
              value: 'Test Catalog'
            },
            {
              label: 'Test Topology',
              value: 'Test Topology'
            },
            {
              label: 'Seek the Holy Grail',
              value: 'Seek the Holy Grail'
            }
          ],
          component: 'select-field',
          helperText: '',
          isRequired: true,
          initialValue: ''
        },
        {
          name: 'airspeed',
          type: 'number',
          label: 'What is the airspeed velocity of an unladen swallow?',
          dataType: 'float',
          component: 'text-field',
          helperText: 'Type: Float',
          initialValue: ''
        },
        {
          name: 'int_value',
          type: 'number',
          label: 'Integer value',
          dataType: 'integer',
          component: 'text-field',
          helperText: '',
          isRequired: true,
          initialValue: 5
        }
      ],
      description: ''
    },
    schemaType: 'default'
  }
};
