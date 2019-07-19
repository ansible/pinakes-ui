import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Modal, Level, LevelItem, Title, TextContent, Text, TextVariants } from '@patternfly/react-core';

import { CATALOG_API_BASE } from '../../utilities/constants';
import CardIcon from '../../presentational-components/shared/card-icon';
import OrderServiceFormStepConfiguration from '../order/order-service-form-step-configuration';

const OrderModal = ({ serviceData, closeUrl, history: { push }}) => serviceData ? (
  <Modal
    isOpen
    title=""
    hideTitle
    onClose={ () => push(closeUrl) }
    isLarge
  >
    <div className="pf-u-mb-md">
      <div style={ { float: 'left' } } className="pf-u-mr-sm">
        <CardIcon height={ 64 } src={ `${CATALOG_API_BASE}/portfolio_items/${serviceData.id}/icon` }
          platformId={ serviceData.service_offering_source_ref }/>
      </div>
      <Level>
        <LevelItem className="elipsis-text-overflow">
          <Title headingLevel="h2" size="3xl">
            { serviceData.display_name }
          </Title>
        </LevelItem>
      </Level>
      <Level>
        <LevelItem>
          <TextContent>
            <Text component={ TextVariants.small }>{ serviceData.name }</Text>
          </TextContent>
        </LevelItem>
      </Level>
    </div>
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
