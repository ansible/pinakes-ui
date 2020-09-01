import React, { useState, useRef } from 'react';
import { PencilAltIcon } from '@patternfly/react-icons';
import { Spinner } from '@patternfly/react-core/dist/js/components/Spinner/Spinner';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/cjs/actions';
import styled from 'styled-components';
import portfolioMessages from '../../../messages/portfolio.messages';
import useFormatMessage from '../../../utilities/use-format-message';

const UploadButton = styled.button`
  border: none;
  position: absolute;
  top: 0;
  left: 0;
  padding-left: 0;
  width: 100%;
  height: 100%;
  background-color: transparent;
  &::after {
    content: ' ';
    position: absolute;
    display: block;
    top: -0.3em;
    right: -0.3em;
    width: 1.5em;
    height: 1.5em;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.8);
    z-index: 0;
  }
  svg {
    z-index: 1;
    position: absolute;
    top: 0;
    right: 0;
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
  const formatMessage = useFormatMessage();
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
                  title: formatMessage(
                    portfolioMessages.portfolioItemIconTitle
                  ),
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
        {isUploading ? <Spinner size="md" /> : <PencilAltIcon size="sm" />}
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
