/* eslint-disable react/prop-types */
import React, { Fragment } from 'react';
import styled from 'styled-components';
import { AnyObject } from '../../types/common-types';

const CardPropText = styled.div`
  overflow: hidden;
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
      <CardPropText key={`card-prop-${prop}`}>{item[prop]}</CardPropText>
    ))}
  </Fragment>
);

export default ItemDetails;
