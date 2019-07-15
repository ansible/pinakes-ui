import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { IconPlaceholder } from './loader-placeholders';
import CardIconDefault from '../../assets/images/card-icon-default.svg';

const CardIcon = ({ src, height, defaultIcon }) => {
  const [ isLoaded, setLoaded ] = useState(false);
  const [ isUnknown, setUnknown ] = useState(false);
  console.log('DEBUG: defaultIcon: ', defaultIcon);
  return (
    <div style={ { display: 'inline-block' } }>
      { !isLoaded && <IconPlaceholder style={ { height } } /> }
      <LazyLoadImage
        height={ isLoaded ? height : 0 }
        style={ { height: isLoaded ? height : 0 } }
        className={ `card-image ${!isLoaded ? 'hide' : ''}` }
        onError={ () => setUnknown(true) }
        onLoad={ () => setLoaded(true) }
        src={ isUnknown ? defaultIcon || CardIconDefault : src }
      />
    </div>
  );
};

CardIcon.propTypes = {
  src: PropTypes.string.isRequired,
  defaultIcon: PropTypes.string,
  style: PropTypes.object,
  height: PropTypes.number
};

CardIcon.defaultProps = {
  style: {},
  height: 40
};

export default CardIcon;
