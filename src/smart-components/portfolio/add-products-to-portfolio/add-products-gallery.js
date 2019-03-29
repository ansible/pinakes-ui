import React from 'react';
import PropTypes from 'prop-types';
import ContentGallery from '../../content-gallery/content-gallery';

const AddProductsGallery = props => <ContentGallery editMode = { true } { ...props } />;

AddProductsGallery.propTypes = {
  checkedItems: PropTypes.arrayOf(PropTypes.string)
};

AddProductsGallery.defaultProps = {
  checkedItems: []
};

export default AddProductsGallery;

