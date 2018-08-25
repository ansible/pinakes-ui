import React from 'react';
import propTypes from 'prop-types';

const ImageWithDefault = ({src, defaultSrc, ...other}) => {
  let element;

  const changeSrc = newSrc => {
    element.src = newSrc;
  };

  return (
      <React.Fragment>
        <img src={src}
             onError={() => changeSrc(defaultSrc)}
             ref={el => element=el}
             {...other} />
      </React.Fragment>
  );
};

ImageWithDefault.propTypes = {
  src: propTypes.string,
  defaultSrc: propTypes.string
};

export default ImageWithDefault;
