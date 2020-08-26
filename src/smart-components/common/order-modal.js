import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import {
  Modal,
  Level,
  LevelItem,
  TextContent,
  Text
} from '@patternfly/react-core';
import { Spinner } from '@patternfly/react-core/dist/js/components/Spinner/Spinner';
import FormRenderer from './form-renderer';
import {
  fetchServicePlans,
  sendSubmitOrder
} from '../../redux/actions/order-actions';
import SpinnerWrapper from '../../presentational-components/styled-components/spinner-wrapper';
import useQuery from '../../utilities/use-query';

const OrderModal = ({ closeUrl }) => {
  const [isFetching, setFetching] = useState(true);
  const { search } = useLocation();
  const { push } = useHistory();
  const dispatch = useDispatch();
  const [searchParams] = useQuery(['portfolio-item']);
  const portfolioItemId = searchParams['portfolio-item'];
  const { portfolioItem } = useSelector(
    ({ portfolioReducer: { portfolioItem } }) => portfolioItem
  );
  const servicePlans = useSelector(
    ({ orderReducer: { servicePlans } }) => servicePlans
  );

  useEffect(() => {
    dispatch(fetchServicePlans(portfolioItemId)).then(() => setFetching(false));
  }, []);

  const handleClose = () =>
    push({
      pathname: closeUrl,
      search
    });

  const onSubmit = (data) => {
    dispatch(
      sendSubmitOrder(
        {
          portfolio_item_id: portfolioItem.id,
          service_parameters: data
        },
        portfolioItem
      )
    );
    handleClose();
  };

  return (
    <Modal
      isOpen
      onClose={handleClose}
      title="Order submission"
      variant="small"
    >
      <Level className="pf-u-mb-md">
        <LevelItem>
          <TextContent>
            <Text>
              <strong>{portfolioItem.name}</strong>
            </Text>
          </TextContent>
        </LevelItem>
      </Level>

      {isFetching ? (
        <SpinnerWrapper className="pf-u-m-sm">
          <Spinner />
        </SpinnerWrapper>
      ) : (
        <FormRenderer
          schema={servicePlans[0].create_json_schema.schema}
          onSubmit={onSubmit}
          onCancel={handleClose}
          formContainer="modal"
        />
      )}
    </Modal>
  );
};

OrderModal.propTypes = {
  orderData: PropTypes.func,
  closeUrl: PropTypes.string.isRequired
};

export default OrderModal;
