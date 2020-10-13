/* eslint-disable react/prop-types */
import React, { Fragment } from 'react';
import styled from 'styled-components';
import { AnyObject } from '../../types/common-types';
import Truncate from 'react-truncate';
import { Tooltip } from '@patternfly/react-core';

const CardPropText = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  lines: 3;
`;

export interface ItemDetailsProps extends AnyObject {
  toDisplay?: string[];
}

const ItemDetails: React.ComponentType<ItemDetailsProps> = ({
  toDisplay = [],
  ...item
}) => (
  <Fragment>
    {toDisplay.map((prop) => (
      <Truncate
        key={`tcard-prop-${prop}`}
        lines={3}
        ellipsis={
          <Tooltip content={<div>{item[prop]}</div>}>
            <span>...</span>
          </Tooltip>
        }
      >
        {<CardPropText key={`card-prop-${prop}`}>{item[prop]}</CardPropText>}
      </Truncate>
    ))}
  </Fragment>
);

export default ItemDetails;
