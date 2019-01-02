import React from 'react';
import propTypes from 'prop-types';
import DefaultPortfolioImg from '../../assets/images/default-portfolio.jpg';

const ImageWithDefault = ({ src, ...props }) => <img src={ src } { ...props } />;

ImageWithDefault.propTypes = {
  src: propTypes.string
};

ImageWithDefault.defaultProps = {
  src: DefaultPortfolioImg
};

export default ImageWithDefault;
