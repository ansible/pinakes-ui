/* eslint-disable react/prop-types */
import React, { ReactNode, useRef } from 'react';
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
import TaggingModal, { Tag } from './tagging-modal';
import { Bold } from '../../presentational-components/shared/intl-rich-text-components';
import { CatalogLinkTo } from '../common/catalog-link';

export interface EditApprovalWorkflowProps {
  pushParam: CatalogLinkTo;
  objectType: keyof typeof APP_NAME;
  objectName: (node: string) => ReactNode;
  removeSearch?: boolean;
  querySelector: 'portfolio' | 'platform' | 'inventory' | 'portfolio-item';
  keepHash?: boolean;
  onClose: () => any;
}
const EditApprovalWorkflow: React.ComponentType<EditApprovalWorkflowProps> = ({
  objectType,
  removeSearch,
  keepHash = false,
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

  const onSubmit = (toLink: string[], toUnlink: string[]) => {
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
      title={modalTitle as string}
      onClose={close}
      onSubmit={onSubmit}
      getInitialTags={() =>
        listWorkflowsForObject({
          objectType,
          appName: APP_NAME[objectType],
          objectId: query[querySelector]
        }).then(({ data }) => data) as Promise<Tag[]>
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

export default EditApprovalWorkflow;
