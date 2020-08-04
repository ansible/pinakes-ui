import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from '@patternfly/react-core';
import useFormatMessage from '../../utilities/use-format-message';
import orderProcessesMessages from '../../messages/order-processes.messages';
import FormRenderer from '../common/form-renderer';
import createSchema from '../../forms/set-approval-process.schema';
import { useHistory } from 'react-router-dom';

const SetOrderProcessModal = ({ pushParam }) => {
  const formatMessage = useFormatMessage();
  const { push } = useHistory();
  const onCancel = () => push(pushParam);
  return (
    <Modal
      isOpen
      title={formatMessage(orderProcessesMessages.setOrderProcess)}
      onClose={onCancel}
      variant="small"
    >
      <FormRenderer
        schema={createSchema('foo', new Promise((res) => res([])))}
        onSubmit={console.log}
        onCancel={onCancel}
      />
    </Modal>
  );
};

SetOrderProcessModal.propTypes = {
  pushParam: PropTypes.string
};

export default SetOrderProcessModal;
