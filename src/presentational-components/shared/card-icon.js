import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import { IconPlaceholder } from './loader-placeholders';
import CardIconDefault from '../../assets/images/card-icon-default.svg';

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
    <div style={{ display: 'inline-block' }}>
      {!isLoaded && <IconPlaceholder height={height} />}
      <LazyLoadImage
        threshold={2000}
        delayTime={0}
        height={isLoaded ? height : 0}
        style={{ height: isLoaded ? height : 0 }}
        className={`card-image ${!isLoaded ? 'hide' : ''}`}
        onError={() => setUnknown(true)}
        onLoad={() => setLoaded(true)}
        src={!src || isUnknown ? defaultIcon : src}
      />
    </div>
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
