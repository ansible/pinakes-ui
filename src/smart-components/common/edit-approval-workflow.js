import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { Modal } from '@patternfly/react-core';
import FormRenderer from '../common/form-renderer';
import editApprovalWorkflowSchema from '../../forms/edit-workflow_form.schema';
import { linkWorkflow } from '../../redux/actions/approval-actions';
import { APP_NAME } from '../../utilities/constants';
import { loadWorkflowOptions, resolveWorkflows } from '../../helpers/approval/approval-helper';
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

  useEffect(() => {
    resolveWorkflows({ object_type: objectType, app_name: APP_NAME, object_id: id || objectId })
    .then((data) => { setWorkflow(data); })
    .catch(() => setWorkflow({}));
  }, []);

  const onSubmit = values => {
    history.push(pushParam);
    return dispatch(linkWorkflow(values.workflow, { object_type: objectType, app_name: APP_NAME, object_id: id || objectId }));
  };

  return (
    <Modal
      title={ 'Set approval workflow' }
      isOpen
      onClose={ () => history.push(pushParam) }
      isSmall
    >
      { workflow ?
        <FormRenderer
          initialValues={ { workflow: workflow.id } }
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
