import React, { useEffect, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { Modal } from '@patternfly/react-core';

import { updateWorkflow } from '../../redux/actions/workflow-actions';
import routes from '../../constants/approval-routes';
import FormRenderer from '../common/form-renderer';
import addWorkflowSchema from '../../forms/add-workflow.schema';
import worfklowMessages from '../../messages/workflows.messages';
import useQuery from '../../utilities/use-query';
import useWorkflow from '../../utilities/use-workflows';
import { fetchWorkflow } from '../../helpers/workflow/workflow-helper';
import { WorkflowInfoFormLoader } from '../../presentational-components/shared/approval-loader-placeholders';
import commonMessages from '../../messages/common.message';
import FormTemplate from '@data-driven-forms/pf4-component-mapper/form-template';
import { defaultSettings } from '../../helpers/shared/approval-pagination';

const reducer = (state, { type, initialValues, schema }) => {
  switch (type) {
    case 'loaded':
      return {
        ...state,
        initialValues,
        schema,
        isLoading: false
      };
    default:
      return state;
  }
};

const prepareInitialValues = (wfData) => {
  const groupOptions = wfData.group_refs.map((group) => ({
    label: group.name,
    value: group.uuid
  }));
  return { ...wfData, group_refs: [], current_groups: groupOptions };
};

// eslint-disable-next-line react/prop-types
const EditWorkflow = ({ postMethod, pagination = defaultSettings }) => {
  const dispatch = useDispatch();
  const { push } = useHistory();
  const intl = useIntl();
  const [{ workflow: id }] = useQuery(['workflow']);
  const loadedWorkflow = useWorkflow(id);

  const [
    { initialValues, schema, isLoading },
    stateDispatch
  ] = useReducer(reducer, { isLoading: true });

  useEffect(() => {
    if (!loadedWorkflow) {
      fetchWorkflow(id).then((data) =>
        stateDispatch({
          type: 'loaded',
          initialValues: prepareInitialValues(data),
          schema: addWorkflowSchema(intl, data.id)
        })
      );
    } else {
      stateDispatch({
        type: 'loaded',
        initialValues: prepareInitialValues(loadedWorkflow),
        schema: addWorkflowSchema(intl, loadedWorkflow.id)
      });
    }
  }, []);

  const onCancel = () => push(routes.workflows.index);

  const onSave = ({ group_refs = [], description = '', ...values }) => {
    console.log('workflows - postMethod, pagination: ', postMethod, pagination);
    onCancel();
    const groups = values.current_groups
      ? values.current_groups.concat(
          group_refs?.filter((item) => values.current_groups.indexOf(item) < 0)
        )
      : group_refs;
    console.log(
      'Debug - workflows - groups, values, group_refs',
      groups,
      values
    );
    const workflowData = {
      ...values,
      description,
      group_refs: groups.map((group) => ({
        name: group.label,
        uuid: group.value
      }))
    };
    delete workflowData.current_groups;
    return dispatch(updateWorkflow(workflowData, intl))
      .then(() => postMethod({ ...pagination }))
      .then(() => push(routes.workflows.index));
  };

  return (
    <Modal
      isOpen
      onClose={onCancel}
      title={intl.formatMessage(worfklowMessages.editInformation)}
      description={
        !isLoading &&
        intl.formatMessage(worfklowMessages.editProcessTitle, {
          name: initialValues.name
        })
      }
      variant="small"
    >
      {isLoading && <WorkflowInfoFormLoader />}
      {!isLoading && (
        <FormRenderer
          onSubmit={onSave}
          onCancel={onCancel}
          schema={schema}
          initialValues={initialValues}
          FormTemplate={(props) => (
            <FormTemplate
              {...props}
              submitLabel={intl.formatMessage(commonMessages.save)}
              buttonClassName="pf-u-mt-0"
              disableSubmit={['validating', 'pristine']}
            />
          )}
        />
      )}
    </Modal>
  );
};

export default EditWorkflow;
