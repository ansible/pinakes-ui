import React, { Fragment, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Bullseye,
  Flex,
  Spinner,
  TextContent,
  Text,
  TextVariants,
  TextList,
  TextListVariants,
  TextListItem,
  TextListItemVariants,
  Title
} from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components/components/cjs/DateFormat';
import InfoIcon from '@patternfly/react-icons/dist/js/icons/info-icon';
import { fetchApprovalRequests } from '../../../redux/actions/order-actions';
import { useIntl } from 'react-intl';
import ordersMessages from '../../../messages/orders.messages';
import statesMessages from '../../../messages/states.messages';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const checkRequest = async (fetchRequests) => {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const result = await fetchRequests();
    if (result.data.length > 0) {
      return 'Finished';
    }

    await delay(3000);
  }
};

const isEmpty = (approvalRequest) =>
  !approvalRequest ||
  !approvalRequest.data ||
  approvalRequest.data.length === 0;

const ApprovalRequests = () => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const { order, approvalRequest, orderItem } = useSelector(
    ({ orderReducer: { orderDetail } }) => orderDetail
  );

  useEffect(() => {
    if (order.state !== 'Failed' && orderItem?.id && isEmpty(approvalRequest)) {
      checkRequest(() => dispatch(fetchApprovalRequests(orderItem.id)));
    }
  }, []);

  if (order.state === 'Failed' && isEmpty(approvalRequest)) {
    return (
      <Bullseye id="no-approval-requests">
        <Flex direction={{ default: 'column' }} grow={{ default: 'grow' }}>
          <Bullseye>
            <InfoIcon size="xl" />
          </Bullseye>
          <Bullseye>
            <Title headingLevel="h1" size="2xl">
              {formatMessage(ordersMessages.noApprovalRequests)}
            </Title>
          </Bullseye>
        </Flex>
      </Bullseye>
    );
  }

  return (
    <TextContent>
      {isEmpty(approvalRequest) ? (
        <Bullseye>
          <Flex direction={{ default: 'column' }} grow={{ default: 'grow' }}>
            <Bullseye id="creating-approval-request">
              <Title headingLevel="h1" size="xl">
                {formatMessage(ordersMessages.creatingApprovalRequest)}
              </Title>
            </Bullseye>
            <Bullseye>
              <Spinner size="xl" />
            </Bullseye>
          </Flex>
        </Bullseye>
      ) : (
        <Fragment>
          <Text component={TextVariants.h2}>
            {formatMessage(ordersMessages.approvalTitle)}
          </Text>
          {approvalRequest.data.map((request) => (
            <TextList key={request.id} component={TextListVariants.dl}>
              <TextListItem component={TextListItemVariants.dt}>
                <a
                  href={`${document.baseURI}ansible/catalog/approval/request?request=${request.approval_request_ref}`}
                >
                  {formatMessage(ordersMessages.approvalDetail)}
                </a>
              </TextListItem>
              <TextListItem component={TextListItemVariants.dt}>
                {formatMessage(ordersMessages.approvalCreated)}
              </TextListItem>
              <TextListItem component={TextListItemVariants.dd}>
                <DateFormat date={order.created_at} variant="relative" />
              </TextListItem>
              <TextListItem component={TextListItemVariants.dt}>
                {formatMessage(statesMessages.title)}
              </TextListItem>
              <TextListItem component={TextListItemVariants.dd}>
                {request.state}
              </TextListItem>
              {request.reason && (
                <Fragment>
                  <TextListItem component={TextListItemVariants.dt}>
                    {formatMessage(ordersMessages.approvalReason)}
                  </TextListItem>
                  <TextListItem component={TextListItemVariants.dd}>
                    {request.reason}
                  </TextListItem>
                </Fragment>
              )}
              {request.request_completed_at && (
                <Fragment>
                  <TextListItem component={TextListItemVariants.dt}>
                    {formatMessage(ordersMessages.approvalCompleted)}
                  </TextListItem>
                  <TextListItem component={TextListItemVariants.dd}>
                    <DateFormat
                      date={request.request_completed_at}
                      variant="relative"
                    />
                  </TextListItem>
                </Fragment>
              )}
            </TextList>
          ))}
        </Fragment>
      )}
    </TextContent>
  );
};

export default ApprovalRequests;
