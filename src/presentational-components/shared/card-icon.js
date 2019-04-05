import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import { IconPlaceholder } from './loader-placeholders';
import CatItemSvg from '../../assets/images/vendor-openshift.svg';

const CardIcon = ({ src }) => {
  const [ isLoaded, setLoaded ] = useState(false);
  const [ isUnknow, setUnknown ] = useState(false);
  return (
    <div style={ { display: 'inline-block' } }>
      { !isLoaded && <IconPlaceholder style={ { height: 40 } } /> }
      <LazyLoadImage
        height={ isLoaded ? 40 : 0 }
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
  style: PropTypes.object
};

CardIcon.defaultProps = {
  style: {}
};

export default CardIcon;
