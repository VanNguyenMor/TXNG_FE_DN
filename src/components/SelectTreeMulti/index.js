import React, { Component } from "react";
import classes from './index.module.css';
import ReactDOM from 'react-dom';

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
	}

	componentWillReceiveProps(nextProp) {
		const { defaultValue, isMulti } = nextProp;

		if (isMulti) {
			this.handleGetLabelNameMulti(defaultValue);

		}
		else { this.handleGetLabelName(defaultValue); }
	}

	componentDidMount() {
		const { defaultValue, isMulti } = this.props;

		if (isMulti) {
			this.handleGetLabelNameMulti(defaultValue);
			document.addEventListener('click', this.handleClickOutside, true);
		}
		else { this.handleGetLabelName(defaultValue); }
	}

	componentWillUnmount() {
		const { isMulti } = this.props;
		if (isMulti) {
			document.removeEventListener('click', this.handleClickOutside, true);
		}
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
		let { open } = this.state;

		this.setState({ open: !open });
	}

	handleSelect = (event) => {
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
			const cb = (item, key, array) => {
				if (value.split(',').includes(item.id)) {
					current.push({ value: item.id, label: item.fieldName });
					currentLb.push(item.fieldName);
				}

				this.setState({ currentArray: current, currentLabel: currentLb, value });

				item.children && item.children.forEach(cb);
			}
			data.forEach(cb);
		}
	}

	renderTreeLine = (nodelv) => {
		let line = '-';

		for (let i = 0; i < nodelv; i++) {
			line = `${line.repeat(2)}`;
		}

		return line;
	}

	renderTreeSelect = (data, currentArray, isMulti, labelName, val, dataAll) => {
		const { beginItem, endItem } = this.state;
		const { selected, fieldName } = this.props;
		let list = [];
		let parentid = [];
		let autoIndex = 0;
		let isDisable = true;

		data.filter((item, key) => key >= beginItem && key < endItem);
		data.forEach(e => parentid.push(e.id));

		let dataAll1;
		if (dataAll == "undefined" || dataAll == null || dataAll == "") {
			dataAll1 = ""
		} else {
			dataAll1 = dataAll.filter(x => dataAll.find(y => y.parentID === x.id))
		}

		const cb = (e, key, array) => {
			const renderClass = e.parentID.length === 0 ? (
				`${classes.treeParent}`
			) : (
				`${classes.treeChild}${parentid.includes(e.parentID) ? ` ${classes.childs}` : ` ${classes.childsItem}`}`
			);

			list.push(
				typeof (labelName) === 'undefined' ? (
					<div
						key={autoIndex}
						parentid={e.parentID}
						currentid={e.id} index={autoIndex}
						className={classes.items}
						//disabled={e.parentID == "" ? isDisable : null}
						label={e}
						value={e}
						selected={selected === e ? true : false}
						style={currentArray.find(p => p.value == e.id) ? { backgroundColor: 'rgba(0, 0, 0, 0.1)' } : {}}
						onClick={(event) => { this.handleSelect(event); }}
					>

						{e.nodelv > 1 && this.renderTreeLine(e.nodelv)}
						{/* {isMulti && <input type="checkbox" checked={currentArray.find(p => p.value == e.id) ? true : false} />} */}
						{e}

					</div>
				) : (
					<div
						key={autoIndex}
						parentid={e.parentID}
						currentid={e.id} index={autoIndex}
						className={classes.items}
						//disabled={e.parentID == "" ? isDisable : null}
						label={e[labelName]}
						value={e[val]}
						selected={selected === e[val] ? true : false}
						style={currentArray.find(p => p.value == e.id) ? { backgroundColor: 'rgba(0, 0, 0, 0.1)' } : {}}
						onClick={(event) => this.handleSelect(event)}
					>

						{e.nodelv > 1 && this.renderTreeLine(e.nodelv)}
						{/* {isMulti && <input type="checkbox" checked={currentArray.find(p => p.value == e.id) ? true : false} />} */}
						{e.fieldName}

					</div>
				)
			);

			autoIndex++;
			e.children && e.children.forEach(cb);
		}

		data.forEach(cb);
		return list;
	}

	render() {
		const { title, data, labelName, val, name, isHideSelectAll, isHideDefault, notActiveRoot, isDisable, labelMark, isMulti, dataAll } = this.props;
		const { currentArray, open, value, currentLabel } = this.state;

		return (
			<div className={isDisable == true ? `${classes.selectDisable} ${Array.isArray(currentLabel) && classes.overSelectHeight} css-select-height-button` : `${classes.select} ${Array.isArray(currentLabel) && classes.overSelectHeight} css-select-height-button`} >
				<div className={classes.selectHeader} value={null} onClick={isDisable ? () => { } : (event) => {
					this.handleOpen();
					!notActiveRoot && this.handleSelect(event);
					!notActiveRoot && this.handleSelectWard(event)
				}}>
					{value !== null && value.length > 0 ? (
						<div className={`${classes.text} ${Array.isArray(currentLabel) && classes.overHeight}`}>{labelMark || (
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
						<div ref={ref => this.ref = ref} className={classes.selectBody} name={name}>
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

							{
								Array.isArray(data) && (
									this.renderTreeSelect(data, currentArray, isMulti, labelName, val, dataAll)
								)
							}
						</div>
					)
				}
			</div>
		);
	}
};

export default SelectParent;

