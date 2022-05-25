import workflowInfoSchema from './workflow-info.schema';
import setTemplateSelectSchema from './set-template-select.schema';
import setGroupSelectSchema from './set-group-select.schema';
import setCurrentGroupsSchema from './set-current-groups.schema';

const addWorkflowSchema = (intl, id) => ({
  fields: [
    ...workflowInfoSchema(intl, id),
    setTemplateSelectSchema(intl),
    setGroupSelectSchema(intl),
    setCurrentGroupsSchema(intl)
  ]
});

export default addWorkflowSchema;
