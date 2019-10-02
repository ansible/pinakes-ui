import React, { useState, useRef } from 'react';
import { EditIcon } from '@patternfly/react-icons';
import { Spinner } from '@redhat-cloud-services/frontend-components';
import PropTypes from 'prop-types';

const IconUpload = ({ uploadIcon, children }) => {
  const inputRef = useRef();
  const [ image, setImage ] = useState();
  const [ isUploading, setIsUploading ] = useState(false);
  const handleClick = () => inputRef.current.click();

  return (
    <div style={ { position: 'relative' } }>

      <input accept="image/*" onChange={ event => {
        setImage(event.target.files[0]);
        setIsUploading(true);
        uploadIcon(event.target.files[0]).then(() => setIsUploading(false));
      } } ref={ inputRef } type="file" id="icon-upload" hidden />
      <button disabled={ isUploading } onClick={ handleClick } className="image-upload-button">
        { isUploading ? <Spinner className="image-upload-spinner" /> : <EditIcon size="sm" /> }

      </button>
      { !image && children }
      { image && <img className="image-preview" style={ { height: 64 } } src={ URL.createObjectURL(image) } id={ image.name } /> }
    </div>
  );
};

IconUpload.propTypes = {
  uploadIcon: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([ PropTypes.node, PropTypes.arrayOf(PropTypes.node) ])
};

export default IconUpload;
