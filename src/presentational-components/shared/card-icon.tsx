/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import { IconPlaceholder } from './loader-placeholders';
import CardIconDefault from '../../assets/images/card-icon-default.svg';
import CardIconDefaultS from '../../assets/images/card-icon-default-s.svg';
import StyledLazyLoadImage from '../styled-components/lazy-load-image';
import { CatalogRootState } from '../../types/redux';
import { StringObject } from '../../types/common-types';
import { isStandalone } from '../../helpers/shared/helpers';

interface CardIconContainerProps {
  height: number;
}
const CardIconContainer = styled.div<CardIconContainerProps>`
  display: inline-block;
  height: ${({ height }) => `${height}px`};
`;

export interface CardIconProps {
  src?: string;
  height?: number;
  sourceId?: string;
}
const CardIcon: React.ComponentType<CardIconProps> = ({
  src,
  height = 40,
  sourceId
}) => {
  const [isLoaded, setLoaded] = useState(false);
  const [isUnknown, setUnknown] = useState(false);
  const platformIconMapping = useSelector<CatalogRootState, StringObject>(
    ({ platformReducer: { platformIconMapping } }) => platformIconMapping
  );
  const defaultIconI = sourceId
    ? platformIconMapping[sourceId]
    : CardIconDefault;

  const defaultIcon = isStandalone() ? CardIconDefaultS : defaultIconI;

  return (
    <CardIconContainer height={height}>
      {!isLoaded && <IconPlaceholder height={height} />}
      <StyledLazyLoadImage
        threshold={2000}
        delayTime={0}
        hidden={!isLoaded}
        height={isLoaded ? height : 0}
        onError={() => setUnknown(true)}
        onLoad={() => setLoaded(true)}
        src={!src || isUnknown ? defaultIcon : src}
      />
    </CardIconContainer>
  );
};

export default CardIcon;
