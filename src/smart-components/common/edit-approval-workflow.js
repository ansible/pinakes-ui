import React, { useEffect, useReducer, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  Modal,
  TextContent,
  Text,
  Stack,
  StackItem
} from '@patternfly/react-core';
import FormRenderer from '../common/form-renderer';
import editApprovalWorkflowSchema from '../../forms/edit-workflow_form.schema';
import {
  listWorkflowsForObject,
  updateWorkflows
} from '../../redux/actions/approval-actions';
import { APP_NAME } from '../../utilities/constants';
import { loadWorkflowOptions } from '../../helpers/approval/approval-helper';
import { WorkflowLoader } from '../../presentational-components/shared/loader-placeholders';
import useQuery from '../../utilities/use-query';
import useEnhancedHistory from '../../utilities/use-enhanced-history';
import { useIntl, defineMessage } from 'react-intl';
import actionMessages from '../../messages/actions.messages';
import approvalMessages from '../../messages/approval.messages';

const initialState = {
  isFetching: true
};

const approvalState = (state, action) => {
  switch (action.type) {
    case 'setFetching':
      return { ...state, isFetching: action.payload };
    default:
      return state;
  }
};

const EditApprovalWorkflow = ({
  objectType,
  removeQuery,
  keepHash,
  querySelector,
  pushParam,
  objectName = () => objectType
}) => {
  const { formatMessage } = useIntl();
  const { current: modalTitle } = useRef(
    formatMessage(
      defineMessage({
        id: 'workflows.modal.title',
        defaultMessage: 'Set approval process'
      })
    )
  );
  const [{ isFetching }, stateDispatch] = useReducer(
    approvalState,
    initialState
  );
  const { data, meta } = useSelector(
    ({ approvalReducer: { resolvedWorkflows } }) => resolvedWorkflows
  );
  const dispatch = useDispatch();
  const history = useEnhancedHistory({ removeQuery, keepHash });
  const [query] = useQuery([querySelector]);

  useEffect(() => {
    dispatch(
      listWorkflowsForObject(
        {
          objectType,
          appName: APP_NAME[objectType],
          objectId: query[querySelector]
        },
        meta
      )
    ).then(() => stateDispatch({ type: 'setFetching', payload: false }));
  }, []);

  const onSubmit = (formData, formApi) => {
    const initialWorkflows =
      formApi.getState().initialValues.selectedWorkflows || [];
    const newWorkflows = formData.selectedWorkflows || [];

    history.push(pushParam);
    const toUnlinkWorkflows = initialWorkflows.filter(
      (wf) => newWorkflows.findIndex((w) => w === wf) < 0
    );
    const toLinkWorkflows = newWorkflows.filter(
      (wf) => initialWorkflows.findIndex((w) => w === wf) < 0
    );

    if (toUnlinkWorkflows.length > 0 || toLinkWorkflows.length > 0) {
      dispatch(
        updateWorkflows(toUnlinkWorkflows, toLinkWorkflows, {
          object_type: objectType,
          app_name: APP_NAME[objectType],
          object_id: query[querySelector]
        })
      );
    }
  };

  return (
    <Modal
      title={modalTitle}
      isOpen
      onClose={() => history.push(pushParam)}
      variant="small"
    >
      {isFetching && <WorkflowLoader />}
      {!isFetching && (
        <Stack hasGutter>
          <StackItem>
            <TextContent>
              <Text>
                {formatMessage(approvalMessages.setWorkflow, {
                  // eslint-disable-next-line react/display-name
                  strong: (chunks) => <strong>{chunks}</strong>,
                  objectName: objectName(query[querySelector])
                })}
              </Text>
            </TextContent>
          </StackItem>
          <StackItem>
            <FormRenderer
              initialValues={{
                selectedWorkflows: data ? data.map((wf) => wf.id) : undefined
              }}
              onSubmit={onSubmit}
              onCancel={() => history.push(pushParam)}
              schema={editApprovalWorkflowSchema(loadWorkflowOptions)}
              formContainer="modal"
              templateProps={{
                submitLabel: formatMessage(actionMessages.save)
              }}
            />
          </StackItem>
        </Stack>
      )}
    </Modal>
  );
};

EditApprovalWorkflow.propTypes = {
  pushParam: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      search: PropTypes.string
    })
  ]).isRequired,
  objectType: PropTypes.string.isRequired,
  objectName: PropTypes.func,
  removeQuery: PropTypes.bool,
  querySelector: PropTypes.oneOf([
    'portfolio',
    'platform',
    'inventory',
    'portfolio-item'
  ]).isRequired,
  keepHash: PropTypes.bool
};

EditApprovalWorkflow.defaultProps = {
  keepHash: false
};

export default EditApprovalWorkflow;
