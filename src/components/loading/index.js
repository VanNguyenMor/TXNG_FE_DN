import React, { Component } from 'react';

import '../../assets/css/control/loading.css';

let refLoading = null;

class Loading extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isVisible: false
        }
    }

    static setRef = ref => {
        refLoading = ref;
    }

    static show = () => {
        if (refLoading) {
            refLoading._show();
        }
    }

    static close = () => {
        if (refLoading) {
            refLoading._close();
        }
    }

    _show = () => {
        this.setState(previousState => {
            return {
                ...previousState,
                isVisible: true
            }
        });
    }

    _close = () => {
        this.setState(previousState => {
            return {
                ...previousState,
                isVisible: false
            }
        });
    }

    render() {
        const { isVisible } = this.state;

        return (
            <div className={`wrap-loading ${isVisible ? 'active' : ''}`}>
                <i className="fa fa-spinner fa-spin wrap-loading-icon" aria-hidden="true"></i>
            </div>
        )
    }
}

export default Loading;