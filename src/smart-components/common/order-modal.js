import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import {
  Modal,
  Level,
  LevelItem,
  Title,
  TextContent,
  Text,
  TextVariants,
  Split,
  SplitItem
} from '@patternfly/react-core';
import { Spinner } from '@patternfly/react-core/dist/js/components/Spinner/Spinner';

import { CATALOG_API_BASE } from '../../utilities/constants';
import CardIcon from '../../presentational-components/shared/card-icon';
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
    push({
      pathname: closeUrl,
      search
    });
  };

  return (
    <Modal
      isOpen
      title=""
      hideTitle
      onClose={() =>
        push({
          pathname: closeUrl,
          search
        })
      }
      isSmall
    >
      <div className="pf-u-mb-md">
        <Split>
          <SplitItem className="pf-u-mr-sm">
            <CardIcon
              height={64}
              src={`${CATALOG_API_BASE}/portfolio_items/${portfolioItem.id}/icon`}
              sourceId={portfolioItem.service_offering_source_ref}
            />
          </SplitItem>
          <SplitItem isFilled>
            <Level>
              <LevelItem>
                <Title headingLevel="h2" size="3xl">
                  {portfolioItem.name}
                </Title>
              </LevelItem>
            </Level>
            <Level>
              <LevelItem>
                <TextContent>
                  <Text component={TextVariants.small}>
                    {portfolioItem.name}
                  </Text>
                </TextContent>
              </LevelItem>
            </Level>
          </SplitItem>
        </Split>
      </div>
      {isFetching ? (
        <SpinnerWrapper className="pf-u-m-sm">
          <Spinner />
        </SpinnerWrapper>
      ) : (
        <FormRenderer
          schema={servicePlans[0].create_json_schema.schema}
          onSubmit={onSubmit}
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
