import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import FormRenderer from '../common/form-renderer';
import editApprovalWorkflowSchema from '../../forms/edit-workflow_form.schema';
import { linkWorkflow } from '../../redux/actions/approval-actions';
import { APP_NAME } from '../../utilities/constants';

const EditApprovalWorkflow = ({ cancelUrl, type, id }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const onSubmit = values => {
    history.push(cancelUrl);
    return dispatch(linkWorkflow(values, type, APP_NAME, id));
  };

  return (
    <FormRenderer
      onSubmit={ onSubmit }
      canReset
      onCancel={ () => history.push(cancelUrl) }
      schema={ editApprovalWorkflowSchema }
      buttonsLabels={ { submitLabel: 'Save' } }
    />
  );
};

EditApprovalWorkflow.propTypes = {
  workflows: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.node.isRequired
  })).isRequired,
  cancelUrl: PropTypes.string.isRequired,
  type: PropTypes.object.isRequired,
  id: PropTypes.object.isRequired
};

export default EditApprovalWorkflow;
