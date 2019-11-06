import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@patternfly/react-core';
import { timeAgo } from '../../helpers/shared/helpers';

export const createRows = (data) => (
  data.reduce((acc,  { id, name, description, created_at, workflow }) => ([
    ...acc, { id,
      isOpen: false,
      cells: [ <Fragment key={ id }><Link to={ `/platforms/detail/${id}` }>
        <Button variant="link"> { name } </Button></Link></Fragment>, description, `${timeAgo(created_at)}`, workflow ]
    }
  ]), [])
);
