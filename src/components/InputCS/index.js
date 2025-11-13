import React, { Component } from "react";
import "./index.css";
import CurrencyFormat from 'react-currency-format';
 
import {
    Input
} from "reactstrap";

class InputCS extends Component {
  state = {
    value: 0
  }
 
  onChange = (event) => {
    this.setState({
      value: event.target.value
    });
  }

  render() {
		const { value } = this.state;

    return (
      <CurrencyFormat 
				value={value} 
				thousandSeparator={true}
				onChange={(event) => this.onChange(event)}
				customInput={Input}
			/>
    );
  }
}

export default InputCS;