import React, { Component } from "react";
import classes from './index.module.css';
import SaveIcon from "../../assets/img/buttons/apply.svg";
import CloseIcon from "../../assets/img/buttons/DONG.png";

// reactstrap components
import {
  Button,
  Modal,
} from "reactstrap";

class WarningPopupDel extends Component {
  constructor(props) {
    super(props);

    this.state = {
    }
  }

  render() {
    const { warningPopupDelModal, toggleModal, moduleTitle, moduleBody, handleWarning } = this.props;

    return (
      <>
        <Modal
          className="modal-dialog-centered"
          isOpen={warningPopupDelModal}
          autoFocus={false}
        >
          <div className={`modal-header ${classes.moduleHeaderArea}`}>
            <h5 className="modal-title text-default-custom" id="warningPopupModalLabel">
              {moduleTitle}
            </h5>
          </div>

          <div className="modal-body text-default-custom">
            {moduleBody}
          </div>

          <div className={`modal-footer ${classes.modalButtonArea}`}>
            <Button 
              color="default" 
              className={`btn-success-cs`}
              type="button"
              onClick={() => {
                toggleModal('warningPopupDelModal');
                handleWarning();
              }}
            >
              <img src={SaveIcon} alt="Đồng ý" />
              <span>Đồng ý</span>
            </Button>
            
            <Button
              color="default"
              className={`btn-danger-cs`}
              data-dismiss="modal"
              type="button"
              onClick={() => toggleModal('warningPopupDelModal')}
            >
              <img src={CloseIcon} alt="Thoát ra" />
              <span>Thoát ra</span>
            </Button>

            {/* <img className={classes.iconButtonDongY} src={btnDongYLocBui} alt="Đồng ý" title="Đồng ý" width="25%" height="25%"
              onClick={() => {
                toggleModal('warningPopupModal');
                handleWarning();
              }}
            />

            <img className={classes.iconButtonDong} src={btnDongLocBui} alt="Đóng" title="Đóng" width="25%" height="25%"
              onClick={() => toggleModal('warningPopupModal')}
            /> */}
          </div>
        </Modal>
      </>
    );
  }
};

export default WarningPopupDel;
