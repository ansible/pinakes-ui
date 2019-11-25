import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { Modal } from '@patternfly/react-core';
import FormRenderer from '../common/form-renderer';
import editApprovalWorkflowSchema from '../../forms/edit-workflow_form.schema';
import { linkWorkflow, unlinkWorkflow } from '../../redux/actions/approval-actions';
import { APP_NAME } from '../../utilities/constants';
import { loadWorkflowOptions, listWorkflowsForObject } from '../../helpers/approval/approval-helper';
import { WorkflowLoader } from '../../presentational-components/shared/loader-placeholders';

const EditApprovalWorkflow = ({ closeUrl, objectType, objectId }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { search } = useLocation();
  const { id } = useParams();
  const pushParam = {
    pathname: closeUrl,
    search
  };
  const [ workflow, setWorkflow ] = useState(undefined);
  const [ isFetching, setFetching ] = useState(true);

  useEffect(() => {
    listWorkflowsForObject({ objectType, appName: APP_NAME, objectId: id || objectId })
    .then((data) => { setWorkflow(data && data.data ? data.data[0] : undefined); setFetching(false); })
    .catch(() => setWorkflow(undefined));
  }, []);

  const onSubmit = values => {
    history.push(pushParam);
    if (workflow && workflow.id === values.workflow) {
      return;
    }

    if (workflow) {
      dispatch(unlinkWorkflow(workflow.id, workflow.name, { object_type: objectType, app_name: APP_NAME, object_id: id || objectId }));
    }

    return dispatch(linkWorkflow(values.workflow, { object_type: objectType, app_name: APP_NAME, object_id: id || objectId }));
  };

  return (
    <Modal
      title={ 'Set approval workflow' }
      isOpen
      onClose={ () => history.push(pushParam) }
      isSmall
    >
      { !isFetching ?
        <FormRenderer
          initialValues={ { workflow: workflow ? workflow.id : undefined } }
          onSubmit={ onSubmit }
          onCancel={ () => history.push(pushParam) }
          schema={ editApprovalWorkflowSchema(loadWorkflowOptions) }
          formContainer="modal"
          buttonsLabels={ { submitLabel: 'Save' } }
        /> : <WorkflowLoader/> }
    </Modal>
  );
};

EditApprovalWorkflow.propTypes = {
  closeUrl: PropTypes.string.isRequired,
  objectType: PropTypes.string.isRequired,
  objectId: PropTypes.string
};

export default EditApprovalWorkflow;
