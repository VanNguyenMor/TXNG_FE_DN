import React, { Component } from "react";
import classes from './index.module.css';
import SaveIcon from "../../assets/img/buttons/apply.svg";
import CloseIcon from "../../assets/img/buttons/DONG.png";
import SaveIcon1 from "../../assets/img/buttons/save.svg";
import InsertOrUpdate from "views/pages/NewRegBus/InsertOrUpdate";
// reactstrap components
import {
	Button,
	Modal,
} from "reactstrap";

class NewCompanyPopup extends Component {
	constructor(props) {
		super(props);

		this.state = {
			newCompanyModal: false
		}
	}

	render() {
		const { newCompanyModal, toggleModal, moduleTitle, moduleBody, activeSubmit, handleUpdateInfoData, newData } = this.props;
		return (
			<>
				<Modal
					className="modal-dialog-centered modal-scale"
					isOpen={newCompanyModal}
					autoFocus={false}
				>
					<div className={`modal-header ${classes.moduleHeaderArea}`}>
						<h5 className="modal-title" id="updateModalLabel">
							{moduleTitle}
							{/* THÊM MỚI KHÁCH HÀNG */}
						</h5>
					</div>

					<div className="modal-body">
						{moduleBody}
						{/* <div className="row">
							<Button
								color={activeSubmit ? "default" : ''}
								type="button"
								className={`btn-success-cs`}
							// onClick={() => {
							// 	toggleModal('extendModal');
							// 	handleUpdateInfoData(newData);
							// }}
							>
								<img src={SaveIcon1} alt='Doanh nghiệp' />
								<span>Doanh nghiệp</span>
							</Button>

							<Button
								color="danger"
								data-dismiss="modal"
								type="button"
								className={`btn-danger-cs`}
							// onClick={() => toggleModal('extendModal')}
							>
								<img src={CloseIcon} alt='Doanh nghiệp' />
								<span>Cá nhân</span>
							</Button>
						</div> */}
					</div>

					{/* <div className={`modal-footer ${classes.modalButtonArea}`}>
						<Button
							color={activeSubmit ? "default" : ''}
							type="button"
							className={`btn-success-cs`}
							// onClick={() => {
							// 	toggleModal('extendModal');
							// 	handleUpdateInfoData(newData);
							// }}
						>
							<img src={SaveIcon1} alt='Doanh nghiệp' />
							<span>Doanh nghiệp</span>
						</Button>

						<Button
							color="danger"
							data-dismiss="modal"
							type="button"
							className={`btn-danger-cs`}
							// onClick={() => toggleModal('extendModal')}
						>
							<img src={CloseIcon} alt='Doanh nghiệp' />
							<span>Cá nhân</span>
						</Button>


					</div> */}
				</Modal>				
			</>
		);
	}
};

export default NewCompanyPopup;
