import React, { Component } from 'react';

import '../../assets/css/control/modal.css';
import { findParentElementByClass } from '../../bases/helper';

class Modal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isVisible: false
        }
    }

    componentDidMount() {
        // document.removeEventListener('click', () => {});

        // document.addEventListener('click', e => {
        //     if (!this.state.isVisible) {
        //         return;
        //     }

        //     const { excludes } = this.props;

        //     const exclude = findParentElementByClass(e.target, excludes);

        //     if (exclude) {
        //         return;
        //     }

        //     const parent = findParentElementByClass(e.target, 'wrap-modal');

        //     if (!parent) {
        //         this.close();
        //     }
        // });
    }

    show = () => {
        this.setState(previousState => {
            return {
                ...previousState,
                isVisible: true
            }
        });
    }

    close = () => {
        // const { onClose } = this.props;

        // if (onClose) {
        //     onClose();
        // }

        this.setState(previousState => {
            return {
                ...previousState,
                isVisible: false
            }
        });
    }

    render() {
        const { children, component } = this.props;
        const { isVisible } = this.state;

        return (
            <div onClick={this.onClickModal} className={`wrap-modal ${isVisible ? 'active' : ''}`}>
                {children || component}
            </div>
        )
    }
}

export default Modal;