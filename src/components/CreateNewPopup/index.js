import React, { Component } from "react";
import classes from "./index.module.css";
import SaveIcon from "../../assets/img/buttons/apply.svg";
import CloseIcon from "../../assets/img/buttons/DONG.png";
import SaveIcon1 from "../../assets/img/buttons/save.svg";

// reactstrap components
import { Button, Modal } from "reactstrap";

class CreateNewPopup extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const {
      screen,
      createNewModal,
      toggleModal,
      type100,
      moduleTitle,
      moduleBody,
      activeSubmit,
      newData,
      handleCreateInfoData,
      onConfirm,
      isShowForEdit,
    } = this.props;

    return (
      <>
        <Modal
          className="modal-dialog-centered modal-scale"
          isOpen={createNewModal}
          autoFocus={false}
        >
          <div className={`modal-header ${classes.moduleHeaderArea}`}>
            <h5 className="modal-title" id="createNewModalLabel">
              {moduleTitle}
            </h5>
          </div>
          <div className={`modal-body`}>
            {createNewModal ? moduleBody : null}
          </div>
          <div className={`modal-footer ${classes.modalButtonArea}`}>
            {!this.props.isReadOnly && (
              <>
                {isShowForEdit ? (
                  <Button
                    color={activeSubmit ? "default" : ""}
                    type="button"
                    // className={`btn-primary-cs ${!activeSubmit && 'disbale-btn-cs'}`}
                    className={`btn-success-cs`}
                    data-dismiss="modal"
                    onClick={() => {
                      if (onConfirm) {
                        onConfirm(() => {
                          toggleModal("createNewModal");
                        }, "closePopup");
                      } else {
                        handleCreateInfoData(newData, "a", "closePopup");
                      }
                    }}
                    // disabled={activeSubmit ? false : true}
                  >
                    <img src={SaveIcon1} alt="Lưu lại" />
                    <span>Lưu lại</span>
                  </Button>
                ) : (
                  <>
                    <Button
                      color={activeSubmit ? "default" : ""}
                      type="button"
                      // className={`btn-primary-cs ${!activeSubmit && 'disbale-btn-cs'}`}
                      className={`btn-success-cs`}
                      onClick={() => {
                        if (onConfirm) {
                          onConfirm(() => {
                            toggleModal("createNewModal");
                          });
                        } else {
                          // toggleModal('createNewModal');
                          handleCreateInfoData(newData);
                        }
                      }}
                      // disabled={activeSubmit ? false : true}
                    >
                      <img src={SaveIcon1} alt="Lưu & Thêm" />
                      <span>Lưu & Thêm</span>
                    </Button>

                    <Button
                      color={activeSubmit ? "default" : ""}
                      type="button"
                      // className={`btn-primary-cs ${!activeSubmit && 'disbale-btn-cs'}`}
                      className={`btn-primary-cs`}
                      data-dismiss="modal"
                      onClick={() => {
                        if (onConfirm) {
                          onConfirm(() => {
                            toggleModal("createNewModal");
                          }, "closePopup");
                        } else {
                          handleCreateInfoData(newData, "a", "closePopup");
                        }
                      }}
                      // disabled={activeSubmit ? false : true}
                    >
                      <img src={SaveIcon1} alt="Lưu & Đóng" />
                      <span>Lưu & Đóng</span>
                    </Button>
                  </>
                )}
              </>
            )}

            <Button
              color="default"
              data-dismiss="modal"
              type="button"
              className={`btn-danger-cs`}
              onClick={() => toggleModal("createNewModal", type100 ? 100 : 1)}
            >
              <img src={CloseIcon} alt="Thoát ra" />
              <span>Thoát ra</span>
            </Button>
          </div>
        </Modal>
      </>
    );
  }
}

export default CreateNewPopup;
