import React from "react";
import {
  Card,
  ButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Button,
  Table,
} from "reactstrap";
import ReactDatetime from "react-datetime";
import AddNewQRArises from "../AddNewQRArises";
import Select from "components/Select";
import HeadTitleTable from "components/HeadTitleTable";
import HeaderTable from "components/HeaderTable";
import NoImg from "../../../../assets/img/NoImg/NoImg.jpg";
import MenuButton from "../../../../assets/img/buttons/menu.png";
import Pagination from "components/Pagination";
import CreateNewPopup from "components/CreateNewPopup";
import WarningPopup from "components/WarningPopup";
import SearchImg from "../../../../assets/img/buttons/searchig.svg";

const QRArisesTab = ({
  isShowForEdit,
  headerQRArises,

  dataQRArises,
  beginItemQRArises,
  endItemQRArises,
  currentPageQRArises,
  limitQRArises,

  fromDate,
  toDate,

  insertQRArises,
  errorInserts,
  errorInsertAlert,
  createNewModal,
  activeCreateSubmit,
  warningPopupDelArises,

  idQRArises,
  toggleQRArises,
  handleDeleteQRArises,
  handlePageClickQRArises,
  toggleModal,
  onHandleChangeValueQRArises,
  onConfimQRArises,
  handleChangeSelectFilter,
  handleSubmitSearchForm,
  showTitleWithStatus,
  setDeleteItem,
  PRODUCT_OPTIONS,
  setState,
}) => {
  const sourceData = Array.isArray(dataQRArises) ? dataQRArises : [];
  const pageSize = Number(limitQRArises) > 0 ? Number(limitQRArises) : 10;
  const paginatedData = sourceData.slice(beginItemQRArises, endItemQRArises);
  const totalFilteredElements = sourceData.length;
  const totalPageFiltered = Math.ceil(totalFilteredElements / pageSize);

  return (
    <div className="config-system-content-config-qr-generate">
      <HeaderTable
        hideSearch={true}
        hideCreate={true}
        styleCustom={"justifyContentStart"}
        isShowForEdit={isShowForEdit}
        moduleTitle={
          isShowForEdit ? "Chỉnh sửa QR Phát sinh" : "Thêm mới QR Phát sinh"
        }
        moduleBody={
          <AddNewQRArises
            id={idQRArises}
            onHandleChangeValue={onHandleChangeValueQRArises}
            errorInsert={errorInserts}
            data={insertQRArises}
          />
        }
        handleModal={() => {}}
        onConfirm={onConfimQRArises}
        typeSearch={
          <>
            <div
              className="div_flex"
              style={{
                marginBottom: "30px",
                flex: "wrap",
                width: "100%",
                flexWrap: "wrap",
              }}
            >
              <div className="mg-div-search">
                <label className="form-control-label">Từ ngày</label>
                <ReactDatetime
                  inputProps={{ placeholder: "dd/mm/yyyy" }}
                  value={fromDate || ""}
                  timeFormat={false}
                  dateFormat="DD-MM-YYYY"
                  onChange={(value) =>
                    setState({
                      fromDate: value ? value.format("YYYY-MM-DD") : "",
                    })
                  }
                />
              </div>

              <div className="mg-div-search">
                <label className="form-control-label">Đến ngày</label>
                <ReactDatetime
                  inputProps={{ placeholder: "dd/mm/yyyy" }}
                  value={toDate || ""}
                  timeFormat={false}
                  dateFormat="DD-MM-YYYY"
                  onChange={(value) =>
                    setState({
                      toDate: value ? value.format("YYYY-MM-DD") : "",
                    })
                  }
                />
              </div>

              <div className="mg-div-search">
                <label className="form-control-label">Sản phẩm</label>
                <Select
                  name="filter"
                  title="Lọc theo sản phẩm"
                  data={PRODUCT_OPTIONS}
                  labelName="title"
                  val="id"
                  handleChange={handleChangeSelectFilter}
                />
              </div>

              <div className="mg-btn">
                <label className="form-control-label">&nbsp;</label>
                <Button
                  className="btn-warning-cs"
                  color="default"
                  size="md"
                  onClick={() => handleSubmitSearchForm()}
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
          <HeadTitleTable headerTitle={headerQRArises} />
          <tbody>
            {paginatedData.map((item, idx) => (
              <tr key={idx}>
                <td>{item.index}</td>
                <td>
                  <img
                    style={{ width: 82, height: 82 }}
                    src={item.image ? item.image : NoImg}
                    alt="..."
                  />
                </td>
                <td style={{ textAlign: "left" }}>
                  <span
                    style={{
                      color: "#1ec6e8",
                      fontWeight: "bold",
                      fontSize: 14,
                    }}
                  >
                    {item.productName}
                  </span>
                  <br />
                  <span>Lô hàng: {item.batchNum}</span>
                  <br />
                  <span>Ngày kiểm duyệt: {item.confirmedDate}</span>
                  <br />
                  <span>Người kiểm duyệt: {item.confirmedByName}</span>
                </td>
                <td>{showTitleWithStatus(item.status)}</td>
                <td>
                  <ButtonDropdown
                    isOpen={item.collapse}
                    toggle={() => toggleQRArises(idx, item.id)}
                  >
                    <DropdownToggle>
                      <img src={MenuButton} alt="Menu" />
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem
                        onClick={() =>
                          alert(
                            "Chuyển sang trang nhật ký truy xuất của QR này"
                          )
                        }
                      >
                        Chi tiết nhật ký truy xuất
                      </DropdownItem>
                      <DropdownItem divider />
                      <DropdownItem
                        onClick={() => {
                          toggleModal("warningPopupDelArises");
                          setDeleteItem(item.id);
                        }}
                      >
                        Xoá
                      </DropdownItem>
                    </DropdownMenu>
                  </ButtonDropdown>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      {totalFilteredElements > 0 && (
        <Pagination
          data={sourceData}
          listLength={totalFilteredElements}
          totalPage={totalPageFiltered}
          totalElement={totalFilteredElements}
          currentPage={currentPageQRArises}
          handlePageClick={handlePageClickQRArises}
        />
      )}

      <CreateNewPopup
        createNewModal={createNewModal}
        moduleTitle="Thêm mới QR Phát sinh"
        type100={true}
        moduleBody={
          <AddNewQRArises
            id={idQRArises}
            errorInsert={errorInsertAlert}
            onHandleChangeValue={onHandleChangeValueQRArises}
          />
        }
        toggleModal={toggleModal}
        activeSubmit={activeCreateSubmit}
        onConfirm={onConfimQRArises}
      />

      <WarningPopup
        moduleTitle="Thông báo"
        moduleBody={
          <p style={{ textAlign: "center", fontSize: "1.2rem" }}>
            Bạn đồng ý xoá thông tin QR Phát sinh?
          </p>
        }
        warningPopupModal={warningPopupDelArises}
        toggleModal={toggleModal}
        handleWarning={handleDeleteQRArises}
      />
    </div>
  );
};

export default QRArisesTab;
