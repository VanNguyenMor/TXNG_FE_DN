import React, { Component } from "react";
import ReactDom from 'react-dom';
import './ImageModalWidth.css'
// import NoImg from "../../../assets/img/NoImg/NoImg.jpg"
import { Zoom } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'




class ImageModalWidth extends Component {
    constructor(props) {
        super(props);

        const ratioWHArray = this.props.ratio.split(":");
        this.ratioWH = ratioWHArray[0] / ratioWHArray[1];
        this.state = {
            indexImg: 0
        }

        this.updateDimensions = this.updateDimensions.bind(this);

        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.dataImg = this.props.src.map((ele, index) => {

            return {
                index: index,
                src: ele
            }
        })
    }

    componentDidMount() {
        this.rootElm = ReactDom.findDOMNode(this);
        this.imageElm = this.rootElm.querySelector(".image");
        this.modalElm = this.rootElm.querySelector(".modal-company-verify");

        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions)

        // this.showModal()
    }


    componentWillUnmount() {
        window.addEventListener("resize", this.updateDimensions)
    }
    updateDimensions() {
        // const height = this.containerElm.offsetWidth / this.props.input.length / this.ratioWH;
        this.imageElm.style.height = `${this.imageElm.offsetWidth / this.ratioWH}px`;
    }

    showModal(index) {

        this.modalElm.style.visibility = "visible";
        this.setState({ indexImg: index })

    }
    hideModal() {
        this.modalElm.style.visibility = "hidden";
    }

    render() {
        const { src, alt } = this.props

        let imgSrc = src || '';


        return (
            <div className="lp-modal-image">
                <div className="container-img">
                    <Zoom scale={0.4} style={{ width: '100%', height: '100%', maxHeight: 300, maxWidth: 715 }} >
                        {
                            imgSrc?.map((item, index) =>
                                <img
                                    style={{ width: 717, height: 300, maxHeight: 300 }}
                                    key={index}
                                    className="image"
                                    src={item}
                                    alt={alt}
                                    onClick={() => this.showModal(index)}
                                />
                            )
                        }

                    </Zoom>

                </div>
                <div className="modal-company-verify">
                    <span className="close" onClick={this.hideModal}>
                        x
                    </span>
                    {/* <Zoom scale={0.4} style={{ width: '100%', height: '100%', maxHeight: 300 }} > */}
                    {
                        imgSrc?.map((ele, index) => {
                            if (index === this.state.indexImg) {
                                return <img
                                    key={index}
                                    className="modal-content-img"
                                    src={ele}
                                    alt={alt + " modal-company-verify"}

                                />
                            }

                        })
                    }
                    {/* </Zoom> */}


                </div>
            </div>
        )
    }

}

export default ImageModalWidth