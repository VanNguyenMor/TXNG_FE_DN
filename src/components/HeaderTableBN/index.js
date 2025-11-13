// import React, { Component } from "react";
// import { MenuContext, menuContext } from "../../helpers/common";
// import classes from './index.module.css';
// import custom from './custom.css';
// import CreateNewPopupBN from "../CreateNewPopupBN";
// import SearchImg from "../../assets/img/buttons/searchig.svg";
// import PlusImg from "../../assets/img/buttons/plus.svg";
// import ApplyImg from "../../assets/img/buttons/apply.svg";
// import ExitImg from "../../assets/img/buttons/exit.svg";
// import ReloadImg from "../../assets/img/buttons/reload.svg";

// // reactstrap components
// import {
//   Button,
//   Fade
// } from "reactstrap";

// class HeaderTableBN extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       fadeIn: false,
//       createNewModal: false
//     };
//   }

//   handleSearchButton = () => {
//     let { fadeIn } = this.state;

//     this.setState({ fadeIn: !fadeIn });
//   }

//   toggleModal = (state, type) => {
//     const { isPreventForm, closeForm } = this.props;

//     if (type != 1 && isPreventForm && this.state[state]) {

//     } else {
//       if (closeForm) {
//         closeForm();
//       }

//       this.setState({
//         [state]: !this.state[state]
//       });
//     }
//   };

//   render() {
//     const { fadeIn, createNewModal } = this.state;
//     const {
//       hideCreate,
//       hideSearch,
//       searchForm,
//       handleSubmitSearchForm,
//       moduleTitle,
//       moduleBody,
//       activeSubmit,
//       newData,
//       handleCreateInfoData,
//       dataReload,
//       typeSearch
//     } = this.props;

//     return (
//       <>
//         {/* Header */}
//         <div className={classes.headerTable}>
//           {/*  Name page */}
//           {/* ThangContext */}
//           {/* <MenuContext.Consumer>
//             {value => (
//               <p className={`${classes.pageName} text-primary`}>{value.data}</p>
//             )}
//           </MenuContext.Consumer> */}
//           {/* <div className={`${classes.mainFunc} custom-width-head-search`}>
//             {
//               typeSearch
//             }
//           </div> */}
//           <Button type="button" size="lg" className='btn-reload-cs' onClick={dataReload}>
//             <img src={ReloadImg} alt='Tải lại' />
//             <span>Tải lại</span>
//           </Button>
//           {
//             typeof (hideCreate) !== 'undefined' ? (
//               !hideCreate && (
//                 <Button className={`btn-primary-cs`} color="default" type="button" onClick={() => this.toggleModal("createNewModal")}>
//                   <img src={PlusImg} alt="Thêm mới" />
//                   <span>Thêm mới</span>
//                 </Button>
//                 // <img
//                 //   src={btnThemMoiLocBui} alt="Tạo mới" title="Tạo mới"
//                 //   onClick={() => this.toggleModal("createNewModal")}
//                 //   className={`${classes.iconButtonCreate} font-bold`}
//                 //   width="8%"
//                 //   height="8%"

//                 // />
//               )
//             ) : (
//               <Button className={`btn-primary-cs`} color="default" type="button" onClick={() => this.toggleModal("createNewModal")}>
//                 <img src={PlusImg} alt="Thêm mới" />
//                 <span>Thêm mới</span>
//               </Button>
//               // <img
//               //   src={btnThemMoiLocBui} alt="Tạo mới" title="Tạo mới"
//               //   onClick={() => this.toggleModal("createNewModal")}
//               //   className={`${classes.iconButtonCreate} font-bold`}
//               //   width="8%"
//               //   height="8%"

//               // />
//             )
//           }

//           {
//             typeof (hideSearch) !== 'undefined' ? (
//               !hideSearch && (
//                 <div className={classes.searchArea} style={{ textAlign: 'right' }}>
//                   <Button className={`btn-warning-cs`} color="default" type="button" onClick={() => this.handleSearchButton()}>
//                     <img src={SearchImg} alt='Tìm kiếm' />
//                     <span>Tìm kiếm</span>
//                   </Button>
//                   {/* <img
//                     src={btnTimKiemLocBui} alt="Tìm kiếm" title="Tìm kiếm"
//                     onClick={() => this.handleSearchButton()
//                     }
//                     className={`${classes.iconButtonSearch} font-bold`}
//                     width="30%"
//                     height="30%"

//                   /> */}

//                   {
//                     fadeIn && (
//                       <Fade in={fadeIn} tag="div" className={classes.searchBox}>
//                         <div style={{ textAlign: 'left' }}>
//                           {
//                             searchForm
//                           }
//                         </div>

//                         <div className={classes.searchButtonArea}>
//                           <Button className={`btn-warning-cs`} color="default" type="button" onClick={() => this.handleSearchButton()}>
//                             <img src={ExitImg} alt="Trở về" />
//                             <span>Trở về</span>
//                           </Button>

//                           <Button
//                             color="default"
//                             type="button"
//                             className={`btn-success-cs`}
//                             onClick={() => {
//                               handleSubmitSearchForm();
//                               this.handleSearchButton();
//                             }}
//                           >
//                             <img src={ApplyImg} alt="Áp dụng" />
//                             <span>Áp dụng</span>
//                           </Button>
//                           {/* <img
//                             className={classes.iconButtonDong}
//                             src={btnDongLocBui}
//                             alt="Thoát ra" title="Thoát ra"
//                             width="40%"
//                             height="40%"
//                             onClick={() => this.handleSearchButton()}
//                           /> */}

//                           {/* <img
//                             className={classes.iconButtonApdung}
//                             src={btnApDungLocBui}
//                             alt="Áp dụng" title="Áp dụng"
//                             width="40%"
//                             height="40%"
//                             onClick={() => {
//                               handleSubmitSearchForm();
//                               this.handleSearchButton();
//                             }}
//                           /> */}
//                         </div>
//                       </Fade>
//                     )
//                   }
//                 </div>
//               )
//             ) : (
//               <div className={classes.searchArea} style={{ textAlign: 'right' }}>
//                 <Button className={`btn-warning-cs`} color="default" type="button" onClick={() => this.handleSearchButton()}>
//                   <img src={SearchImg} alt='Tìm kiếm' />
//                   <span>Tìm kiếm</span>
//                 </Button>
//                 {/* <img
//                   src={btnTimKiemLocBui} alt="Tìm kiếm" title="Tìm kiếm"
//                   onClick={() => this.handleSearchButton()
//                   }
//                   className={`${classes.iconButtonSearch} font-bold`}
//                   width="30%"
//                   height="30%"

//                 /> */}

//                 {
//                   fadeIn && (
//                     <Fade in={fadeIn} tag="div" className={classes.searchBox}>
//                       <div style={{ textAlign: 'left' }}>
//                         {
//                           searchForm
//                         }
//                       </div>

//                       <div className={classes.searchButtonArea}>
//                         <Button className={`btn-warning-cs`} color="default" type="button" onClick={() => this.handleSearchButton()}>
//                           <img src={ExitImg} alt="Trở về" />
//                           <span>Trở về</span>
//                         </Button>

//                         <Button
//                           color="default"
//                           type="button"
//                           className={`btn-success-cs`}
//                           onClick={() => {
//                             handleSubmitSearchForm();
//                             this.handleSearchButton();
//                           }}
//                         >
//                           <img src={ApplyImg} alt="Áp dụng" />
//                           <span>Áp dụng</span>
//                         </Button>

//                         {/* <img
//                           className={classes.iconButtonDong}
//                           src={btnDongLocBui}
//                           alt="Thoát ra" title="Thoát ra"
//                           width="40%"
//                           height="40%"
//                           onClick={() => this.handleSearchButton()}
//                         /> */}

//                         {/* <img
//                           className={classes.iconButtonApdung}
//                           src={btnApDungLocBui}
//                           alt="Áp dụng" title="Áp dụng"
//                           width="40%"
//                           height="40%"
//                           onClick={() => {
//                             handleSubmitSearchForm();
//                             this.handleSearchButton();
//                           }}
//                         /> */}
//                       </div>
//                     </Fade>
//                   )
//                 }
//               </div>
//             )
//           }
//         </div>

//         {/* Create New */}
//         <CreateNewPopupBN
//           newData={newData}
//           moduleTitle={moduleTitle}
//           moduleBody={moduleBody}
//           createNewModal={createNewModal}
//           toggleModal={this.toggleModal}
//           activeSubmit={activeSubmit}
//           handleCreateInfoData={(data, beta, close) => {
//             handleCreateInfoData(data, () => {
//               this.setState({
//                 createNewModal: false
//               });
//             }, close);
//           }}
//         />
//       </>
//     );
//   }
// };

// export default HeaderTableBN;

import React, { Component } from "react";
// import { MenuContext, menuContext } from "../../helpers/common";
import classes from './index.module.css';
import custom from './custom.css';
import CreateNewPopupBN from "../CreateNewPopupBN";
import SearchImg from "../../assets/img/buttons/searchig.svg";
import PlusImg from "../../assets/img/buttons/plus.svg";
import ApplyImg from "../../assets/img/buttons/apply.svg";
import ExitImg from "../../assets/img/buttons/exit.svg";
import ReloadImg from "../../assets/img/buttons/reload.svg";
// reactstrap components
import {
  Button,
  Fade
} from "reactstrap";

class HeaderTableBN extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fadeIn: false,
      createNewModal: false
    };
  }

  handleSearchButton = () => {
    let { fadeIn } = this.state;

    this.setState({ fadeIn: !fadeIn });
  }



  toggleModal = (state, type) => {
    const { isPreventForm, closeForm, handleModal, handleModuleBody, } = this.props;

    if (handleModal) {
      handleModal(this.state[state], () => {
        this.setState({
          [state]: true
        }, () => {
          if (handleModuleBody) {
            handleModuleBody();
          }
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
      }, () => {
        if (this.state[state] && handleModuleBody) {
          handleModuleBody();
        }
      });
    }
  };

  render() {
    const { fadeIn, createNewModal } = this.state;
    const {
      hideCreate,
      hideSearch,
      searchForm,
      handleSubmitSearchForm,
      moduleTitle,
      moduleBody,
      activeSubmit,
      newData,
      handleCreateInfoData,
      screen,
      onConfirm,
      isShowForEdit,
      customComponent,
      hideTitle,
      dataReload,
      hideReload,
      styleCustom,
      typeSearch,
    } = this.props;

    return (
      <>
        {/* Header */}
        {
          !hideTitle && (
            <div className={`${classes.headerTable} ${styleCustom ? ' ' + styleCustom : ''} css-Header-table-align-item`}>
              {/*  Name page */}
              {/* ThangContext */}
              {/* <MenuContext.Consumer>
								{value => (
									<p className={`${classes.pageName} text-primary `}>{value.data}</p>
								)}
							</MenuContext.Consumer> */}
              <div className={`${classes.mainFunc} custom-width-head-search class-justify-left`}>
                {
                  typeSearch
                }
              </div>

              <div className={`${classes.mainFunc} `} style={{ display: 'flex' }}>
                {
                  customComponent
                }
                {
                  typeof (hideReload) !== 'undefined' ? (
                    !hideReload && (

                      <Button type="button" size="lg" className='btn-reload-cs  ' onClick={dataReload}>
                        <img src={ReloadImg} alt='Tải lại' />
                        <span>Tải lại</span>
                      </Button>
                    )
                  ) : (

                    <Button type="button" size="lg" className='btn-reload-cs ' onClick={dataReload}>
                      <img src={ReloadImg} alt='Tải lại' />
                      <span>Tải lại</span>
                    </Button>

                  )}
                {
                  typeof (hideCreate) !== 'undefined' ? (
                    !hideCreate && (
                      <Button type="button" size="lg" className='btn-primary-cs' onClick={() => this.toggleModal("createNewModal")}>
                        <img src={PlusImg} alt='Thêm mới' />
                        <span>Thêm mới</span>
                      </Button>
                      // <img
                      // 	src={btnThemMoiLocBui} alt="Tạo mới" title="Tạo mới"
                      // 	onClick={() => this.toggleModal("createNewModal")}
                      // 	className={`${classes.iconButtonCreate} font-bold`}
                      // 	width="8%"
                      // 	height="8%"

                      // />
                    )
                  ) : (
                    <Button type="button" size="lg" className='btn-primary-cs' onClick={() => this.toggleModal("createNewModal")}>
                      <img src={PlusImg} alt='Thêm mới' />
                      <span>Thêm mới</span>
                    </Button>
                    // <img
                    // 	src={btnThemMoiLocBui} alt="Tạo mới" title="Tạo mới"
                    // 	onClick={() => this.toggleModal("createNewModal")}
                    // 	className={`${classes.iconButtonCreate} font-bold`}
                    // 	width="8%"
                    // 	height="8%"

                    // />
                  )
                }

                {
                  typeof (hideSearch) !== 'undefined' ? (
                    !hideSearch && (
                      <div className={classes.searchArea} style={{ textAlign: 'right' }}>
                        <Button
                          className='btn-warning-cs '
                          color="default" type="button" size="md"
                          onClick={() => this.handleSearchButton()
                          }>
                          <img src={SearchImg} alt='Tìm kiếm' />
                          <span>Tìm kiếm</span>
                        </Button>
                        {/* <img
													src={btnTimKiemLocBui} alt="Tìm kiếm" title="Tìm kiếm"
													onClick={() => this.handleSearchButton()
													}
													className={`${classes.iconButtonSearch} font-bold`}
													width="30%"
													height="30%"

												/> */}
                        {
                          fadeIn && (
                            <Fade in={fadeIn} tag="div" className={classes.searchBox}>
                              <div style={{ textAlign: 'left' }}>
                                {
                                  searchForm
                                }
                              </div>

                              <div className={classes.searchButtonArea}>
                                <Button className={`btn-warning-cs`} color="default" type="button" onClick={() => this.handleSearchButton()}>
                                  <img src={ExitImg} alt="Trở về" />
                                  <span>Trở về</span>
                                </Button>

                                <Button
                                  color="default"
                                  type="button"
                                  className={`btn-success-cs`}
                                  onClick={() => {
                                    handleSubmitSearchForm();
                                    this.handleSearchButton();
                                  }}
                                >
                                  <img src={ApplyImg} alt="Áp dụng" />
                                  <span>Áp dụng</span>
                                </Button>

                                {/* <img
																	className={classes.iconButtonDong}
																	src={btnDongLocBui}
																	alt="Đóng" title="Đóng"
																	width="40%"
																	height="40%"
																	onClick={() => this.handleSearchButton()}
																/>

																<img
																	className={classes.iconButtonApdung}
																	src={btnApDungLocBui}
																	alt="Áp dụng" title="Áp dụng"
																	width="40%"
																	height="40%"
																	onClick={() => {
																		handleSubmitSearchForm();
																		this.handleSearchButton();
																	}}
																/> */}
                              </div>
                            </Fade>
                          )
                        }
                      </div>
                    )
                  ) : (
                    <div className={classes.searchArea} style={{ textAlign: 'right' }}>
                      <Button className='btn-warning-cs' color="default" type="button" size="lg" onClick={() => this.handleSearchButton()}>
                        <img src={SearchImg} alt='Tìm kiếm' />
                        <span>Tìm kiếm</span>
                      </Button>
                      {/* <img
												src={btnTimKiemLocBui} alt="Tìm kiếm" title="Tìm kiếm"
												onClick={() => this.handleSearchButton()}
												className={`${classes.iconButtonSearch} font-bold`}
												width="30%"
												height="30%"

											/> */}
                      {
                        fadeIn && (
                          <Fade in={fadeIn} tag="div" className={classes.searchBox}>
                            <div style={{ textAlign: 'left' }}>
                              {
                                searchForm
                              }
                            </div>

                            <div className={classes.searchButtonArea}>
                              <Button className='btn-warning-cs' color="default" type="button" size="md" onClick={() => this.handleSearchButton()}>
                                <img src={ExitImg} alt="Trở về" />
                                <span>Trở về</span>
                              </Button>
                              {/* <img
																className={classes.iconButtonDong}
																src={btnDongLocBui}
																alt="Đóng" title="Đóng"
																width="40%"
																height="40%"
																onClick={() => this.handleSearchButton()}
															/> */}
                              <Button
                                className='btn-success-cs'
                                color="default"
                                type="button"
                                size="md"
                                onClick={() => {
                                  handleSubmitSearchForm();
                                  this.handleSearchButton();
                                }}
                              >
                                <img src={ApplyImg} alt="Áp dụng" />
                                <span>Áp dụng</span>
                              </Button>
                              {/* <img
																className={classes.iconButtonApdung}
																src={btnApDungLocBui}
																alt="Áp dụng" title="Áp dụng"
																width="40%"
																height="40%"
																onClick={() => {
																	handleSubmitSearchForm();
																	this.handleSearchButton();
																}}
															/> */}
                            </div>
                          </Fade>
                        )
                      }
                    </div>
                  )
                }
              </div>
            </div>
          )
        }

        {/* Create New */}
        <CreateNewPopupBN
          screen={screen}
          newData={newData}
          moduleTitle={moduleTitle}
          moduleBody={moduleBody}
          createNewModal={isShowForEdit || createNewModal}
          isShowForEdit={isShowForEdit}
          onConfirm={onConfirm}
          toggleModal={this.toggleModal}
          activeSubmit={activeSubmit}
          handleCreateInfoData={(data, beta, close) => {
            handleCreateInfoData(data, () => {
              this.setState({
                createNewModal: false
              });
            }, close);
          }}
        />
      </>
    );
  }
};

export default HeaderTableBN;

