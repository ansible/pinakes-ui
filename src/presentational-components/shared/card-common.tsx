/* eslint-disable react/prop-types */
import React, { Fragment } from 'react';
import styled from 'styled-components';
import { AnyObject } from '../../types/common-types';
import Truncate from 'react-truncate';
import { Level, LevelItem, Tooltip } from '@patternfly/react-core';

const CardPropText = styled.div`
  overflow: hidden;
`;

export const HeaderTitle = styled(LevelItem)`
  max-width: calc(100% - 80px);
  width: calc(100% - 80px);
`;

export const HeaderLevel = styled(Level)`
  width: 100%;
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
