import React, { Component } from "react";
import "./index.css";
import { Alert } from 'reactstrap';

class AlertComp extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { value, open } = this.props;
        
        return (
            open !== null && <Alert color={value.status ? 'success' : 'danger'}><strong>{value.message}</strong></Alert>
        );
    }
}
export default AlertComp;
