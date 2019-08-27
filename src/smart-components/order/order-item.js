import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import {
  Bullseye,
  DataListCell,
  DataListContent,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  DataListToggle,
  Grid,
  GridItem,
  Level,
  LevelItem,
  Split,
  SplitItem,
  Text,
  TextContent,
  TextVariants,
  Tooltip,
  TooltipPosition
} from '@patternfly/react-core';
import { Spinner } from '@redhat-cloud-services/frontend-components';

import OrderSteps from './order-steps';
import OrderDetailTable from './order-detail-table';
import CardIcon from '../../presentational-components/shared/card-icon';
import { getOrderIcon, getOrderPortfolioName, getOrderPlatformId } from '../../helpers/shared/orders';
import { createOrderedLabel, createUpdatedLabel, createDateString } from '../../helpers/shared/helpers';
import createOrderRow from './create-order-row';
import { cancelOrder } from '../../redux/actions/order-actions';
import CancelOrderModal from './cancel-order-modal';
import { getOrderApprovalRequests } from '../../helpers/order/order-helper';

const CANCELABLE_STATES = [ 'Approval Pending' ];

const canCancel = state => CANCELABLE_STATES.includes(state);

const OrderItem = ({
  type,
  index
}) => {
  const [ isOpen, setIsOpen ] = useState(false);
  const [ isExpanded, setIsExpanded ] = useState(false);
  const [ requestData, setRequestData ] = useState();
  const [ requestDataFetching, setRequestDataFetching ] = useState(false);
  const portfolioItems = useSelector(({ portfolioReducer: { portfolioItems: { data }}}) => data);
  const item = useSelector(({ orderReducer }) => orderReducer[type].data[index]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isExpanded && !requestDataFetching && !requestData) {
      setRequestDataFetching(true);
      getOrderApprovalRequests(item.orderItems[0].id).then(({ data }) => {
        setRequestData(createOrderRow({ ...item, requests: data }).steps);
        setRequestDataFetching(false);
      });
    }
  }, [ isExpanded ]);
  const orderedAt = createOrderedLabel(new Date(item.created_at));
  const updatedAt = createUpdatedLabel(item.orderItems);
  return (
    <React.Fragment>
      <DataListItem aria-labelledby={ `${item.id}-expand` } isExpanded={ isExpanded } className="data-list-expand-fix">
        <DataListItemRow>
          <DataListToggle
            id={ item.id }
            aria-label={ `${item.id}-expand` }
            aria-labelledby={ `${item.id}-expand` }
            onClick={ () => setIsExpanded(isExpanded => !isExpanded) }
            isExpanded={ isExpanded }
          />
          <DataListItemCells
            dataListCells={ [
              <DataListCell key="1" className="cell-grow">
                <Split gutter="sm">
                  <SplitItem>
                    <CardIcon src={ getOrderIcon(item) } platformId={ getOrderPlatformId(item, portfolioItems) }/>
                  </SplitItem>
                  <SplitItem>
                    <TextContent>
                      <Grid gutter="sm" style={ { gridGap: 8 } }>
                        <GridItem>
                          <Text
                            style={ { marginBottom: 0 } }
                            component={ TextVariants.h5 }
                          >
                            { `${getOrderPortfolioName(item, portfolioItems)} # ${item.id}` }
                          </Text>
                        </GridItem>
                        <GridItem>
                          <Level>
                            <LevelItem>
                              <Tooltip enableFlip position={ TooltipPosition.top } content={ <span>{ createDateString(item.created_at) }</span> }>
                                <Text
                                  style={ { marginBottom: 0 } }
                                  component={ TextVariants.small }
                                >
                                  { orderedAt }
                                </Text>
                              </Tooltip>
                            </LevelItem>
                            <LevelItem>
                              <Text
                                style={ { marginBottom: 0 } }
                                component={ TextVariants.small }
                              >
                                Ordered by { item.owner }
                              </Text>
                            </LevelItem>
                            <LevelItem>
                              <Tooltip
                                enableFlip
                                position={ TooltipPosition.top }
                                content={ <span>{ createDateString(item.updated_at || item.ordered_at) }</span> }
                              >
                                <Text
                                  style={ { marginBottom: 0 } }
                                  component={ TextVariants.small }
                                >
                                  { updatedAt }
                                </Text>
                              </Tooltip>
                            </LevelItem>
                          </Level>
                        </GridItem>
                      </Grid>
                    </TextContent>
                  </SplitItem>
                </Split>
              </DataListCell>,
              <DataListCell key="2" style={ { alignSelf: item.state === 'Completed' ? 'flex-end' : 'center' } }>
                <div style={ { minWidth: 200, textAlign: 'end' } }>
                  { item.state === 'Completed' && (
                    <a href={ item.orderItems && item.orderItems[0].external_url } target="_blank" rel="noopener noreferrer">
                      Manage product
                    </a>
                  ) }
                </div>
              </DataListCell>
            ] }
          />
        </DataListItemRow>
        <DataListContent aria-label={ `${item.id}-content` } isHidden={ !isExpanded }>
          { requestDataFetching && (
            <Bullseye>
              <Spinner />
            </Bullseye>
          ) }
          { isExpanded && !requestDataFetching && requestData && (
            <div>
              <OrderDetailTable
                canCancel={ canCancel(item.state) }
                requests={ requestData || [] }
                orderId={ item.id }
                orderState={ item.state }
                orderItem={ item.orderItems && item.orderItems[0] }
                onCancel={ () => setIsOpen(true) }
              />
            </div>
          ) }
        </DataListContent>
      </DataListItem>
      { canCancel(item.state) &&
          <CancelOrderModal
            onClose={ () => setIsOpen(true) }
            cancelOrder={ () => {
              setIsOpen(false);
              dispatch(cancelOrder(item.id));
            } }
            isOpen={ isOpen }
            name={ `${getOrderPortfolioName(item, portfolioItems)} # ${item.id}` }
          />
      }
    </React.Fragment>
  );
};

OrderItem.displayName = 'OrderItem';

OrderItem.propTypes = {
  type: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired
};

export default OrderItem;
