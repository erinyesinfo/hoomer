import React, { Component } from 'react';
import ImageUploading from "react-images-uploading";
// { ImageUploadingPropsType, ImageListType, ImageType } is type for typescript
import "./Photo.css";

import PrePhoto from "./PrePhoto";

// https://www.npmjs.com/package/react-images-uploading

const NewHOC = (PassedComponent) => {  
  return class extends React.Component {
    render() {
      return (
        <div>
          <PassedComponent {...this.props} />
        </div>
      );
    };
  };
};

class PhotoUploading extends Component {
  constructor(props) {
    super(props);
    this.state = { mouseIn: false };
  };
  onChange = imageList => {
    this.props.handleUploadPhoto(imageList);
    // imageList.name
    // imageList.dataURL
    // data for submit
  };
  render() {
    const mode = "single";// const mode = "multiple";
    const maxNumber = 10;
    
    return (
      <ImageUploading mode={mode} onChange={this.onChange} maxNumber={maxNumber}>
        {({ imageList, onImageUpload }) => (
          // write your building UI
          <div className="photo-container" onClick={onImageUpload}>
            {imageList.length === 0 ?
              <button type='button' className="upload-btn" onClick={onImageUpload}>
                Select a photo from your computer
              </button>
            :null}
            {imageList.map(
              image => <PrePhoto key={image.key} image={image} />
            )}
          </div>
        )}
      </ImageUploading>
    );
  };
};

const PhotoUploadingComponent = NewHOC(PhotoUploading);

const Photo = props => <PhotoUploadingComponent {...props} />;

export default Photo;
