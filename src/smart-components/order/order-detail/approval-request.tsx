import React, { Fragment, useEffect, useState } from 'react';
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
  Title,
  Grid,
  GridItem,
  Stack,
  StackItem,
  Card,
  CardBody
} from '@patternfly/react-core';

import {
  Table,
  TableHeader,
  TableBody,
  sortable,
  SortByDirection,
  ISortBy
} from '@patternfly/react-table';

import { DateFormat } from '@redhat-cloud-services/frontend-components/components/cjs/DateFormat';
import InfoIcon from '@patternfly/react-icons/dist/js/icons/info-icon';
import { fetchApprovalRequests } from '../../../redux/actions/order-actions';
import ordersMessages from '../../../messages/orders.messages';
import statesMessages from '../../../messages/states.messages';
import labelMessages from '../../../messages/labels.messages';
import { CheckCircleIcon } from '@patternfly/react-icons';
import useFormatMessage from '../../../utilities/use-format-message';
import {
  AnyObject,
  ApiCollectionResponse,
  StringObject
} from '../../../types/common-types';
import { ApprovalRequest } from '@redhat-cloud-services/catalog-client';
import { CatalogRootState } from '../../../types/redux';
import { OrderDetail } from '../../../redux/reducers/order-reducer';

/**
 * We are using type conversion of **request as StringObject** becuase the generated client does not have correct states listed
 * Probably a discrepency inside the OpenAPI spec
 */

const rowOrder = ['updated', 'group_name', 'state'];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const checkRequest = async (
  fetchRequests: () => Promise<ApiCollectionResponse<any>>
) => {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const result = await fetchRequests();
    if (result?.data.length > 0) {
      return 'Finished';
    }

    await delay(3000);
  }
};

const isEmpty = (approvalRequest?: ApiCollectionResponse<ApprovalRequest>) =>
  !approvalRequest ||
  !approvalRequest.data ||
  approvalRequest.data.length === 0;

const ApprovalRequests: React.ComponentType = () => {
  const formatMessage = useFormatMessage();
  const dispatch = useDispatch();
  const [sortBy, setSortBy] = useState<ISortBy>({});
  const {
    order,
    approvalRequest,
    platform,
    orderItem,
    portfolio,
    portfolioItem
  } = useSelector<CatalogRootState, OrderDetail>(
    ({ orderReducer: { orderDetail } }) => orderDetail
  );

  useEffect(() => {
    if (order.state !== 'Failed' && orderItem?.id && isEmpty(approvalRequest)) {
      checkRequest(() =>
        dispatch(
          (fetchApprovalRequests(orderItem.id!) as unknown) as Promise<
            ApiCollectionResponse<ApprovalRequest>
          >
        )
      );
    }
  }, []);

  const handleSort = (
    _e: React.SyntheticEvent,
    index: number,
    direction: SortByDirection
  ) => setSortBy({ index, direction });

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

  const columns = [
    { title: 'Updated', transforms: [sortable] },
    { title: 'Name', transforms: [sortable] },
    'Status'
  ];

  const rows =
    approvalRequest?.data
      .map((request) =>
        rowOrder.map((key) => {
          if (key === 'state') {
            return (
              <Fragment>
                {(request as StringObject)[key] === 'completed' && (
                  <Fragment>
                    <CheckCircleIcon color="var(--pf-global--success-color--100)" />
                    &nbsp;
                  </Fragment>
                )}
                {formatMessage(
                  statesMessages[
                    (request as StringObject)[
                      key
                    ] as keyof typeof statesMessages
                  ]
                )}
              </Fragment>
            );
          }

          if (key === 'updated') {
            /**
             * The fragment here is required other wise the super smart PF table will delete the first React element
             */
            return (
              <Fragment>
                <DateFormat
                  date={(request as StringObject)[key]}
                  type="exact"
                />
              </Fragment>
            );
          }

          return (request as AnyObject)[key];
        })
      )
      .sort((a: AnyObject, b: AnyObject) =>
        a[sortBy.index!] < b[sortBy.index!]
          ? -1
          : a[sortBy.index!] < b[sortBy.index!]
          ? 1
          : 0
      ) || [];

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
        <Grid hasGutter>
          <GridItem md={12} lg={6} xl={4}>
            <Stack hasGutter>
              <StackItem>
                <Card>
                  <CardBody>
                    <Text className="pf-u-mb-md" component={TextVariants.h2}>
                      {formatMessage(ordersMessages.approvalTitle)}
                    </Text>
                    <TextList component={TextListVariants.dl}>
                      <TextListItem component={TextListItemVariants.dt}>
                        {formatMessage(labelMessages.product)}
                      </TextListItem>
                      <TextListItem component={TextListItemVariants.dd}>
                        {portfolioItem.name}
                      </TextListItem>
                      <TextListItem component={TextListItemVariants.dt}>
                        {formatMessage(ordersMessages.orderID)}
                      </TextListItem>
                      <TextListItem component={TextListItemVariants.dd}>
                        {order.id}
                      </TextListItem>
                      <TextListItem component={TextListItemVariants.dt}>
                        {formatMessage(ordersMessages.orderDate)}
                      </TextListItem>
                      <TextListItem component={TextListItemVariants.dd}>
                        <DateFormat
                          date={order.created_at}
                          variant="relative"
                        />
                      </TextListItem>
                      <TextListItem component={TextListItemVariants.dt}>
                        {formatMessage(ordersMessages.orderedByLabel)}
                      </TextListItem>
                      <TextListItem component={TextListItemVariants.dd}>
                        {order.owner}
                      </TextListItem>
                      <TextListItem component={TextListItemVariants.dt}>
                        {formatMessage(labelMessages.portfolio)}
                      </TextListItem>
                      <TextListItem component={TextListItemVariants.dd}>
                        {portfolio.name}
                      </TextListItem>
                      <TextListItem component={TextListItemVariants.dt}>
                        {formatMessage(labelMessages.platform)}
                      </TextListItem>
                      <TextListItem component={TextListItemVariants.dd}>
                        {platform.name}
                      </TextListItem>
                    </TextList>
                  </CardBody>
                </Card>
              </StackItem>
              <StackItem>
                <Card>
                  <CardBody>
                    <Text className="pf-u-mb-md" component={TextVariants.h2}>
                      {formatMessage(ordersMessages.approvalParameters)}
                    </Text>
                    <TextList component={TextListVariants.dl}>
                      {Object.entries(orderItem?.service_parameters || []).map(
                        ([key, value]) => (
                          <Fragment key={key}>
                            <TextListItem component={TextListItemVariants.dt}>
                              {key}
                            </TextListItem>
                            <TextListItem component={TextListItemVariants.dd}>
                              {value}
                            </TextListItem>
                          </Fragment>
                        )
                      )}
                    </TextList>
                  </CardBody>
                </Card>
              </StackItem>
            </Stack>
          </GridItem>
          <GridItem md={12} lg={6} xl={8}>
            <Card>
              <CardBody>
                <Text className="pf-u-mb-md" component={TextVariants.h2}>
                  {formatMessage(ordersMessages.activity)}
                </Text>
                <Table
                  aria-label="Approval request activity"
                  onSort={handleSort}
                  sortBy={sortBy}
                  cells={columns}
                  rows={
                    sortBy.direction === SortByDirection.asc
                      ? rows
                      : rows.reverse()
                  }
                >
                  <TableHeader />
                  <TableBody />
                </Table>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      )}
    </TextContent>
  );
};

export default ApprovalRequests;
