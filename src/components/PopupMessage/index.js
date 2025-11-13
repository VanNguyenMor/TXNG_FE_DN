import React, { Component } from "react";
import classes from './index.module.css';
import CloseIcon from "../../assets/img/buttons/DONG.png";
import { deleteCookie } from "../../helpers/cookie";

// reactstrap components
import {
  Button,
  Modal,
} from "reactstrap";

class PopupMessage extends Component {
  constructor(props) {
    super(props);

    this.state = {
    }
  }

  logout = () => {
    deleteCookie('AUTHEN_INFO');
    window.location.href = '/'
  }

  render() {
    const { popupMessage, toggleModal, moduleTitle, moduleBody, logout } = this.props;

    return (
      <>
        <Modal
          className="modal-dialog-centered"
          isOpen={popupMessage}
          autoFocus={false}

        >
          <div className={`modal-header ${classes.moduleHeaderArea}`} >
            <h5 className="modal-title text-default-custom" id="warningPopupModalLabel">
              {moduleTitle}
            </h5>
          </div>

          <div className="modal-body text-default-custom">
            <p className={classes.title}>{moduleBody}</p>
          </div>

          <div className={`modal-footer ${classes.modalButtonArea}`}>
            <Button
              color="default"
              className={`btn-danger-cs`}
              data-dismiss="modal"
              type="button"
              onClick={() => {
                toggleModal('popupMessage');
                if (logout) {
                  this.logout()
                }
              }}
            >
              <img src={CloseIcon} alt='Thoát ra' />
              <span>Thoát</span>
            </Button>
          </div>
        </Modal>
      </>
    );
  }
};

export default PopupMessage;
