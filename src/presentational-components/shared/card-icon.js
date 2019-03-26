import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { IconPlaceholder } from './loader-placeholders';

const CardIcon = ({ src, style, ...props }) => {
  const [ isLoaded, setLoaded ] = useState(false);
  return (
    <Fragment>
      <img
        src={ src }
        { ...props }
        onLoad={ () => setLoaded(true) }
        style={ isLoaded ? {
          height: 40,
          ...style
        } : {
          display: 'none'
        } }
      />
      <IconPlaceholder style={ isLoaded ? { display: 'none' } : { height: 40 } } />
    </Fragment>
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
