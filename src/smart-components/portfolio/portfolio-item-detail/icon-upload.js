import React, { useState, useRef } from 'react';
import { EditIcon } from '@patternfly/react-icons';
import { Spinner } from '@patternfly/react-core/dist/js/components/Spinner/Spinner';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/cjs/actions';
import styled from 'styled-components';

const UploadButton = styled.button`
  border: none;
  position: absolute;
  top: 0;
  left: 0;
  padding-left: 0;
  width: 100%;
  height: 100%;
  background-color: transparent;
  svg {
    background-color: rgba(255, 255, 255, 0.8);
    position: absolute;
    top: 0;
    left: 0;
  }
`;

const UploadIconWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const ImagePreview = styled.img`
  height: 64px;
  max-width: 300px;
  object-fit: cover;
`;

const IconUpload = ({ uploadIcon, children }) => {
  const inputRef = useRef();
  const [image, setImage] = useState();
  const [isUploading, setIsUploading] = useState(false);
  const handleClick = () => inputRef.current.click();
  const dispatch = useDispatch();

  return (
    <UploadIconWrapper>
      <input
        accept=".png,.svg,.jpeg"
        onChange={(event) => {
          setImage(event.target.files[0]);
          setIsUploading(true);
          uploadIcon(event.target.files[0])
            .then(() => setIsUploading(false))
            .catch((error) => {
              dispatch(
                addNotification({
                  variant: 'danger',
                  title: 'Icon upload error',
                  description: error.data.errors[0].detail,
                  dismissable: true
                })
              );
              setImage(undefined);
              setIsUploading(false);
            });
        }}
        ref={inputRef}
        type="file"
        id="icon-upload"
        hidden
      />
      <UploadButton disabled={isUploading} onClick={handleClick}>
        {isUploading ? <Spinner size="md" /> : <EditIcon size="sm" />}
      </UploadButton>
      {!image && children}
      {image && (
        <ImagePreview
          style={{ height: 64 }}
          src={URL.createObjectURL(image)}
          id={image.name}
        />
      )}
    </UploadIconWrapper>
  );
};

IconUpload.propTypes = {
  uploadIcon: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ])
};

export default IconUpload;
