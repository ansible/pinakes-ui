import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Modal } from '@patternfly/react-core';
import { getOrderItemApi } from '../../helpers/shared/user-login';

const OrderMessagesModal = ({ history: { push }, match: { params: { orderItemId }}}) => {
  const [ messages, setMessages ] = useState([{ message: 'Loading messages' }]);

  useEffect(() => {
    getOrderItemApi().listProgressMessages(orderItemId).then(({ data }) =>
      setMessages(data.map(item => ({ ...item, message: item.message }))));
  }, []);

  return (
    <Modal
      isOpen
      title={ `Progress messages of order item with id: ${orderItemId}` }
      isLarge
      onClose={ () => push('/orders') }
      style={ { overflowX: 'scroll' } }
    >
      <pre>
        { JSON.stringify(messages, null, 2) }
      </pre>
    </Modal>
  );
};

OrderMessagesModal.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      orderItemId: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};

export default withRouter(OrderMessagesModal);
