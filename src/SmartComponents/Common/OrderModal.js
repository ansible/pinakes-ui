import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Modal } from '@patternfly/react-core';

import CatItemSvg from '../../assets/images/vendor-openshift.svg';
import ImageWithDefault from '../../presentational-components/shared/image-with-default';
import OrderServiceFormStepConfiguration from '../Order/OrderServiceFormStepConfiguration';

const OrderModal = ({ serviceData, closeUrl, history: { push }}) => serviceData ? (
  <Modal
    isOpen
    hideTitle
    onClose={ () => push(closeUrl) }
    style={ { maxWidth: 800, minHeight: 300 } }
  >
    <ImageWithDefault src = { serviceData.imageUrl || CatItemSvg } width="40" />
    { serviceData.name }
    <OrderServiceFormStepConfiguration closeUrl={ closeUrl } { ...serviceData } />
  </Modal>
) : null;

OrderModal.propTypes = {
  orderData: PropTypes.func,
  serviceData: PropTypes.object,
  closeUrl: PropTypes.string.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};

const mapStateToProps = ({
  orderReducer: { selectedItem, servicePlans }
}) => ({
  selectedItem,
  servicePlans
});

export default withRouter(connect(mapStateToProps)(OrderModal));
