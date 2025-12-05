// QRListTab.jsx
import React from "react";
import {
  Card,
  Table,
  ButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Row,
  Col,
  Input,
  Label,
  Button,
} from "reactstrap";
import ReactDatetime from "react-datetime";
import Select from "components/Select";

import NoImg from "../../../../assets/img/NoImg/NoImg.jpg";
import MenuButton from "../../../../assets/img/buttons/menu.png";
import SearchImg from "../../../../assets/img/buttons/searchig.svg";
import HeadTitleTable from "components/HeadTitleTable";
import HeaderTable from "components/HeaderTable";
import AddNewQRList from "../AddNewQRList";
import AddNewQRListHistory from "../AddNewQRListHistory";
import Pagination from "components/Pagination";
import CreateNewPopup from "components/CreateNewPopup";
import WarningPopup from "components/WarningPopup";

const QRListTab = ({
  isShowForEdit,
  isShowForListHistory,
  headerQRList,
  dataQRList,
  beginItemQRList,
  endItemQRList,
  listLengthQRList,
  totalPageQRList,
  totalElementQRList,
  currentPageQRList,

  insertQRList,
  errorInserts,
  createNewModal,
  activeCreateSubmit,
  warningPopupDelList,

  TEMLIST_OPTIONS,
  idQRList,

  toggleQRList,
  handlePageClickQRList,
  onEditQRList,
  onEditQRListHistory,
  toggleModal,
  toggleModalPopupDeleteList,
  handleDeleteQRList,
  handleModal,
  onHandleChangeValueQRList,
  onConfimQRList,
  setDeleteItem,
  // Filter props
  handleQRListDataReload,
  handleChangeSelectFilter,
  handleQRListSubmitSearch,
  fromDateQRList,
  toDateQRList,
  resetKeyQRList,
}) => {
  return (
    <div className="config-system-content-config-qr-list">
      <HeaderTable
        hideSearch={true}
        hideCreate={true}
        styleCustom={"justifyContentStart"}
        isShowForEdit={isShowForEdit}
        moduleTitle={
          isShowForEdit
            ? "Tạo yêu cầu hủy tem"
            : isShowForListHistory
            ? "Thông tin lịch sử dải tem"
            : "Quản lý Mã QR"
        }
        dataReload={handleQRListDataReload}
        moduleBody={
          <div>
            {isShowForEdit && (
              <AddNewQRList
                id={idQRList}
                onHandleChangeValue={onHandleChangeValueQRList}
                errorInsert={errorInserts}
                data={insertQRList}
                TEMLIST_OPTIONS={TEMLIST_OPTIONS}
              />
            )}

            {isShowForListHistory && <AddNewQRListHistory id={idQRList} />}
          </div>
        }
        handleModal={handleModal}
        onConfirm={onConfimQRList}
        typeSearch={
          <>
            <div
              className="div_flex"
              style={{
                marginBottom: "30px",
                flex: "wrap",
                width: "100%",
                flexWrap: "wrap",
                marginTop: "20px"
              }}
            >
              <div className="mg-div-search">
                <label className="form-control-label">Từ ngày</label>
                <ReactDatetime
                  key={`fromDateQRList-${resetKeyQRList}`}
                  inputProps={{ placeholder: "dd/mm/yyyy" }}
                  value={fromDateQRList || ""}
                  timeFormat={false}
                  dateFormat="DD-MM-YYYY"
                  onChange={(value) =>
                    handleChangeSelectFilter("fromDateQRList")(
                      value ? value.format("YYYY-MM-DD") : ""
                    )
                  }
                />
              </div>

              <div className="mg-div-search">
                <label className="form-control-label">Đến ngày</label>
                <ReactDatetime
                  key={`toDateQRList-${resetKeyQRList}`}
                  inputProps={{ placeholder: "dd/mm/yyyy" }}
                  value={toDateQRList || ""}
                  timeFormat={false}
                  dateFormat="DD-MM-YYYY"
                  onChange={(value) =>
                    handleChangeSelectFilter("toDateQRList")(
                      value ? value.format("YYYY-MM-DD") : ""
                    )
                  }
                />
              </div>

              <div className="mg-btn">
                <label className="form-control-label">&nbsp;</label>
                <Button
                  className="btn-warning-cs"
                  color="default"
                  size="md"
                  onClick={() => handleQRListSubmitSearch()}
                >
                  <img src={SearchImg} alt="Tìm kiếm" />
                  <span>Tìm kiếm</span>
                </Button>
              </div>
            </div>
          </>
        }
      />

      <Card className="shadow">
        <Table className="align-items-center tablecs" responsive>
          <HeadTitleTable headerTitle={headerQRList} />

          <tbody>
            {Array.isArray(dataQRList) &&
              dataQRList
                .filter(
                  (item, idx) => idx >= beginItemQRList && idx < endItemQRList
                )
                .map((item, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>

                    <td style={{ textAlign: "left" }}>
                      <span>Ngày ĐK: {item.approvalDate}</span>
                      <br />
                      <span>Số lượng: {item.quantity}</span>
                      <br />
                      <span>Dải tem: {item.temList}</span>
                    </td>

                    <td>{item.useCount}</td>
                    <td>{item.availableCount}</td>
                    <td>{item.errorCount}</td>

                    {/* <td>
                      <ButtonDropdown
                        isOpen={item.collapse}
                        toggle={() => toggleQRList(idx, item.id)}
                      >
                        <DropdownToggle>
                          <img src={MenuButton} alt="Menu" />
                        </DropdownToggle>

                        <DropdownMenu>
                          <DropdownItem onClick={onEditQRList(item.id)}>
                            Xử lý dải tem
                          </DropdownItem>

                          <DropdownItem onClick={onEditQRListHistory(item.id)}>
                            Xem lịch sử
                          </DropdownItem>

                          <DropdownItem divider />

                          <DropdownItem
                            onClick={() => {
                              toggleModal("warningPopupDelList");
                              setDeleteItem(item.id);
                            }}
                          >
                            Xoá
                          </DropdownItem>
                        </DropdownMenu>
                      </ButtonDropdown>
                    </td> */}
                  </tr>
                ))}
          </tbody>
        </Table>
      </Card>

      {Array.isArray(dataQRList) && listLengthQRList > 0 && (
        <Pagination
          data={dataQRList}
          listLength={listLengthQRList}
          totalPage={totalPageQRList}
          totalElement={totalElementQRList}
          currentPage={currentPageQRList}
          handlePageClick={handlePageClickQRList}
        />
      )}

      {/* POPUP */}
      <CreateNewPopup
        createNewModal={createNewModal}
        moduleTitle={
          isShowForEdit
            ? idQRList
              ? "Chỉnh sửa Mã QR"
              : "Xử lý dải tem"
            : isShowForListHistory
            ? "Thông tin lịch sử dải tem"
            : "Thông tin Mã QR"
        }
        type100={true}
        moduleBody={
          <div>
            {isShowForEdit && (
              <AddNewQRList
                id={idQRList}
                onHandleChangeValue={onHandleChangeValueQRList}
                errorInsert={errorInserts}
                TEMLIST_OPTIONS={TEMLIST_OPTIONS}
                data={insertQRList}
              />
            )}

            {isShowForListHistory && (
              <AddNewQRListHistory
                id={idQRList}
                onHandleChangeValue={onHandleChangeValueQRList}
                errorInsert={errorInserts}
                data={insertQRList}
              />
            )}
          </div>
        }
        toggleModal={toggleModal}
        activeSubmit={isShowForListHistory ? false : activeCreateSubmit}
        onConfirm={(data, close) => {
          if (!isShowForListHistory) onConfimQRList(data, close);
          else {
            if (close) close();
            else toggleModal("createNewModal");
          }
        }}
        isShowForEdit={!isShowForListHistory}
      />

      <WarningPopup
        moduleTitle="Thông báo"
        moduleBody={
          <p style={{ textAlign: "center", fontSize: "1.2rem" }}>
            Bạn đồng ý xoá thông tin Mã QR này?
          </p>
        }
        warningPopupModal={warningPopupDelList}
        toggleModal={toggleModalPopupDeleteList}
        handleWarning={handleDeleteQRList}
      />
    </div>
  );
};

export default QRListTab;
