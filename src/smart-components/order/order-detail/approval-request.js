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
import { DateFormat } from '@redhat-cloud-services/frontend-components/components/DateFormat';
import InfoIcon from '@patternfly/react-icons/dist/js/icons/info-icon';
import { fetchApprovalRequests } from '../../../redux/actions/order-actions';

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

const ApprovalRequests = () => {
  const dispatch = useDispatch();
  const { order, approvalRequest, orderItem } = useSelector(
    ({ orderReducer: { orderDetail } }) => orderDetail
  );

  useEffect(() => {
    if (order.state !== 'Failed' && approvalRequest.data.length === 0) {
      checkRequest(() => dispatch(fetchApprovalRequests(orderItem.id)));
    }
  }, []);

  if (order.state === 'Failed' && approvalRequest.data.length === 0) {
    return (
      <Bullseye>
        <Flex breakpointMods={[{ modifier: 'column' }, { modifier: 'grow' }]}>
          <Bullseye>
            <InfoIcon size="xl" />
          </Bullseye>
          <Bullseye>
            <Title>
              We were unable to find any approval requests for this order.
            </Title>
          </Bullseye>
        </Flex>
      </Bullseye>
    );
  }

  return (
    <TextContent>
      {approvalRequest.data.length === 0 ? (
        <Bullseye>
          <Flex breakpointMods={[{ modifier: 'column' }, { modifier: 'grow' }]}>
            <Bullseye>
              <Title>Creating approval request</Title>
            </Bullseye>
            <Bullseye>
              <Spinner size="xl" />
            </Bullseye>
          </Flex>
        </Bullseye>
      ) : (
        <Fragment>
          <Text component={TextVariants.h2}>Approval requests</Text>
          {approvalRequest.data.map((request) => (
            <TextList key={request.id} component={TextListVariants.dl}>
              <TextListItem component={TextListItemVariants.dt}>
                Request ID
              </TextListItem>
              <TextListItem component={TextListItemVariants.dd}>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`${document.baseURI}ansible/catalog/approval/requests/detail/${request.approval_request_ref}`}
                >
                  {request.approval_request_ref}
                </a>
              </TextListItem>
              <TextListItem component={TextListItemVariants.dt}>
                Request created
              </TextListItem>
              <TextListItem component={TextListItemVariants.dd}>
                <DateFormat date={order.created_at} variant="relative" />
              </TextListItem>
              <TextListItem component={TextListItemVariants.dt}>
                State
              </TextListItem>
              <TextListItem component={TextListItemVariants.dd}>
                {request.state}
              </TextListItem>
              {request.reason && (
                <Fragment>
                  <TextListItem component={TextListItemVariants.dt}>
                    Approval reason
                  </TextListItem>
                  <TextListItem component={TextListItemVariants.dd}>
                    {request.reason}
                  </TextListItem>
                </Fragment>
              )}
              {request.request_completed_at && (
                <Fragment>
                  <TextListItem component={TextListItemVariants.dt}>
                    Completed at
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
