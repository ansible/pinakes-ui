/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
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
import {
  fetchServicePlans as fetchServicePlansS,
  sendSubmitOrder as sendSubmitOrderS
} from '../../redux/actions/order-actions-s';
import { ServicePlan as ServicePlanS } from '../../helpers/order/service-plan-helper-s';
import SpinnerWrapper from '../../presentational-components/styled-components/spinner-wrapper';
import useQuery from '../../utilities/use-query';
import { AsyncMiddlewareAction, CatalogRootState } from '../../types/redux';
import {
  PortfolioItem,
  ServicePlan
} from '@redhat-cloud-services/catalog-client';
import {
  AnyObject,
  ApiCollectionResponse,
  Full
} from '../../types/common-types';
import { ApiCollectionResponse as ApiCollectionResponseS } from '../../types/common-types-s';

import { Schema } from '@data-driven-forms/react-form-renderer';
import labelMessages from '../../messages/labels.messages';
import useFormatMessage from '../../utilities/use-format-message';

export interface OrderModalProps {
  closeUrl: string;
}
const OrderModal: React.ComponentType<OrderModalProps> = ({ closeUrl }) => {
  const [isFetching, setFetching] = useState(true);
  const { search } = useLocation();
  const { push } = useHistory();
  const dispatch = useDispatch();
  const [searchParams] = useQuery(['portfolio-item']);
  const portfolioItemId = searchParams['portfolio-item'];
  const { portfolioItem } = useSelector<
    CatalogRootState,
    { portfolioItem: PortfolioItem }
  >(({ portfolioReducer: { portfolioItem } }) => portfolioItem);

  const formatMessage = useFormatMessage();

  const servicePlans = useSelector<CatalogRootState, Full<ServicePlan[]>>(
    ({ orderReducer: { servicePlans } }) => servicePlans
  );

  useEffect(() => {
    dispatch(
      window.catalog?.standalone
        ? (fetchServicePlansS(portfolioItemId) as Promise<
            AsyncMiddlewareAction<ApiCollectionResponseS<ServicePlanS[]>>
          >)
        : (fetchServicePlans(portfolioItemId) as Promise<
            AsyncMiddlewareAction<ApiCollectionResponse<ServicePlan[]>>
          >)
    ).then(() => setFetching(false));
  }, []);

  const handleClose = () =>
    push({
      pathname: closeUrl,
      search
    });

  const onSubmit = (data: ServicePlan) => {
    dispatch(
      window.catalog?.standalone
        ? sendSubmitOrderS(
            {
              portfolio_item_id: portfolioItem.id,
              service_parameters: data
            },
            portfolioItem as Full<PortfolioItem>
          )
        : sendSubmitOrder(
            {
              portfolio_item_id: portfolioItem.id,
              service_parameters: data
            },
            portfolioItem as Full<PortfolioItem>
          )
    );
    handleClose();
  };

  const updateValidatorsForSubstitution = (schema: Schema) => {
    const updatedFields = schema?.fields?.map((field) => {
      if (field.isSubstitution) {
        delete field.validate;
        delete field.dataType;
      }

      return field;
    });
    return { ...schema, fields: updatedFields };
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
          schema={
            servicePlans[0]
              ? updateValidatorsForSubstitution(
                  ((servicePlans[0].create_json_schema! as AnyObject)
                    .schema as unknown) as Schema
                )
              : { fields: [] }
          }
          onSubmit={onSubmit}
          onCancel={handleClose}
          templateProps={{
            submitLabel: formatMessage(labelMessages.confirm)
          }}
        />
      )}
    </Modal>
  );
};

export default OrderModal;
