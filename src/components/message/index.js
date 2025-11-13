import React, { Component } from 'react';

import '../../assets/css/control/message.css';

let refMessage = null;

const TIMEOUT_CLOSE = 2000;

class Message extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isVisible: false,
            title: '',
            message: '',
            type: null
        }

        this.timeOutClose = null;
    }

    static setRef = ref => {
        refMessage = ref;
    }

    static show = (type, title, message) => {
        if (refMessage) {
            clearTimeout(refMessage.timeOutClose);

            refMessage.timeOutClose = null;

            refMessage._close();
            refMessage._show(type, title, message);
        }
    }

    static close = () => {
        if (refMessage) {
            refMessage._close();
        }
    }

    _show = (type, title, message) => {
        this.setState(previousState => {
            return {
                ...previousState,
                isVisible: true,
                type,
                title,
                message
            }
        }, () => {
            this.timeOutClose = setTimeout(() => {
                this._close();

                clearTimeout(this.timeOutClose);

                this.timeOutClose = null;
            }, TIMEOUT_CLOSE);
        });
    }

    _close = () => {
        this.setState(previousState => {
            return {
                ...previousState,
                isVisible: false,
                type: null,
                title: '',
                message: ''
            }
        });
    }

    render() {
        const { isVisible, title, message, type } = this.state;

        return (
            <div className={`wrap-message ${isVisible ? 'active' : ''}`} style={{zIndex: 1000000}}>
                <h5 className={`wrap-message-title ${type}`}>{title}</h5>
                <p className='wrap-message-message'>{message}</p>
            </div>
        )
    }
}

export default Message;

export const TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning'
}