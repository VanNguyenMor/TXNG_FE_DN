import React, { Component } from "react";
import classes from './index.module.css';
import ReactDatetime from "react-datetime";
import moment from 'moment';

// reactstrap components
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  Row
} from "reactstrap";

class UpdateModal3 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {
        type: 0
      },
      activeSubmit: false,
    }
  }

  componentDidMount() {
    this.setState({data: {type: 0}}, () => {
      this.handleCheckValidation()
    });
  }

  setcheck(event) {
    let { data } = this.state;
    const ev = event.target.value;
    data.type = ev;
    this.setState({ data }, () => {
      this.handleCheckValidation()
    });

  }

  handleCheckValidation = () => {
    const { handleCheckValidation, handleNewDetail } = this.props;
    let { data } = this.state;
    this.setState({ activeSubmit: true });
    // Check Validation 
    handleCheckValidation(true);
    // Handle New Data
    handleNewDetail(data);
  }

  render() {
    const { data } = this.state;

    return (
      <>
        <Row responsive={1} style={{ justifyContent: 'space-around' }}>
          <div className="row" style={{ alignItems: 'flex-start' }}>
            <Input
              type="radio"
              name="type"
              id="type"
              value={0}
              onChange={this.setcheck.bind(this)}
              defaultChecked
              style={{ position: 'inherit' }} />
            <label htmlFor="type" style={{fontSize: '1.2rem'}}>Danh sách mã tem</label>
          </div>
          <div className="row" style={{ alignItems: 'flex-start' }}>
            <Input
              type="radio"
              name="type"
              id="type"
              value={1}
              onChange={this.setcheck.bind(this)}
              style={{ position: 'inherit' }} />
            <label htmlFor="type" style={{fontSize: '1.2rem'}}>Danh sách mã QR</label>
          </div>

        </Row>
        <p style={{ textAlign: 'center', fontSize: '1.2rem' }}>
          <b style={{fontWeight:'bold'}}>Khi bạn chọn đồng ý, một email bao gồm mẫu tem và danh sách mã tem sẽ được gửi đến nhà in</b>
        </p>
      </>

    );
  }
};

export default UpdateModal3;
