import React, { Component } from "react";
import classes from "./index.module.css";
import ReactDOM from "react-dom";
import "./Select.css";

class Select extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      value: null,
      currentLabel: null,
      currentArray: [],
      top: 0,
      width: 0,
      left: 0,
      dissableMulti: false,
    };

    this.ref = null;
    this.refParent = null;
  }

  componentDidMount() {
    const { defaultValue, isMulti } = this.props;
    if (isMulti && defaultValue) {
      this.handleGetLabelNameMulti(defaultValue);
    }
    // if (isMulti) {

    document.addEventListener("click", this.handleClickOutside, true);
    // }
    // else {
    if (defaultValue) {
      this.handleGetLabelName(defaultValue);
    }
    // }
  }

  componentWillReceiveProps(props) {

  if (props.isMulti) {
    if (!props.defaultValue || props.defaultValue == this.state.value) {
      if (!props.defaultValue) {
        this.setState({ currentArray: [], currentLabel: [], value: null });
      }
    }
    if (props.defaultValue && props.defaultValue != this.state.value) {
      this.setState(
        () => ({ value: props.defaultValue }),
        () => this.handleGetLabelNameMulti(props.defaultValue)
      );
    }
  } 
  else {
    
    if (props.value !== undefined && props.value !== this.state.value) {
      if (props.value === null || props.value === "") {
        this.setState({
          value: null,
          currentLabel: null,
          currentArray: []
        });
      } else {
        this.handleGetLabelName(props.value);
      }
      return;
    }

    if (typeof props.defaultValue !== "undefined") {
      if (props.defaultValue === null || props.defaultValue === "") {
        this.setState({ 
          value: null, 
          currentLabel: null, 
          currentArray: [] 
        });
      } else if (props.defaultValue != this.state.value) {
        this.handleGetLabelName(props.defaultValue);
      }
    }
  }
}

  componentDidUpdate(prevProps) {
    const { data, defaultValue } = this.props;
    const { value, currentLabel } = this.state;

    // If data changes and we have a defaultValue selected, update the label
    if (data !== prevProps.data && defaultValue && data && data.length > 0) {
      // Always try to get the label when data changes, even if currentLabel exists
      this.handleGetLabelName(defaultValue);
    }
  }

  componentWillUnmount() {
    const { isMulti } = this.props;
    // if (isMulti) {
    document.removeEventListener("click", this.handleClickOutside, true);
    // }
  }

  handleClickOutside = (event) => {
    let { open } = this.state;
    const domNode = ReactDOM.findDOMNode(this);

    if (!domNode || !domNode.contains(event.target)) {
      this.setState(
        {
          open: false,
        },
        () => {
          this.setState({ dissableMulti: false });
        }
      );
    }
  };

  handleOpen = () => {
    const { isMulti } = this.props;
    if (this.refParent) {
      const { left, top, width, height } =
        this.refParent.getBoundingClientRect();

      let { open } = this.state;

      this.setState({ open: !open, top: top + height, width, left }, () => {
        if (isMulti) {
          if (this.state.open == true) {
            this.setState({ dissableMulti: true });
          }
        }
      });
    }
  };

  onClose = () => {
    this.setState({ open: false }, () => {
      this.setState({ dissableMulti: false });
    });
  };

  handleSelect = (event) => {
    const { handleChange, name, isMulti } = this.props;
    const { currentArray, open } = this.state;
    const ev = event.currentTarget;

    let _currentArray = [...currentArray];
    let value = event.currentTarget.getAttribute("value");
    let currentLabel = event.currentTarget.getAttribute("label");

    // value = value || this.state.value;

    currentLabel = currentLabel || this.state.currentLabel;

    if (isMulti) {
      if (_currentArray.length == 1 && open == false) {
        value = null;
      }

      if (value) {
        if (value.includes(",") == true) {
          value = null;
        }
      }

      // if (currentLabel) {
      //   if (currentLabel.includes(',') == true) {
      //     currentLabel = null
      //   }
      // }

      if (_currentArray.length > 0) {
        _currentArray.map((p) => {
          if (!p.value) {
            _currentArray.splice(p);
          } else {
            if (p.value.includes(",")) {
              _currentArray.splice(p);
            }
          }
        });
      }

      if (_currentArray.length > 0) {
        if (_currentArray.find((p) => p.value == value)) {
          //if (_currentArray.length > 1) {
          //LOI 04/07/2022
          _currentArray = _currentArray.filter((p) => p.value != value);
          //}
        } else {
          if (value && currentLabel) {
            _currentArray.push({
              value,
              label: currentLabel,
            });
          }
        }
      } else {
        if (value && currentLabel) {
          _currentArray.push({
            value,
            label: currentLabel,
          });
        }
      }

      value = _currentArray.map((p) => p.value).join(",");
      // currentLabel = _currentArray.map(p => p.label).join(',');
      currentLabel = _currentArray.map((p) => p.label);
      currentLabel = currentLabel.filter((p) => p !== null);
    }

    this.setState({
      value,
      currentLabel,
      currentArray: _currentArray,
    });

    if (!isMulti) {
      this.handleOpen();
    }

    // Handle Changge Custom
    if (typeof handleChange !== "undefined") {
      handleChange(value, name);
    }
  };
  // handleSelectWard = (event) => {
  // 	const { handleChange, name, isMulti } = this.props;
  // 	const { currentArray } = this.state;
  // 	const ev = event.target;

  // 	let _currentArray = [...currentArray];

  // 	let value = event.target.getAttribute('value');
  // 	let currentLabel = event.target.getAttribute('label');

  // 	if (isMulti) {
  // 		if (_currentArray.find(p => p.value == value)) {
  // 			_currentArray = _currentArray.filter(p => p.value != value);
  // 		} else {
  // 			_currentArray.push({
  // 				value,
  // 				label: currentLabel
  // 			});
  // 		}

  // 		value = _currentArray.map(p => p.value).join(',');
  // 		// currentLabel = _currentArray.map(p => p.label).join(',');
  // 		currentLabel = _currentArray.map(p => p.label);
  // 		currentLabel = currentLabel.filter(p => p !== null);
  // 	}

  // 	this.setState({
  // 		value,
  // 		currentLabel,
  // 		currentArray: _currentArray
  // 	});

  // 	if (!isMulti) {
  // 		this.handleOpen();
  // 	}

  // 	// Handle Changge Custom
  // 	if (typeof (handleChange) !== 'undefined') {
  // 		handleChange(value, name);
  // 	}
  // }

  /**
   * handleGetLabelName: Handle Get Label Name
   * @param {*} value
   */
  handleGetLabelName = (value) => {
    const { data, val, labelName, isMulti } = this.props;
    let current = null;

    if (typeof value !== "undefined") {
      if (value !== null) {
        if (typeof data !== "undefined") {
          if (typeof val !== "undefined") {
            if (Array.isArray(data)) {
              data
                .filter(
                  (item) =>
                    item[val].toString().toUpperCase().trim() ===
                    value.toString().toUpperCase().trim()
                )
                .map((item) => (current = item));
            }
            if (current !== null)
              this.setState({
                value:
                  current[val] != null ? current[val].toString() : current[val],
                currentLabel: current[labelName],
              });
          } else {
            data
              .filter((item) => item === value)
              .map((item) => (current = value));

            if (current !== null)
              this.setState({
                value: current != null ? current.toString() : current,
                currentLabel: current,
              });
          }
        }
      }
    }
  };

  /**
   * handleGetLabelNameMulti: Handle Get Label Name Multi
   * @param {*} value
   */
  handleGetLabelNameMulti = (value) => {
    const { data, labelName } = this.props;
    let current = [];
    let currentLb = [];
    if (typeof value !== "undefined") {
      const values = String(value)
        .split(",")
        .map((v) => v.trim());
      data
        .filter((item) => values.includes(String(item.id)))
        .map(
          (item) => (
            current.push({ value: String(item.id), label: item[labelName] }),
            currentLb.push(item[labelName])
          )
        );

      this.setState({
        currentArray: current,
        currentLabel: currentLb,
        value: String(value),
      });
    }
  };

  resetValue = () => {
    this.setState((previousState) => {
      return {
        ...previousState,
        value: null,
      };
    });
  };

  render() {
    const {
      title,
      data,
      labelName,
      val,
      name,
      isHideSelectAll,
      isHideDefault,
      notActiveRoot,
      isDisable,
      labelMark,
      isMulti,
      refLabel,
      isDisNo2,
    } = this.props;
    const {
      currentArray,
      open,
      value,
      currentLabel,
      left,
      top,
      width,
      dissableMulti,
    } = this.state;
    const hasValue =
      value !== null &&
      ((Array.isArray(value) && value.length > 0) ||
        (!Array.isArray(value) && String(value).length > 0));

    return (
      <div
        ref={(ref) => (this.refParent = ref)}
        className={
          isDisable == true || dissableMulti === true
            ? `${classes.selectDisable} ${
                Array.isArray(currentLabel) && classes.overSelectHeight
              } css-select-height-button`
            : `${classes.select} ${
                Array.isArray(currentLabel) && classes.overSelectHeight
              } css-select-height-button`
        }
      >
        <div
          className={`${classes.selectHeader} css-select-header `}
          label={currentLabel}
          value={value}
          onClick={
            isDisable == true || dissableMulti == true
              ? () => {}
              : (event) => {
                  this.handleOpen();
                  !notActiveRoot && this.handleSelect(event);
                }
          }
        >
          {hasValue ? (
            <div
              className={`${classes.text} ${
                Array.isArray(currentLabel) && classes.overHeight
              } css-height-span-select`}
            >
              {labelMark ||
                (typeof currentLabel !== "undefined" &&
                  (Array.isArray(currentLabel) ? (
                    currentLabel.map((item, key) => (
                      <span
                        key={key}
                        className={`${classes.tips} text-white bg-info css-height-span-select`}
                      >
                        {item}
                      </span>
                    ))
                  ) : (
                    <span className="css-height-span-select css-white-space">
                      {currentLabel}
                    </span>
                  )))}
            </div>
          ) : (
            <span className={`${classes.text} css-height-span-select `}>
              {" "}
              {labelMark ||
                (isHideDefault !== true && "---" + title + "---")}{" "}
            </span>
          )}
          <i className="ni ni-bold-down"></i>
        </div>
        {open && (
          <div
            ref={(ref) => (this.ref = ref)}
            className={classes.selectBody}
            name={name}
            style={{
              left,
              top,
              width,
              position: "fixed",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                // width: 15,
                // height: 15,
                // pointerEvents: 'none'
              }}
              onClick={this.onClose}
              className={classes.selectPopupClose}
            >
              <button
                style={{
                  background: "none",
                  border: "none",
                }}
                className={classes.selectPopupCloseButton}
              >
                <img
                  style={{
                    width: 12,
                    height: 12,
                  }}
                  className={classes.selectPopupCloseButtonIcon}
                  src="cores/imgs/ics/close.png"
                />
              </button>
            </div>
            {/* {isHideSelectAll ? null : (
								<div className={classes.items} value={null} onClick={(event) => { this.handleSelect(event); this.handleSelectWard(event) }}>
									<span className={classes.text}>Tất cả</span>
								</div>
							)} */}
            {isHideSelectAll ? null : (
              <div
                className={classes.items}
                value={null}
                onClick={(event) => {
                  this.handleSelect(event);
                  // this.handleSelectWard(event)
                }}
              >
                {value !== null && value.length > 0 && Array.isArray(value) ? (
                  <span className={classes.text}>
                    {labelMark || currentLabel}
                  </span>
                ) : (
                  // <span className={classes.text}> {labelMark || '---' + title + '---'} </span>
                  <span className={classes.text}>
                    {" "}
                    {"---" + title + "---"}{" "}
                  </span>
                )}
              </div>
            )}

            {Array.isArray(data) &&
              data.map((item, key) =>
                typeof labelName === "undefined" ? (
                  <div
                    key={key}
                    className={classes.items}
                    label={item}
                    value={item}
                    onClick={(event) => {
                      this.handleSelect(event);
                    }}
                    style={
                      isDisNo2 == true && key == 1
                        ? { pointerEvents: "none", backgroundColor: "#dddddd" }
                        : currentArray.find((p) => p.value == item.id)
                        ? { backgroundColor: "rgba(0, 0, 0, 0.1)" }
                        : {}
                    }
                  >
                    <div className={classes.text}>
                      {isMulti && (
                        <input
                          type="checkbox"
                          checked={
                            currentArray.find((p) => p.value == item.id)
                              ? true
                              : false
                          }
                        />
                      )}
                      <span style={{ paddingLeft: 5 }}>{item}</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <div
                      key={key}
                      className={classes.items}
                      label={item[labelName]}
                      value={item[val]}
                      onClick={(event) => {
                        this.handleSelect(event);
                        // this.handleSelectWard(event)
                      }}
                      style={
                        isDisNo2 == true && key == 1
                          ? {
                              pointerEvents: "none",
                              backgroundColor: "#dddddd",
                            }
                          : currentArray.find((p) => p.value == item.id)
                          ? { backgroundColor: "rgba(0, 0, 0, 0.1)" }
                          : {}
                      }
                    >
                      <div className={classes.text}>
                        {isMulti && (
                          <input
                            type="checkbox"
                            checked={
                              currentArray.find((p) => p.value == item.id)
                                ? true
                                : false
                            }
                          />
                        )}
                        <span style={{ paddingLeft: 5 }}>
                          {item[labelName]}
                        </span>
                      </div>
                    </div>
                  </>
                )
              )}
          </div>
        )}
      </div>
    );
  }
}

export default Select;
