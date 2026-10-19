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
  const images = normalized.map((url) => ({ id: nextId++, url: url }));
  if (images.length === 0) images.push({ id: nextId++, url: Noimg });
  return images;
}

function getRealUrls(images) {
  return images.map((img) => img.url).filter((u) => !!u && u !== Noimg);
}

function isSameUrls(a, b) {
  return a.length === b.length && a.every((u, i) => u === b[i]);
}

class ImageGalleryUploader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: createInitialImages(props.initialImages || []),
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.initialImages !== this.props.initialImages) {
      const nextUrls = normalizeUrlsInput(nextProps.initialImages);
      if (isSameUrls(nextUrls, getRealUrls(this.state.images))) return;
      this.setState({ images: createInitialImages(nextProps.initialImages) });
    }
  }

  notifyParent(updatedImagesObject) {
    const updatedUrls = getRealUrls(updatedImagesObject);
    if (this.props.onImagesChange) {
      this.props.onImagesChange(updatedUrls);
    }
  }

  // Tìm ô theo id (không dùng index) để tránh ghi nhầm ô khi ô khác bị xóa lúc đang upload
  handleImageUploadSuccess = (newImageUrl, id) => {
    if (!newImageUrl || typeof newImageUrl !== "string") return;

    this.setState((prevState) => {
      if (!prevState.images.some((img) => img.id === id)) return null;

      const updatedImages = prevState.images.map((img) =>
        img.id === id ? { ...img, url: newImageUrl } : img
      );
      this.notifyParent(updatedImages);

      return { images: updatedImages };
    });
  };

  // Ô trống chưa có ảnh thật nên không cần báo lên component cha
  handleAddImageField = () => {
    this.setState((prevState) => ({
      images: [...prevState.images, { id: nextId++, url: Noimg }],
    }));
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
    const { title, mdVal, noMutil, disabled } = this.props;
    const { images } = this.state;

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
            {images.map((imageObject, index) => (
              <Col
                md={mdVal ? mdVal : 6}
                key={imageObject.id}
                className="text-center"
              >
                <div style={imageContainerStyle}>
                  <ImageUploader
                    disabled={disabled}
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

                      this.handleImageUploadSuccess(uploadedUrl, imageObject.id);
                    }}
                  />
                  {!disabled && images.length > 1 && index !== 0 && (
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

            {noMutil || disabled ? null : (
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
