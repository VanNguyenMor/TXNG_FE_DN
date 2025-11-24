import React, { Component } from "react";
import { Button } from "reactstrap";

const imageControlStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginBottom: "15px",
};

const inputAreaStyle = {
  marginBottom: "10px",
};

const avaStyle = {
  borderRadius: "4px",
  objectFit: "cover",
  border: "1px solid #dee2e6",
};

const buttonUploadStyle = {
  marginTop: "5px",
  width: "fit-content",
  padding: "8px 12px",
};

class ImageUploader extends Component {
  constructor(props) {
    super(props);
    this.refFileInput = React.createRef();

    this.state = {
      previewImageUrl: props.initialImageUrl || "URL_TO_DEFAULT_NOIMG_IMAGE",
      fileToUpload: null,
    };
  }

  onUpdateFileLogo = () => {
    if (this.refFileInput.current) {
      this.refFileInput.current.click();
    }
  };

  handleUploadFile = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const newPreviewUrl = window.URL.createObjectURL(file);

    const isInitialOrNoImg =
      this.state.previewImageUrl === this.props.initialImageUrl ||
      this.state.previewImageUrl === "URL_TO_DEFAULT_NOIMG_IMAGE";

    if (this.state.previewImageUrl && !isInitialOrNoImg) {
      window.URL.revokeObjectURL(this.state.previewImageUrl);
    }

    this.setState(
      {
        fileToUpload: file,
        previewImageUrl: newPreviewUrl,
      },
      () => {
        if (this.props.onFileSelected) {
          this.props.onFileSelected(file, newPreviewUrl);
        }
      }
    );

    event.target.value = null;
  };

  componentWillUnmount() {
    const isInitialOrNoImg =
      this.state.previewImageUrl === this.props.initialImageUrl ||
      this.state.previewImageUrl === "URL_TO_DEFAULT_NOIMG_IMAGE";

    if (this.state.previewImageUrl && !isInitialOrNoImg) {
      window.URL.revokeObjectURL(this.state.previewImageUrl);
    }
  }

  render() {
    const { previewImageUrl } = this.state;

    return (
      <div style={imageControlStyle}>
        <div style={inputAreaStyle}>
          <img
            src={previewImageUrl}
            alt="Ảnh đại diện"
            width="100"
            height="100"
            style={avaStyle}
          />
        </div>

        <div className="upload-btn-wrapper">
          <Button
            type="button"
            size="lg"
            className={`btn-primary-cs`}
            style={buttonUploadStyle}
            onClick={this.onUpdateFileLogo}
          >
            Cập nhật hình ảnh
          </Button>
          <input
            type="file"
            accept="image/*"
            ref={this.refFileInput}
            onChange={this.handleUploadFile}
            style={{ display: "none" }}
          />
        </div>
      </div>
    );
  }
}

export default ImageUploader;
