import React, { Fragment } from 'react';
import { Button } from '@patternfly/react-core';
import { timeAgo } from '../../helpers/shared/helpers';

export const createRows = (data) => (
  data.reduce((acc,  { id, name, description, created_at, workflow }, key) => ([
    ...acc, { id,
      key,
      isOpen: false,
      cells: [ <Fragment key={ id }> <Button variant="link"> { name } </Button></Fragment>, description, timeAgo(created_at), workflow ]
    }
  ]), [])
);
