import React, { Component } from "react";
import classes from './index.module.css';
import CloseIcon from "../../assets/img/buttons/DONG.png";
import './ViewPopup.css'


// reactstrap components
import {
  Button,
  Modal,
} from "reactstrap";

class ViewPopup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      viewModal: false
    }
  }

  render() {
    const { classNameModalBody, viewModal, toggleModal, moduleTitle, moduleBody, activeSubmit, handleUpdateInfoData, newData, componentFooter } = this.props;

    return (
      <>
        <Modal
          className="modal-dialog-centered"
          isOpen={viewModal}
          size="xl"
          autoFocus={false}
        >
          <div className={`modal-header ${classes.moduleHeaderArea}`}>
            <h5 className="modal-title" id="updateModalLabel">
              {moduleTitle}
            </h5>
          </div>

          <div className={`modal-body ${classNameModalBody}`}>
            {moduleBody}
          </div>

          <div className={`modal-footer ${classes.modalButtonArea} z-index-footer-view-popup`}>
            {/* <Button 
              color={activeSubmit ? "success" : ''} 
              type="button"
              className={!activeSubmit && classes.disbaleBtn}
              disabled={activeSubmit ? false : true}
              onClick={() => {
                toggleModal('updateModal');
                
                handleUpdateInfoData(newData);
              }}
            >
              <img className={classes.iconButton} src={SaveIcon} alt="Tạo mới" title="Tạo mới" />
              <span>Lưu</span>
              
            </Button> */}

            {/* <Button
              color="danger"
              data-dismiss="modal"
              type="button"
              onClick={() => toggleModal('updateModal')}
            >
              <img className={classes.iconButton} src={CloseIcon} alt="Đóng" title="Đóng" />
              <span>Đóng</span>
            </Button> */}

            {/* <img className={classes.iconButton}
              src={btnLuu} alt="Lưu" title="Lưu"
              width="25%"
              height="25%"
              onClick={() => {
                toggleModal('viewModal');
                handleUpdateInfoData(newData);
              }}
            /> */}

            {/* <img className={classes.iconButton}
              src={btnDong} alt="Đóng" title="Đóng"
              width="115"
              height="29.17"
              onClick={() => toggleModal('viewModal')}
              /> */}
            {componentFooter}
            <Button
              color="default"
              data-dismiss="modal"
              type="button"
              className={`btn-danger-cs`}
              onClick={() => toggleModal('viewModal')}
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

export default ViewPopup;
