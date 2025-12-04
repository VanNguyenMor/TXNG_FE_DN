import React, { Component } from "react";
import { Row, Col, Button, Card, CardBody } from "reactstrap";
import ImageUploader from "components/ImageUploader/ImageUploader";
import Noimg from "../../assets/img/NoImg/NoImg.jpg";
import { fetchData } from "helpers/fetchData";

let nextId = 0;
function normalizeUrlsInput(urls) {
  // Accept multiple input shapes: array of urls, semicolon/comma-delimited string, or null/undefined
  if (!urls) return [];

  if (Array.isArray(urls)) return urls.filter((u) => !!u);

  if (typeof urls === "string") {
    // split by semicolon or comma, trim
    const parts = urls
      .split(/;|,/)
      .map((s) => s && s.trim())
      .filter(Boolean);
    return parts;
  }

  // If object with images property
  if (typeof urls === "object") {
    // try common shapes
    if (Array.isArray(urls.images)) return urls.images.filter((u) => !!u);
    if (Array.isArray(urls.data)) return urls.data.filter((u) => !!u);
  }

  return [];
}

function createInitialImages(urls) {
  const normalized = normalizeUrlsInput(urls || []);
  return normalized.map((url) => ({ id: nextId++, url: url }));
}

class ImageGalleryUploader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: createInitialImages(props.initialImages || []),
    };
    nextId = this.state.images.length;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.initialImages &&
      nextProps.initialImages !== this.props.initialImages
    ) {
      const imgs = createInitialImages(nextProps.initialImages);
      this.setState({ images: imgs });
      nextId = imgs.length;
    }
  }

  getUrlsFromState() {
    return this.state.images.map((img) => img.url);
  }

  notifyParent(updatedImagesObject) {
    const updatedUrls = updatedImagesObject.map((img) => img.url);
    if (this.props.onImagesChange) {
      this.props.onImagesChange(updatedUrls);
    }
  }

  handleImageUploadSuccess = (newImageUrl, index) => {
    this.setState((prevState) => {
      let updatedImages = [...prevState.images];
      updatedImages[index] = { ...updatedImages[index], url: newImageUrl };
      this.notifyParent(updatedImages);

      return { images: updatedImages };
    });
  };

  handleAddImageField = () => {
    this.setState((prevState) => {
      const newImageObject = { id: nextId++, url: Noimg };
      const updatedImages = [...prevState.images, newImageObject];
      this.notifyParent(updatedImages);

      return {
        images: updatedImages,
      };
    });
  };

  handleRemoveImageField = (idToRemove) => {
    const { images } = this.state;

    if (images.length === 1) {
      alert("Không thể xóa ảnh đại diện.");
      return;
    }

    this.setState((prevState) => {
      const updatedImages = prevState.images.filter(
        (img) => img.id !== idToRemove
      );

      this.notifyParent(updatedImages);

      return { images: updatedImages };
    });
  };

  render() {
    const { title, mdVal, noMutil } = this.props;
    const { images } = this.state;

    const displayImages =
      images.length > 0 ? images : [{ id: nextId++, url: Noimg }];

    const imageContainerStyle = {
      position: "relative",
      marginBottom: "10px",
    };

    const removeButtonStyle = {
      position: "absolute",
      top: "5px",
      right: "5px",
      zIndex: 10,
      width: "25px",
      height: "25px",
      padding: 0,
      borderRadius: "50%",
      fontSize: "10px",
      lineHeight: "10px",
    };

    const plusButtonStyle = {
      width: "35px",
      height: "35px",
      borderRadius: "50%",
      border: "2px dashed #ccc",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "16px",
      color: "#aaa",
      cursor: "pointer",
    };

    return (
      <Card className="mb-3">
        <CardBody className="p-3">
          <h3 className="mb-4">{title || "Thư viện hình ảnh"}</h3>

          <Row className="mb-3">
            {displayImages.map((imageObject, index) => (
              <Col
                md={mdVal ? mdVal : 6}
                key={imageObject.id}
                className="text-center"
              >
                <div style={imageContainerStyle}>
                  <ImageUploader
                    initialImageUrl={imageObject.url}
                    onFileSelected={async (file, previewUrl) => {
                      if (!file) return;

                      const formData = new FormData();
                      const keyToUse = this.props.uploadKey || "files";
                      formData.append(keyToUse, file, file.name);

                      const res = await fetchData.infoCompany.uploadFile(
                        formData
                      );
                      const uploadedUrl = res;

                      this.handleImageUploadSuccess(uploadedUrl, index);
                    }}
                  />
                  {displayImages.length > 1 && index !== 0 && (
                    <Button
                      color="danger"
                      style={removeButtonStyle}
                      onClick={() =>
                        this.handleRemoveImageField(imageObject.id)
                      }
                    >
                      <i className="fas fa-times"></i>
                    </Button>
                  )}
                </div>
              </Col>
            ))}

            {noMutil ? null : (
              <Col
                md="3"
                className="d-flex align-items-center justify-content-center"
                style={{
                  paddingTop: "10px",
                  position: "absolute",
                  right: "0",
                  top: "0",
                }}
              >
                <div style={plusButtonStyle} onClick={this.handleAddImageField}>
                  <i className="fas fa-plus"></i>
                </div>
              </Col>
            )}
          </Row>
        </CardBody>
      </Card>
    );
  }
}

export default ImageGalleryUploader;
