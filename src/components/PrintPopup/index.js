import React, { Component } from "react";
import classes from './index.module.css';
import PrintIcon from "../../assets/img/buttons/printig.svg";
import CloseIcon from "../../assets/img/buttons/DONG.png";
import { Printd } from 'printd';
import {
	Button
} from "reactstrap";

// reactstrap components
import {
	Modal,
} from "reactstrap";

const cssTextA5 = `
	@media print {
    	@page { margin: 0; }
  }
  #printarea {
		color: #000080;
		font-size: 14px;
		font-family: Arial, Helvetica, sans-serif;
		border: 1px solid #000;
  }

	#printarea > div {
    padding: 10px;
	height: 450px;
	}

	.row {
		display: flex;
		flex-wrap: wrap;
		margin-right: -15px;
		margin-left: -15px;
	}

	.row.item {
		margin:0 23px;
		text-align: center;
	}
	
	.row.imageP {
		width: 190px;
		height: 190px;
	}

	.row.labelP {
		color: #000;
		font-size: 12px;
		text-align: center;
	}

	.rowItem {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.rowItem.end {
    	
	}

	.rowItem .text {
		position: relative;
		font-size: 14px;
		margin-bottom: 6px;
	}

	.rowItem .text .value {
		position: absolute;
		left: 24%;
		top: -3px;
	}

	.text-bold {
		font-family: 'Arial Bold', 'Arial', sans-serif;
		font-weight: 700;
	}

	.title {
		color: #000080;
		text-align: center;
		padding-left: 217px;
	}

	.title-area {
		display: flex;
		margin-top: 20px;
		justify-content: center;
		align-items:  center;
	}

	.title-area .num {
		position: relative;
		padding-left: 60px;
	}

	.title-area .num .text {
    	font-size: 14px;
	}

	.border-dot {
    	border-bottom: 1px dotted;
	}

	.italic-text {
    	font-style: italic;
	}

	.rowItem .text .date {
		position: relative;
		display: inline-block;
		text-align: center;
		width: 70px;
}

	.rowItem .text .date::after {
			content: '';
			position: absolute;
			width: 100%;
			height: 1px;
			bottom: 4px;
			left: 0;
			border-bottom: 1px dotted;
	}

.rowItem .text .month {
    position: relative;
    display: inline-block;
    text-align: center;
    width: 70px;
}

.rowItem .text .month::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 1px;
    bottom: 4px;
    left: 0;
    border-bottom: 1px dotted;
}

.rowItem .text .year {
    position: relative;
    display: inline-block;
    text-align: center;
    width: 70px;
}

.rowItem .text .year::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 1px;
    bottom: 4px;
    left: 0;
    border-bottom: 1px dotted;
}
`;
const cssText = `
	@media print {
    	@page { margin: 0; }
  }
  #printarea {
		color: #000080;
		font-size: 14px;
		font-family: Arial, Helvetica, sans-serif;
		border: 1px solid #000;
  }

	#printarea > div {
    padding: 10px;
	}

	.row {
		display: flex;
		flex-wrap: wrap;
		margin-right: -15px;
		margin-left: -15px;
	}

	.row.item {
		margin:0 23px;
		text-align: center;
	}
	
	.row.imageP {
		width: 190px;
		height: 190px;
	}

	.row.labelP {
		color: #000;
		font-size: 12px;
		text-align: center;
	}

	.rowItem {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.rowItem.end {
    	
	}

	.rowItem .text {
		position: relative;
		font-size: 14px;
		margin-bottom: 6px;
	}

	.rowItem .text .value {
		position: absolute;
		left: 24%;
		top: -3px;
	}

	.text-bold {
		font-family: 'Arial Bold', 'Arial', sans-serif;
		font-weight: 700;
	}

	.title {
		color: #000080;
		text-align: center;
		padding-left: 217px;
	}

	.title-area {
		display: flex;
		margin-top: 20px;
		justify-content: center;
		align-items:  center;
	}

	.title-area .num {
		position: relative;
		padding-left: 60px;
	}

	.title-area .num .text {
    	font-size: 14px;
	}

	.border-dot {
    	border-bottom: 1px dotted;
	}

	.italic-text {
    	font-style: italic;
	}

	.rowItem .text .date {
		position: relative;
		display: inline-block;
		text-align: center;
		width: 70px;
}

	.rowItem .text .date::after {
			content: '';
			position: absolute;
			width: 100%;
			height: 1px;
			bottom: 4px;
			left: 0;
			border-bottom: 1px dotted;
	}

.rowItem .text .month {
    position: relative;
    display: inline-block;
    text-align: center;
    width: 70px;
}

.rowItem .text .month::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 1px;
    bottom: 4px;
    left: 0;
    border-bottom: 1px dotted;
}

.rowItem .text .year {
    position: relative;
    display: inline-block;
    text-align: center;
    width: 70px;
}

.rowItem .text .year::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 1px;
    bottom: 4px;
    left: 0;
    border-bottom: 1px dotted;
}
`;

class PrintPopup extends Component {
	constructor(props) {
		super(props);

		this.state = {
		}
	}

	handlePrint = () => {
		const { id, formA5 } = this.props;
		const base = document.createElement("base");
		const d = new Printd({
			headElements: [base]
		});

		d.print(document.getElementById(id), [formA5 ? cssTextA5 : cssText]);
	}

	render() {
		const { screen, printModal, toggleModal, moduleBody, onConfirm, moduleTitle, lableBtnSave } = this.props;

		return (
			<>
				<Modal
					className="modal-dialog-centered modal-scale"
					isOpen={printModal}
					size="lg"
					autoFocus={false}
				>
					<div className={`modal-header ${classes.moduleHeaderArea}`}>
						<h5 className="modal-title" id="updateModalLabel">
							{moduleTitle}
						</h5>
					</div>
					<div className={`modal-body`}>
						{moduleBody}
					</div>
					<div className={`modal-footer ${classes.modalButtonArea}`}>
						{/* <img className={`${classes.iconButtonLuu} button-cursor-pointer`}
							src={btnLuuLocBui} alt="In" title="In"
							width="112"
							height="25%"
							onClick={() => {
								if (onConfirm) {
									onConfirm(() => {
										toggleModal('printModal');
									});
								} else {
									toggleModal('printModal');
									this.handlePrint();
								}
							}}
						/> */}
						{/* <img className={`${classes.iconButtonDong} button-cursor-pointer`}
							src={btnDongLocBui} alt="Đóng" title="Đóng"
							width="112"
							height="25%"
							onClick={() => toggleModal('printModal', ['account', 'manageCompany'].includes(screen) ? 1 : null)}
						/> */}

						<Button
							className={`btn-success-cs`}
							color="default" type="button"
							onClick={() => {
								if (onConfirm) {
									onConfirm(() => {
										toggleModal('printModal');
									});
								} else {
									toggleModal('printModal');
									this.handlePrint();
								}
							}}
						>
							<img src={PrintIcon} alt='In phiếu' />
							<span>{lableBtnSave ? lableBtnSave : "In phiếu"}</span>
						</Button>

						<Button
							className={`btn-danger-cs`}
							color="default" type="button"
							onClick={() => toggleModal('printModal', ['account', 'manageCompany'].includes(screen) ? 1 : null)}
						>
							<img src={CloseIcon} alt='Thoát ra' />
							<span>Thoát ra</span>
						</Button>
					</div>
				</Modal>
			</>
		);
	}
};

export default PrintPopup;
