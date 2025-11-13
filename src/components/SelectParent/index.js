import React, { Component } from "react";
import classes from './index.module.css';
import ReactDOM from 'react-dom';
import './SelectParent.css'

const results = (data, parentId, parentName) => {
	return Object.keys(data).reduce((result, key) => {
		(!result.find(p => p.id == data[key][parentId])) &&
			result.push({
				id: data[key][parentId],
				name: data[key][parentName]
			});
		return result
	}, [])
}

class SelectParent extends Component {
	constructor(props) {
		super(props);

		this.state = {
			open: false,
			value: null,
			currentLabel: null,
			currentArray: []
		};

		this.ref = null;
		this.refParent = null;
	}

	componentDidMount() {
		const { defaultValue, isMulti } = this.props;
		if (isMulti) {
			this.handleGetLabelNameMulti(defaultValue);
		}
		// if (isMulti) {

		document.addEventListener('click', this.handleClickOutside, true);
		// }
		// else {
		this.handleGetLabelName(defaultValue);
		// }
	}

	componentWillReceiveProps(props) {
		if (props.defaultValue && props.defaultValue != this.state.value && props.isMulti) {
			this.setState(previousState => {
				return {
					...previousState,
					value: props.defaultValue
				}
			}, () => {
				this.handleGetLabelNameMulti(this.state.value);
			});
		}
	}


	componentWillUnmount() {
		const { isMulti } = this.props;
		// if (isMulti) {
		document.removeEventListener('click', this.handleClickOutside, true);
		// }
	}

	handleClickOutside = event => {
		let { open } = this.state;
		const domNode = ReactDOM.findDOMNode(this);

		if (!domNode || !domNode.contains(event.target)) {
			this.setState({
				open: false
			});
		}
	}

	handleOpen = () => {
		if (this.refParent) {
			const { left, top, width, height } = this.refParent.getBoundingClientRect();

			let { open } = this.state;

			this.setState({ open: !open, top: top + height, width, left });
		}
	}

	handleSelect = (event) => {
		const { handleChange, name, isMulti } = this.props;
		const { currentArray } = this.state;
		const ev = event.target;

		let _currentArray = [...currentArray];

		let value = event.target.getAttribute('value');
		let currentLabel = event.target.getAttribute('label');

		currentLabel = currentLabel || this.state.currentLabel;

		if (isMulti) {
			if (_currentArray.find(p => p.value == value)) {
				_currentArray = _currentArray.filter(p => p.value != value);
			} else {
				_currentArray.push({
					value,
					label: currentLabel
				});
			}

			value = _currentArray.map(p => p.value).join(',');
			// currentLabel = _currentArray.map(p => p.label).join(',');
			currentLabel = _currentArray.map(p => p.label);
			currentLabel = currentLabel.filter(p => p !== null);
		}

		this.setState({
			value,
			currentLabel,
			currentArray: _currentArray
		});

		if (!isMulti) {
			this.handleOpen();
		}

		// Handle Changge Custom
		if (typeof (handleChange) !== 'undefined') {
			handleChange(value, name);
		}
	}
	handleSelectWard = (event) => {
		const { handleChange, name, isMulti } = this.props;
		const { currentArray } = this.state;
		const ev = event.target;

		let _currentArray = [...currentArray];

		let value = event.target.getAttribute('value');
		let currentLabel = event.target.getAttribute('label');

		if (isMulti) {
			if (_currentArray.find(p => p.value == value)) {
				_currentArray = _currentArray.filter(p => p.value != value);
			} else {
				_currentArray.push({
					value,
					label: currentLabel
				});
			}

			value = _currentArray.map(p => p.value).join(',');
			// currentLabel = _currentArray.map(p => p.label).join(',');
			currentLabel = _currentArray.map(p => p.label);
			currentLabel = currentLabel.filter(p => p !== null);
		}

		this.setState({
			value,
			currentLabel,
			currentArray: _currentArray
		});

		if (!isMulti) {
			this.handleOpen();
		}

		// Handle Changge Custom
		if (typeof (handleChange) !== 'undefined') {
			handleChange(value, name);
		}
	}

	/**
	 * handleGetLabelName: Handle Get Label Name
	 * @param {*} value
	 */
	handleGetLabelName = (value) => {
		const { data, val, labelName, isMulti } = this.props;
		let current = null;

		if (typeof (value) !== 'undefined') {
			if (value !== null) {
				if (typeof (data) !== 'undefined') {
					if (typeof (val) !== 'undefined') {
						if (Array.isArray(data)) {
							data.filter(item => item[val] === value)
								.map(item => current = item)
						}
						if (current !== null)
							this.setState({ value: current[val], currentLabel: current[labelName] });
					} else {
						data.filter(item => item === value)
							.map(item => current = value);

						if (current !== null)
							this.setState({ value: current, currentLabel: current });
					}
				}
			}
		}
	}

	/**
	 * handleGetLabelNameMulti: Handle Get Label Name Multi
	 * @param {*} value
	 */
	handleGetLabelNameMulti = (value) => {
		const { data } = this.props;
		let current = [];
		let currentLb = [];
		if (typeof (value) !== 'undefined') {
			data.filter(item => value.split(',').includes(item.id))
				.map(item => (
					current.push({ value: item.id, label: item.name }),
					currentLb.push(item.name)
				));

			this.setState({ currentArray: current, currentLabel: currentLb, value });
		}
	}

	resetValue = () => {
		this.setState(previousState => {
			return {
				...previousState,
				value: null
			}
		});
	}

	onClose = () => {
		this.setState({ open: false });
	}

	render() {
		const { title, data, labelName, val, name,
			isHideSelectAll, isHideDefault, notActiveRoot,
			isDisable, labelMark, isMulti, refLabel,
			parentId, parentName, noneParent
		} = this.props;
		const { currentArray, open, value, currentLabel, left, top, width } = this.state;

		const _data = data || [];

		let dataParent = [];
		dataParent = results(_data, parentId, parentName)
		return (

			<div ref={ref => this.refParent = ref} className={isDisable == true ?
				`${classes.selectDisable} ${Array.isArray(currentLabel) && classes.overSelectHeight}` :
				`${classes.select} ${Array.isArray(currentLabel) && classes.overSelectHeight} SelectParent_selectHeader__height`} >
				<div className={`${classes.selectHeader} Select_parent_header__height`} value={null} onClick={isDisable == true ? () => { } : (event) => {
					this.handleOpen();
					!notActiveRoot && this.handleSelect(event);
					!notActiveRoot && this.handleSelectWard(event)
				}}>
					{value !== null && value.length > 0 ? (
						<div className={`${classes.text} ${Array.isArray(currentLabel) && classes.overHeight} Select_parent_text__height`}>{labelMark || (
							typeof (currentLabel) !== 'undefined' && (
								Array.isArray(currentLabel) ? (
									currentLabel.map((item, key) => (
										<span key={key} className={`${classes.tips} text-white bg-info`}>{item}</span>
									))
								) : (
									<span>{currentLabel}</span>
								)
							)
						)}</div>
					) : <span className={classes.text}>--- {labelMark || isHideDefault !== true && title} ---</span>}
					<i className="ni ni-bold-down"></i>
				</div>
				{
					open && (
						<div ref={ref => this.ref = ref} className={classes.selectBody} name={name} style={{
							left,
							top,
							width,
							position: 'fixed',
							zIndex: 100
						}}>
							<div style={{
								display: 'flex',
								justifyContent: 'flex-end',
								alignItems: 'center',
								// width: 15,
								// height: 15,
								// pointerEvents: 'none'
							}} onClick={this.onClose} className={classes.selectPopupClose}>
								<button style={{
									background: 'none',
									border: 'none'
								}} className={classes.selectPopupCloseButton}>
									<img style={{
										width: 12,
										height: 12
									}} className={classes.selectPopupCloseButtonIcon} src="cores/imgs/ics/close.png" />
								</button>
							</div>
							{/* {isHideSelectAll ? null : (
								<div className={classes.items} value={null} onClick={(event) => { this.handleSelect(event); this.handleSelectWard(event) }}>
									<span className={classes.text}>Tất cả</span>
								</div>
							)} */}
							{
								isHideSelectAll ? null : (
									<div className={classes.items} value={null} onClick={(event) => { this.handleSelect(event); this.handleSelectWard(event) }}>
										{value !== null && value.length > 0 ? <span className={classes.text}>{labelMark || currentLabel}</span> : <span className={classes.text}>--- {labelMark || title} ---</span>}
									</div>
								)
							}
							{Array.isArray(dataParent) && (
								dataParent.map((itPa, key1) => (
									<>
										{itPa.name ? <div
											key={key1}
											className={`${classes.items} ${classes.noHover}`}
											label={itPa}
										>
											<div className={classes.text}>
												<span style={{
													paddingLeft: 5,
													fontWeight: 'bold'
												}}>
													{itPa.name}</span>
											</div>
										</div> : null}
										{
											Array.isArray(data) && (
												data.filter((item) => item[parentId] == itPa.id)
													.map((item, key) => (
														typeof (labelName) === 'undefined' ? (
															<div
																key={key}
																className={classes.items}
																label={item}
																value={item}
																onClick={(event) => { this.handleSelect(event) }}
																style={currentArray.find(p => p.value == item.id) ? { backgroundColor: 'rgba(0, 0, 0, 0.1)' } : {}}>
																<div className={classes.text}>
																	{isMulti &&
																		<input type="checkbox" checked={currentArray.find(p => p.value == item.id) ? true : false} />
																	}
																	{noneParent ?
																		<span style={{ paddingLeft: 5 }}>{item}</span> :
																		<span style={{ paddingLeft: 5 }}>{'---' + item}</span>
																	}
																</div>
															</div>
														) : (
															<div
																key={key}
																className={classes.items}
																label={item[labelName]}
																value={item[val]}
																onClick={(event) => {
																	this.handleSelect(event);
																	this.handleSelectWard(event)
																}}
																style={currentArray.find(p => p.value == item.id) ? { backgroundColor: 'rgba(0, 0, 0, 0.1)' } : {}}>
																<div className={classes.text}>
																	{isMulti &&
																		<input type="checkbox" checked={currentArray.find(p => p.value == item.id) ? true : false} />
																	}
																	{noneParent ?
																		<span style={{ paddingLeft: 5 }}>{item[labelName]}</span> :
																		<span style={{ paddingLeft: 5 }}>{'---' + item[labelName]}</span>}
																</div>
															</div>
														)))
											)
										}
									</>
								)))
							}
						</div>
					)
				}
			</div>
		);
	}
};

export default SelectParent;
