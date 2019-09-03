import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import { IconPlaceholder } from './loader-placeholders';
import CardIconDefault from '../../assets/images/card-icon-default.svg';
import OpenshiftIcon from '../../assets/images/openshift-icon.svg';
import AmazonIcon from '../../assets/images/amazon-icon.png';
import TowerIcon from '../../assets/images/tower-icon.svg';

// TO DO - use webpack to load all images
const platformTypeIcon = {
  1: OpenshiftIcon,
  2: AmazonIcon,
  3: TowerIcon
};

const defaultPlatformIcon = (platformId, platformList) => {
  if (!platformId) {
    return CardIconDefault;
  }

  if (!platformList || platformList.empty || !platformId) {
    return CardIconDefault;
  }

  const source = platformList.find(item => item.id === platformId);
  if (source) {
    return platformTypeIcon[source.source_type_id];
  }
};

const CardIcon = ({ src, height, platformId  }) => {
  const [ isLoaded, setLoaded ] = useState(false);
  const [ isUnknown, setUnknown ] = useState(false);
  const  platformList = useSelector(state => (state.platformReducer ? state.platformReducer.platforms : {}));
  return (
    <div style={ { display: 'inline-block' } }>
      { !isLoaded && <IconPlaceholder style={ { height } } /> }
      <LazyLoadImage
        height={ isLoaded ? height : 0 }
        style={ { height: isLoaded ? height : 0 } }
        className={ `card-image ${!isLoaded ? 'hide' : ''}` }
        onError={ () => setUnknown(true) }
        onLoad={ () => setLoaded(true) }
        src={ isUnknown && platformId ? defaultPlatformIcon(platformId, platformList) : src }
      />
    </div>
  );
};

CardIcon.propTypes = {
  src: PropTypes.string.isRequired,
  platformId: PropTypes.string,
  style: PropTypes.object,
  height: PropTypes.number
};

CardIcon.defaultProps = {
  style: {},
  height: 40
};

export default CardIcon;
