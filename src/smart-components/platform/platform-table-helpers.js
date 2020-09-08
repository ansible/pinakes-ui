import React, { Fragment } from 'react';
import { TimeAgo } from '../../helpers/shared/helpers';

export const createRows = (data) =>
  data.reduce(
    (acc, { id, name, description, created_at, workflow }, key) => [
      ...acc,
      {
        id,
        key,
        isOpen: false,
        cells: [
          name,
          description,
          <Fragment key="date">
            <TimeAgo date={created_at} />
          </Fragment>,
          workflow
        ]
      }
    ],
    []
  );
