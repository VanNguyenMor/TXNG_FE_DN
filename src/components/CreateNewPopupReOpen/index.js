import React, { Component } from "react";
import classes from './index.module.css';
import SaveIcon from "../../assets/img/buttons/apply.svg";
import CloseIcon from "../../assets/img/buttons/DONG.png";
import SaveIcon1 from "../../assets/img/buttons/save.svg";

// reactstrap components
import {
	Button,
	Modal,
} from "reactstrap";

class CreateNewPopupReOpen extends Component {
	constructor(props) {
		super(props);

		this.state = {
			
		}
	}

	render() {
		const { screen, createNewModalReOpen, toggleModal, type100, moduleTitle, moduleBody, activeSubmit, newData, handleCreateInfoData, onConfirm } = this.props;

		return (
			<>
				<Modal
					className="modal-dialog-centered modal-scale"
					isOpen={createNewModalReOpen}
					autoFocus={false}
				>
					<div className={`modal-header ${classes.moduleHeaderArea}`}>
						<h5 className="modal-title" id="createNewModalLabel">
							{moduleTitle}
						</h5>
					</div>
					<div className={`modal-body`}>
						{createNewModalReOpen ? moduleBody : null}
					</div>
					<div className={`modal-footer ${classes.modalButtonArea}`}>

						{/* <img className={`${classes.iconButtonLuu} button-cursor-pointer`}
							src={btnLuuLocBui} alt="Lưu" title="Lưu"
							width="25%"
							height="25%"
							onClick={() => {
								if (onConfirm) {
									onConfirm(() => {
										toggleModal('createNewModal');
									});
								} else {
									toggleModal('createNewModal');
									handleCreateInfoData(newData);
								}
							}}
						/>
						<img className={`${classes.iconButtonDong} button-cursor-pointer`}
							src={btnDongLocBui} alt="Đóng" title="Đóng"
							width="25%"
							height="25%"
							onClick={() => toggleModal('createNewModal', ['account', 'manageCompany', 'menu'].includes(screen) ? 1 : null)}
						/> */}

						<Button
							color={activeSubmit ? "default" : ''}
							type="button"
							className={`btn-success-cs`}
							onClick={() => {
								if (onConfirm) {
									onConfirm(() => {
										toggleModal('createNewModalReOpen');
									});
								} else {
									// toggleModal('createNewModal');
									handleCreateInfoData(newData);
								}

							}}>
							<img src={SaveIcon1} alt='Lưu & Thêm' />
							<span>Lưu & Thêm</span>
						</Button>

						<Button
							color={activeSubmit ? "default" : ''}
							type="button"
							// className={`btn-primary-cs ${!activeSubmit && 'disbale-btn-cs'}`}
							className={`btn-primary-cs`}
							onClick={() => {
								if (onConfirm) {
									onConfirm(() => {
										toggleModal('createNewModalReOpen');
									});
								} else {
									// toggleModal('createNewModal');
									handleCreateInfoData(newData);
								}
							}}
						// disabled={activeSubmit ? false : true}
						>
							<img src={SaveIcon1} alt='Lưu & Đóng' />
							<span>Lưu & Đóng</span>
						</Button>

						<Button
							color="default"
							data-dismiss="modal"
							type="button"
							className={`btn-danger-cs`}
							onClick={() => toggleModal('createNewModalReOpen', type100 ? 100 : 1)}
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

export default CreateNewPopupReOpen;
