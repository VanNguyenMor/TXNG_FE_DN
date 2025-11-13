import React, { Component } from "react";
import ReactDom from 'react-dom';
import './ModalImage.css'
// import NoImg from "../../../assets/img/NoImg/NoImg.jpg"
import { Zoom } from 'react-slideshow-image';




class ModalImage extends Component {
    constructor(props) {
        super(props);
        const ratioWHArray = this.props.ratio.split(":");
        this.ratioWH = ratioWHArray[0] / ratioWHArray[1];

        this.updateDimensions = this.updateDimensions.bind(this);

        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
    }

    componentDidMount() {
        this.rootElm = ReactDom.findDOMNode(this);
        this.imageElm = this.rootElm.querySelector(".image");
        this.modalElm = this.rootElm.querySelector(".modal-company-verify");

        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions)
    }
    componentWillUnmount() {
        window.addEventListener("resize", this.updateDimensions)
    }
    updateDimensions() {
        // const height = this.containerElm.offsetWidth / this.props.input.length / this.ratioWH;
        this.imageElm.style.height = `${this.imageElm.offsetWidth / this.ratioWH}px`;
    }

    showModal() {
        this.modalElm.style.visibility = "visible";
    }
    hideModal() {
        this.modalElm.style.visibility = "hidden";
    }

    render() {
        const { src, alt } = this.props
        return (
            <div className="lp-modal-image">
                <div className="container-img">
                    <img
                        className="image"
                        src={src}
                        alt={alt}
                        onClick={this.showModal}
                    />
                </div>
                <div className="modal-company-verify">
                    <span className="close" onClick={this.hideModal}>
                        x
                    </span>
                    <img
                        className="modal-content-img"
                        src={src}
                        alt={alt + " modal-company-verify"}

                    />
                </div>
            </div>
        )
    }

}

export default ModalImage