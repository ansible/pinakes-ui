import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import { IconPlaceholder } from './loader-placeholders';
import CardIconDefault from '../../assets/images/card-icon-default.svg';
import StyledLazyLoadImage from '../styled-components/lazy-load-image';

const CardIconContainer = styled.div`
  display: inline-block;
  height: ${({ height }) => `${height}px`};
`;

const CardIcon = ({ src, height, sourceId }) => {
  const [isLoaded, setLoaded] = useState(false);
  const [isUnknown, setUnknown] = useState(false);
  const platformIconMapping = useSelector(
    ({ platformReducer: { platformIconMapping } }) => platformIconMapping
  );
  const defaultIcon = sourceId
    ? platformIconMapping[sourceId]
    : CardIconDefault;

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

CardIcon.propTypes = {
  src: PropTypes.string,
  platformId: PropTypes.string,
  style: PropTypes.object,
  height: PropTypes.number,
  sourceId: PropTypes.string
};

CardIcon.defaultProps = {
  style: {},
  height: 40
};

export default CardIcon;
