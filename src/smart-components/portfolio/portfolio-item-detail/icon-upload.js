import React, { useState, useRef } from 'react';

const IconUpload = ({ uploadIcon }) => {
  const inputRef = useRef();
  const [ image, setImage ] = useState();
  const handleClick = () => inputRef.current.click();
  console.log('image: ', image, image && URL.createObjectURL(image));
  return (
    <div>
      There will be dragons
      <input accept="image/*" onChange={ event => setImage(event.target.files[0]) } ref={ inputRef } type="file" id="icon-upload" hidden />
      <button onClick={ handleClick }>Click me</button>
      { image && <img src={ URL.createObjectURL(image) } id={ image.name } /> }
      { image && <button onClick={ () => uploadIcon(image) }>Save icon</button> }
    </div>
  );
};

export default IconUpload;
