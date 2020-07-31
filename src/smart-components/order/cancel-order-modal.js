import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Title } from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import ordersMessages from '../../messages/orders.messages';
import useFormatMessage from '../../utilities/use-format-message';

const CancelOrderModal = ({ name, cancelOrder, onClose, isOpen }) => {
  const formatMessage = useFormatMessage();
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=" "
      aria-labelledby="cancel-order"
      header={
        <Title size="2xl" headingLevel="h2">
          <ExclamationTriangleIcon fill="#F0AB00" />{' '}
          {formatMessage(ordersMessages.cancelOrder)}
        </Title>
      }
      variant="small"
      actions={[
        <Button
          onClick={cancelOrder}
          key="cancel-order"
          id="cancel-order"
          variant="danger"
        >
          {formatMessage(ordersMessages.cancelOrder)}
        </Button>,
        <Button
          onClick={onClose}
          key="keep-order"
          id="keep-order"
          variant="link"
        >
          {formatMessage(ordersMessages.keepOrder)}
        </Button>
      ]}
    >
      {formatMessage(ordersMessages.cancelDescription, { name })}
    </Modal>
  );
};

CancelOrderModal.propTypes = {
  name: PropTypes.string.isRequired,
  cancelOrder: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool
};

export default CancelOrderModal;
