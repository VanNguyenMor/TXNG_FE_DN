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

class UpdatePopup2 extends Component {
	constructor(props) {
		super(props);

		this.state = {
			updateModal2: false
		}
	}
	toggleModalA = (state, type) => {
		const { isPreventForm, closeForm, handleModal } = this.props;

		if (handleModal) {
			handleModal(this.state[state], () => {
				this.setState({
					[state]: true
				});
			}, () => {
				this.setState({
					[state]: false
				});
			});

			return;
		}

		if (type != 1 && isPreventForm && this.state[state]) {

		} else {
			if (closeForm) {
				closeForm();
			}

			this.setState({
				[state]: !this.state[state]
			});
		}
	};
	render() {
		const { updateModal2, toggleModal, moduleTitle, moduleBody, activeSubmit, handleUpdateInfoData, newData, hiddenBtnSave, resize, renameBtn, reiconBtn } = this.props;

		return (
			<>
				<Modal
					className="modal-dialog-centered modal-scale"
					isOpen={updateModal2}
					autoFocus={false}
					size={resize ? resize : "xl"}
				>
					<div className={`modal-header ${classes.moduleHeaderArea}`}>
						<h5 className="modal-title" id="updateModalLabel">
							{moduleTitle}
						</h5>
					</div>

					<div className="modal-body">
						{moduleBody}
					</div>

					<div className={`modal-footer ${classes.modalButtonArea}`}>
						{hiddenBtnSave ? null : (
							<Button
								color={activeSubmit ? "default" : ''}
								type="button"
								// className={!activeSubmit && classes.disbaleBtn}
								className={`btn-success-cs`}
								// disabled={activeSubmit ? false : true}

								onClick={() => {
									this.toggleModalA('updateModal2');
									handleUpdateInfoData(newData);
								}}

							// disabled={activeSubmit ? false : true}
							>
								<img src={reiconBtn ? reiconBtn : SaveIcon1} alt='Lưu lại' />
								<span>{renameBtn ? renameBtn : 'Lưu lại'}</span>
							</Button>
						)}

						<Button
							color="danger"
							data-dismiss="modal"
							type="button"
							className={`btn-danger-cs`}
							onClick={() => toggleModal('updateModal2')}
						>
							<img src={CloseIcon} alt='Thoát ra' />
							<span>Thoát ra</span>
						</Button>

						{/* <img
							className={`${classes.iconButtonLuu} button-cursor-pointer`}
							src={btnLuuLocBui} alt="Lưu" title="Lưu"
							width="25%"
							height="25%"
							onClick={() => {
								toggleModal('updateModal', 1);
								handleUpdateInfoData(newData);
							}}
						/>
						<img
							className={`${classes.iconButtonDong} button-cursor-pointer`}
							src={btnDongLocBui}
							alt="Đóng" title="Đóng"
							width="25%"
							height="25%"
							onClick={() => toggleModal('updateModal')}
						/> */}
					</div>
				</Modal>
			</>
		);
	}
};

export default UpdatePopup2;
