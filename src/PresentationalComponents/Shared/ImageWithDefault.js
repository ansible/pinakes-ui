import React from 'react';
import propTypes from 'prop-types';

// why?
// use state class component
const ImageWithDefault = ({ src, defaultSrc, ...other }) => {
  let element;

  const changeSrc = newSrc => {
    element.src = newSrc;
  };

  return (
    <img
      src={ src }
      onError={ () => changeSrc(defaultSrc) }
      { ...other }
    />
  );
};

ImageWithDefault.propTypes = {
  src: propTypes.string,
  defaultSrc: propTypes.string
};

export default ImageWithDefault;
