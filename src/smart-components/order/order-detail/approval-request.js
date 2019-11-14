import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { TextContent, Text, TextVariants, TextList, TextListVariants, TextListItem, TextListItemVariants } from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components';

const ApprovalRequests = () => {
  const {
    order,
    approvalRequest
  } = useSelector(({ orderReducer: { orderDetail }}) => orderDetail);
  return (
    <TextContent>
      <Text component={ TextVariants.h2 }>
        Approval requests
      </Text>
      { approvalRequest.data.map(request => (
        <TextList key={ request.id } component={ TextListVariants.dl }>
          <TextListItem component={ TextListItemVariants.dt }>Request ID</TextListItem>
          <TextListItem component={ TextListItemVariants.dd }>{ request.id }</TextListItem>
          <TextListItem component={ TextListItemVariants.dt }>Request created</TextListItem>
          <TextListItem component={ TextListItemVariants.dd }><DateFormat date={ order.created_at } variant="relative"/></TextListItem>
          <TextListItem component={ TextListItemVariants.dt }>State</TextListItem>
          <TextListItem component={ TextListItemVariants.dd }>{ request.state }</TextListItem>
          { request.reason && (
            <Fragment>
              <TextListItem component={ TextListItemVariants.dt }>Approval reason</TextListItem>
              <TextListItem component={ TextListItemVariants.dd }>{ request.reason }</TextListItem>
            </Fragment>
          ) }
          { request.request_completed_at && (
            <Fragment>
              <TextListItem component={ TextListItemVariants.dt }>Completed at</TextListItem>
              <TextListItem component={ TextListItemVariants.dd }>
                <DateFormat date={ request.request_completed_at } variant="relative" />
              </TextListItem>
            </Fragment>
          ) }
        </TextList>
      )) }
    </TextContent>
  );
};

export default ApprovalRequests;
