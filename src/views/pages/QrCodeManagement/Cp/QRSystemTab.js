import React from "react";
import {
  Card,
  Table,
  ButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from "reactstrap";
import HeadTitleTable from "components/HeadTitleTable";
import HeaderTable from "components/HeaderTable";
import MenuButton from "../../../../assets/img/buttons/menu.png";
import AddNewQRSystem from "../AddNewQRSystem";
import Pagination from "components/Pagination";
import CreateNewPopup from "components/CreateNewPopup";
import WarningPopup from "components/WarningPopup";

const QRSystemTab = ({
  isShowForEdit,
  headerQRSystem,
  dataQRSystem,
  beginItemQRSystem,
  endItemQRSystem,
  listLengthQRSystem,
  totalPageQRSystem,
  currentPageQRSystem,
  insertQRSystem,
  errorInserts,
  createNewModal,
  warningPopupDelQR,

  idQRSystem,
  handlePageClickQRSystem,
  toggleQRSystem,
  onEditQRSystem,
  toggleModal,
  onConfimQRSystem,
  setDeleteItem,
  toggleModalPopupDeleteQR,
  handleDeleteQRSystem,
  onHandleChangeValueQR,
  errorInsertAlert,
  activeCreateSubmit,
}) => {
  return (
    <div className="config-system-content-config-qr-system">
      <HeaderTable
        hideSearch={true}
        hideCreate={true}
        isReadOnly={true}
        styleCustom={"justifyContentStart"}
        isShowForEdit={isShowForEdit}
        moduleTitle={isShowForEdit ? "Xem QR hệ thống" : "Thêm mới QR hệ thống"}
        moduleBody={
          <AddNewQRSystem
            id={idQRSystem}
            onHandleChangeValue={onHandleChangeValueQR}
            errorInsert={errorInserts}
            data={insertQRSystem}
          />
        }
        handleModal={toggleModal}
        onConfirm={onConfimQRSystem}
      />

      <Card className="shadow">
        <Table className="align-items-center tablecs" responsive>
          <HeadTitleTable headerTitle={headerQRSystem} />
          <tbody>
            {Array.isArray(dataQRSystem) &&
              dataQRSystem
                .slice(beginItemQRSystem, endItemQRSystem)
                .map((item, idx) => (
                  <tr key={item.id || idx}>
                    <td>{beginItemQRSystem + idx + 1}</td>
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
                      <span>Code: {item.code}</span>
                      <br />
                      <span>Vùng sản xuất: {item.warehouseName}</span>
                    </td>
                    <td>
                      <ButtonDropdown
                        isOpen={item.collapse}
                        toggle={() => toggleQRSystem(idx, item.id)}
                      >
                        <DropdownToggle>
                          <img src={MenuButton} alt="Menu" />
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem
                            onClick={() =>
                              alert("Chuyển sang nhật ký truy xuất của QR này")
                            }
                          >
                            Xem nhật ký truy xuất
                          </DropdownItem>
                          <DropdownItem onClick={() => onEditQRSystem(item.id)}>
                            Xem thông tin QR
                          </DropdownItem>
                          <DropdownItem divider />
                          <DropdownItem
                            onClick={() => {
                              toggleModal("warningPopupDelQR");
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

      {listLengthQRSystem > 0 && (
        <Pagination
          data={dataQRSystem}
          listLength={listLengthQRSystem}
          totalPage={totalPageQRSystem}
          currentPage={currentPageQRSystem}
          handlePageClick={handlePageClickQRSystem}
        />
      )}

      {/* POPUP */}
      <CreateNewPopup
        createNewModal={createNewModal}
        moduleTitle="Thêm mới QR Hệ thống"
        type100={true}
        moduleBody={
          <AddNewQRSystem
            id={idQRSystem}
            errorInsert={errorInsertAlert}
            onHandleChangeValue={onHandleChangeValueQR}
          />
        }
        toggleModal={toggleModal}
        activeSubmit={activeCreateSubmit}
        onConfirm={onConfimQRSystem}
      />

      <WarningPopup
        moduleTitle="Thông báo"
        moduleBody={
          <p style={{ textAlign: "center", fontSize: "1.2rem" }}>
            Bạn đồng ý xoá thông tin QR hệ thống này?
          </p>
        }
        warningPopupModal={warningPopupDelQR}
        toggleModal={toggleModalPopupDeleteQR}
        handleWarning={handleDeleteQRSystem}
      />
    </div>
  );
};

export default QRSystemTab;
