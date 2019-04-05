import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import { IconPlaceholder } from './loader-placeholders';
import CatItemSvg from '../../assets/images/vendor-openshift.svg';

const CardIcon = ({ src, height }) => {
  const [ isLoaded, setLoaded ] = useState(false);
  const [ isUnknow, setUnknown ] = useState(false);
  return (
    <div style={ { display: 'inline-block' } }>
      { !isLoaded && <IconPlaceholder style={ { height } } /> }
      <LazyLoadImage
        height={ isLoaded ? height : 0 }
        style={ { height: isLoaded ? height : 0 } }
        className={ `card-image ${!isLoaded ? 'hide' : ''}` }
        onError={ () => setUnknown(true) }
        onLoad={ () => setLoaded(true) }
        src={ isUnknow ? CatItemSvg : src }
      />
    </div>
  );
};

CardIcon.propTypes = {
  src: PropTypes.string.isRequired,
  style: PropTypes.object,
  height: PropTypes.number
};

CardIcon.defaultProps = {
  style: {},
  height: 40
};

export default CardIcon;
