import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import difference from 'lodash/difference';
import {
  Modal,
  Stack,
  StackItem,
  TextContent,
  Text
} from '@patternfly/react-core';
import FormRenderer from '../common/form-renderer';
import createSchema from '../../forms/set-object-tags.schema';
import { WorkflowLoader } from '../../presentational-components/shared/loader-placeholders';
import useFormatMessage from '../../utilities/use-format-message';
import actionMessages from '../../messages/actions.messages';

const TaggingModal = ({
  loadTags,
  onSubmit,
  getInitialTags,
  onClose,
  title,
  subTitle,
  existingTagsMessage,
  ...rest
}) => {
  const formatMessage = useFormatMessage();
  const [data, setData] = useState();
  useEffect(() => {
    getInitialTags().then((data) => setData(data));
  }, []);
  const handleSubmit = (formData) => {
    const unlinkArray = data
      .filter(
        ({ id }) =>
          !formData['initial-tags'].find((process) => id === process.id)
      )
      .map(({ id }) => id);
    /**
     * prevent uneccesary unlink and link API calls of the same tag
     */
    const linkDiff = difference(formData['new-tags'], unlinkArray);
    const unLinkDiff = difference(unlinkArray, formData['new-tags']);
    const toLinkTags = linkDiff.filter(
      (id) => !data.find((item) => item.id === id)
    );
    const toUnlinkTags = unLinkDiff.filter((id) =>
      data.find((item) => item.id === id)
    );
    if (toUnlinkTags.length > 0 || toLinkTags.length > 0) {
      return onSubmit(toLinkTags, toUnlinkTags);
    }
  };

  return (
    <Modal isOpen title={title} onClose={onClose} variant="small">
      {!data ? (
        <WorkflowLoader />
      ) : (
        <Stack hasGutter>
          <StackItem>
            <TextContent>
              <Text id="sub-title">{subTitle}</Text>
            </TextContent>
          </StackItem>
          <StackItem>
            <FormRenderer
              {...rest}
              subscription={{ values: true }}
              initialValues={{
                'initial-tags': data
              }}
              schema={createSchema(existingTagsMessage, loadTags)}
              onSubmit={handleSubmit}
              onCancel={onClose}
              clearedValue={[]}
              templateProps={{
                submitLabel: formatMessage(actionMessages.save),
                disableSubmit: ['pristine']
              }}
            />
          </StackItem>
        </Stack>
      )}
    </Modal>
  );
};

TaggingModal.propTypes = {
  loadTags: PropTypes.func.isRequired,
  getInitialTags: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  title: PropTypes.node.isRequired,
  subTitle: PropTypes.node,
  onClose: PropTypes.func.isRequired,
  existingTagsMessage: PropTypes.node.isRequired
};

export default TaggingModal;
