import React, { useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { Modal } from '@patternfly/react-core';
import FormRenderer from '../common/form-renderer';
import editApprovalWorkflowSchema from '../../forms/edit-workflow_form.schema';
import {
  listWorkflowsForObject,
  updateWorkflows
} from '../../redux/actions/approval-actions';
import { APP_NAME } from '../../utilities/constants';
import { loadWorkflowOptions } from '../../helpers/approval/approval-helper';
import { WorkflowLoader } from '../../presentational-components/shared/loader-placeholders';

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
  closeUrl,
  objectType,
  objectId,
  objectName = () => objectType
}) => {
  const [{ isFetching }, stateDispatch] = useReducer(
    approvalState,
    initialState
  );
  const { data, meta } = useSelector(
    ({ approvalReducer: { resolvedWorkflows } }) => resolvedWorkflows
  );
  const dispatch = useDispatch();
  const { id } = useParams();
  const history = useHistory();
  const pushParam = {
    pathname: closeUrl
  };

  useEffect(() => {
    dispatch(
      listWorkflowsForObject(
        { objectType, appName: APP_NAME[objectType], objectId: id || objectId },
        meta
      )
    ).then(() => stateDispatch({ type: 'setFetching', payload: false }));
  }, []);

  const onSubmit = (formData, formApi) => {
    const initialWorkflows = formApi.getState().initialValues.selectedWorkflows;
    history.push(pushParam);
    const toUnlinkWorkflows = initialWorkflows.filter(
      (wf) => formData.selectedWorkflows.findIndex((w) => w === wf) < 0
    );
    const toLinkWorkflows = formData.selectedWorkflows.filter(
      (wf) => initialWorkflows.findIndex((w) => w === wf) < 0
    );

    if (toUnlinkWorkflows || toLinkWorkflows) {
      dispatch(
        updateWorkflows(toUnlinkWorkflows, toLinkWorkflows, {
          object_type: objectType,
          app_name: APP_NAME[objectType],
          object_id: id || objectId
        })
      );
    }
  };

  return (
    <Modal
      title={`Set approval process for ${objectName(id)}`}
      isOpen
      onClose={() => history.push(pushParam)}
      isSmall
    >
      {!isFetching ? (
        <FormRenderer
          initialValues={{
            selectedWorkflows: data ? data.map((wf) => wf.id) : undefined
          }}
          onSubmit={onSubmit}
          onCancel={() => history.push(pushParam)}
          schema={editApprovalWorkflowSchema(loadWorkflowOptions)}
          formContainer="modal"
          buttonsLabels={{ submitLabel: 'Save' }}
        />
      ) : (
        <WorkflowLoader />
      )}
    </Modal>
  );
};

EditApprovalWorkflow.propTypes = {
  closeUrl: PropTypes.string.isRequired,
  objectType: PropTypes.string.isRequired,
  objectName: PropTypes.func,
  objectId: PropTypes.string
};

export default EditApprovalWorkflow;
