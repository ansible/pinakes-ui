import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { Modal } from '@patternfly/react-core';
import FormRenderer from '../common/form-renderer';
import editApprovalWorkflowSchema from '../../forms/edit-workflow_form.schema';
import { linkWorkflow } from '../../redux/actions/approval-actions';
import { APP_NAME } from '../../utilities/constants';
import { loadWorkflowOptions } from '../../helpers/approval/approval-helper';

const EditApprovalWorkflow = ({ closeUrl, objectType, objectId }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();

  const onSubmit = values => {
    history.push(closeUrl);
    return dispatch(linkWorkflow(values.workflow, { object_type: objectType, app_name: APP_NAME, object_id: id || objectId }));
  };

  return (
    <Modal
      title={ 'Set approval workflow' }
      isOpen
      onClose={ () => history.push(closeUrl) }
      isSmall
    >
      <FormRenderer
        onSubmit={ onSubmit }
        onCancel={ () => history.push(closeUrl) }
        schema={ editApprovalWorkflowSchema(loadWorkflowOptions) }
        formContainer="modal"
        buttonsLabels={ { submitLabel: 'Save' } }
      />
    </Modal>
  );
};

EditApprovalWorkflow.propTypes = {
  closeUrl: PropTypes.string.isRequired,
  objectType: PropTypes.object.isRequired,
  objectId: PropTypes.object
};

export default EditApprovalWorkflow;
