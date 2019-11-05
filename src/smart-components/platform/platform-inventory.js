import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@patternfly/react-core';

export const PlatformInventoryRow = (item) => {
  console.log('Debug - PlatformInventoryRow - item:', item);
  return {
    id: item.id,
    isOpen: false,
    cells: [ <Fragment key={ item.id }><Link to={ `/platforms/${item.sourceId}/detail/${item.id}` }>
      <Button variant="link"> { item.name } </Button></Link></Fragment>, item.description, item.created_at, item.workflow ]
  };
};
