import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Title } from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';

const CancelOrderModal = ({ name, cancelOrder, onClose, isOpen }) => (
  <Modal
    isOpen={ isOpen }
    onClose={ onClose }
    title=" "
    header={ (
      <Title size="2xl" headingLevel="h2">
        <ExclamationTriangleIcon fill="#F0AB00" /> Cancel order
      </Title>
    ) }
    isSmall
    actions={ [
      <Button onClick={ cancelOrder } key="cancel-order" id="cancel-order" variant="danger">Cancel order</Button>,
      <Button onClick={ onClose } key="keep-order" id="keep-order" variant="link">Keep order</Button>
    ] }
  >
    Are you sure you want to cancel { name }?
  </Modal>
);

CancelOrderModal.propTypes = {
  name: PropTypes.string.isRequired,
  cancelOrder: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool
};

export default CancelOrderModal;
