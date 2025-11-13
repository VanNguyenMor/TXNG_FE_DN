import React, { Component } from "react";
import { handleCurrencyFormat } from "../../helpers/common";
import "./index.css";
 
import {
    Input
} from "reactstrap";

class InputCurrency extends Component {
  state = {
    value: null
  }
 
  onChange = (event) => {
    const validation = /[0-9]/g;

    if (event.target.value.match(validation)) {
      let newString = event.target.value.match(validation);

      newString = newString.join().replaceAll(',','');
      newString = handleCurrencyFormat(newString);

      this.setState({
        value: newString
      });
    } else {
      this.setState({
        value: 0
      });
    }
  }

  render() {
    const { name, placeholder, defaultValue, onKeyUp, autoFocus } = this.props;
		const { value } = this.state;

    return (
      <Input
        name={name}
        type="text"
        autoFocus
        value={value}
        defaultValue={handleCurrencyFormat(defaultValue)}
        placeholder={placeholder}
				onChange={(event) => this.onChange(event)}
        onKeyUp={onKeyUp}
			/>
    );
  }
}

export default InputCurrency;