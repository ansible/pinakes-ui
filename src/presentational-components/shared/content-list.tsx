/* eslint-disable react/prop-types */
import React, { Fragment, useState, useEffect, ReactNode } from 'react';
import { Text, TextVariants } from '@patternfly/react-core';
import {
  Table,
  TableHeader,
  TableBody,
  TableVariant,
  IActionsResolver,
  IAreActionsDisabled,
  IRow,
  ICell
} from '@patternfly/react-table';

import { ListLoader } from './loader-placeholders';
import filteringMessages from '../../messages/filtering.messages';
import useFormatMessage from '../../utilities/use-format-message';

const NoItems: React.ComponentType = () => {
  const formatMessage = useFormatMessage();
  return (
    <Text component={TextVariants.h1}>
      {formatMessage(filteringMessages.noItems)}
    </Text>
  );
};

export interface ContentListProps {
  data: IRow[];
  columns: (string | ICell)[];
  isCompact?: boolean;
  isLoading?: boolean;
  actionResolver?: IActionsResolver;
  areActionsDisabled?: IAreActionsDisabled;
  borders?: boolean;
  routes?: () => ReactNode;
  titlePlural?: ReactNode;
  renderEmptyState: () => ReactNode;
}

const ContentList: React.ComponentType<ContentListProps> = ({
  data,
  columns,
  isCompact = false,
  isLoading = false,
  actionResolver,
  areActionsDisabled,
  borders = true,
  routes = () => null,
  titlePlural,
  renderEmptyState
}) => {
  const [rows, setRows] = useState<IRow[]>([]);

  useEffect(() => {
    setRows(data);
  }, [data]);

  return isLoading ? (
    <ListLoader />
  ) : (
    <Fragment>
      {rows.length === 0 ? (
        renderEmptyState ? (
          renderEmptyState()
        ) : (
          <NoItems />
        )
      ) : (
        <Fragment>
          {routes()}
          <Table
            aria-label={`${titlePlural} table`}
            variant={isCompact ? TableVariant.compact : undefined}
            borders={borders}
            rows={rows}
            cells={columns}
            actionResolver={actionResolver}
            areActionsDisabled={areActionsDisabled}
          >
            <TableHeader />
            <TableBody />
          </Table>
        </Fragment>
      )}
    </Fragment>
  );
};

export default ContentList;
