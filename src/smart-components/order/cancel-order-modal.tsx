/* eslint-disable react/prop-types */
import React from 'react';
import { Button, Modal, Title } from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import ordersMessages from '../../messages/orders.messages';
import useFormatMessage from '../../utilities/use-format-message';

export interface CancelOrderModal {
  name: string;
  cancelOrder: () => void;
  onClose: () => void;
  isOpen?: boolean;
}
const CancelOrderModal: React.ComponentType<CancelOrderModal> = ({
  name,
  cancelOrder,
  onClose,
  isOpen
}) => {
  const formatMessage = useFormatMessage();
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=" "
      aria-labelledby="cancel-order"
      header={
        <Title size="2xl" headingLevel="h2">
          <ExclamationTriangleIcon style={{ fill: '#F0AB00' }} />{' '}
          {formatMessage(ordersMessages.cancelOrder)}
        </Title>
      }
      variant="small"
      actions={[
        <Button
          onClick={cancelOrder}
          ouiaId={'cancel-order'}
          key="cancel-order"
          id="cancel-order"
          variant="danger"
        >
          {formatMessage(ordersMessages.cancelOrder)}
        </Button>,
        <Button
          onClick={onClose}
          ouiaId={'keep-order'}
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

export default CancelOrderModal;
