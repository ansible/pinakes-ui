import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { updateWorkflows } from '../../redux/actions/approval-actions';
import { APP_NAME } from '../../utilities/constants';
import {
  loadWorkflowOptions,
  listWorkflowsForObject
} from '../../helpers/approval/approval-helper';
import useQuery from '../../utilities/use-query';
import useEnhancedHistory from '../../utilities/use-enhanced-history';
import { defineMessage } from 'react-intl';
import approvalMessages from '../../messages/approval.messages';
import useFormatMessage from '../../utilities/use-format-message';
import TaggingModal from './tagging-modal';
import { Bold } from '../../presentational-components/shared/intl-rich-text-components';

const EditApprovalWorkflow = ({
  objectType,
  removeSearch,
  keepHash,
  querySelector,
  pushParam,
  objectName = () => objectType,
  onClose
}) => {
  const formatMessage = useFormatMessage();
  const { current: modalTitle } = useRef(
    formatMessage(
      defineMessage({
        id: 'workflows.modal.title',
        defaultMessage: 'Set approval process'
      })
    )
  );
  const dispatch = useDispatch();
  const history = useEnhancedHistory({ removeSearch, keepHash });
  const [query] = useQuery([querySelector]);

  const close = () => {
    onClose && onClose();
    history.push(pushParam);
  };

  const onSubmit = (toLink, toUnlink) => {
    close();
    dispatch(
      updateWorkflows(toLink, toUnlink, {
        object_type: objectType,
        app_name: APP_NAME[objectType],
        object_id: query[querySelector]
      })
    );
  };

  return (
    <TaggingModal
      title={modalTitle}
      onClose={close}
      onSubmit={onSubmit}
      getInitialTags={() =>
        listWorkflowsForObject({
          objectType,
          appName: APP_NAME[objectType],
          objectId: query[querySelector]
        }).then(({ data }) => data)
      }
      loadTags={loadWorkflowOptions}
      subTitle={formatMessage(approvalMessages.setWorkflow, {
        strong: Bold,
        objectName: objectName(query[querySelector])
      })}
      existingTagsMessage={formatMessage(approvalMessages.currentWorkflows)}
    />
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
