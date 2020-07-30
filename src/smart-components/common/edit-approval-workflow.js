import React, { useEffect, useReducer, useRef } from 'react';
import difference from 'lodash/difference';
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
  removeSearch,
  keepHash,
  querySelector,
  pushParam,
  objectName = () => objectType,
  onClose
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
  const isLoading = useSelector(
    ({ portfolioReducer: { isLoading } }) => isLoading
  );
  const dispatch = useDispatch();
  const history = useEnhancedHistory({ removeSearch, keepHash });
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

  const close = () => {
    onClose && onClose();
    history.push(pushParam);
  };

  const onSubmit = (formData) => {
    close();
    const unlinkArray = data
      .filter(
        ({ id }) =>
          !formData['initial-workflows'].find((workflow) => id === workflow.id)
      )
      .map(({ id }) => id);
    /**
     * prevent uneccesary unlink and link API calls of the same workflow
     */
    const linkDiff = difference(formData['new-workflows'], unlinkArray);
    const unLinkDiff = difference(unlinkArray, formData['new-workflows']);
    const toLinkWorkflows = linkDiff.filter(
      (id) => !data.find((item) => item.id === id)
    );
    const toUnlinkWorkflows = unLinkDiff.filter((id) =>
      data.find((item) => item.id === id)
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

  const isLoadingFinal = isLoading || isFetching;

  return (
    <Modal title={modalTitle} isOpen onClose={close} variant="small">
      {isLoadingFinal && <WorkflowLoader />}
      {!isLoadingFinal && (
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
              subscription={{ values: true }}
              initialValues={{
                'initial-workflows': data
              }}
              onSubmit={onSubmit}
              onCancel={close}
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
  removeSearch: PropTypes.bool,
  querySelector: PropTypes.oneOf([
    'portfolio',
    'platform',
    'inventory',
    'portfolio-item'
  ]).isRequired,
  keepHash: PropTypes.bool,
  onClose: PropTypes.func
};

EditApprovalWorkflow.defaultProps = {
  keepHash: false
};

export default EditApprovalWorkflow;
