/*!

=========================================================
* Argon Dashboard React - v1.2.1
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
/*eslint-disable*/
import { useEffect, useState } from "react";
import { NavLink as NavLinkRRD, Link, Route } from "react-router-dom";
// nodejs library to set properties for components
import { PropTypes } from "prop-types";
import _, { clamp, filter } from 'lodash';
import { deleteCookie } from "../../helpers/cookie";
import { NAVBAR_PARENT_ITEM_LIST } from "../../helpers/constant";
import classes from './index.module.css';
//import { ACCOUNT_CLAIM, ACCOUNT_ID, ACCOUNT_AVA, ACCOUNT_NAME, IS_ADMIN } from "../../services/Common";
import { ICON_MENUS } from '../../assets/img';
import NoImg from "../../assets/img/NoImg/NoImg.jpg"
import UpdatePopup from "../UpdatePopup";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Collapse,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Media,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
} from "reactstrap";

var ps;

const Sidebar = (props) => {
  const [collapseOpen, setCollapseOpen] = useState();
  const [fileView, setFileView] = useState(null);
  const [file, setFile] = useState("");
  const [details, setDetails] = useState(null);
  const [notChang, setNotChang] = useState(false);
  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  };
  // toggles collapse between opened and closed (true/false)
  const toggleCollapse = () => {
    setCollapseOpen((data) => !data);
  };
  // closes the collapse
  const closeCollapse = () => {
    setCollapseOpen(false);
  };

  const parentMenuList = NAVBAR_PARENT_ITEM_LIST;

  const handleNewDataUpdate = (data) => {
    // this.setState({ file: data.ThumbnailFile, fileView: data.fileView })
    setFile = data.ThumbnailFile;
    setFileView = data.fileView;
  }

  const toggleModal = (state) => {
    [state] = !this.state[state];
    setDetails = null;
  };

  const handleOpenEdit = () => {
    const { getUserInfo } = this.props;
    // getUserInfo(ACCOUNT_ID).then(res => {
    getUserInfo(localStorage.getItem('ACCOUNT_ID')).then(res => {
      if (res.data.status == 200) {
        this.setState({ details: res.data.data });
      }
    })
  }

  // creates the links that appear in the left menu / Sidebar
  const createLinks = (routes) => {
    return (
      parentMenuList.map((item, key) => (
        <div key={key} className={classes.navItem}>
          {
            /* Heading */
            <h6 className={`navbar-heading text-muted ${classes.sessionTitle}`}>{item}</h6>
          }
          {
            routes
              .filter((prop) => key === prop.key)
              .map((prop, key) => {
                return (
                  <Nav navbar key={key}>
                    <NavItem>
                      <NavLink
                        to={prop.layout + prop.path}
                        tag={NavLinkRRD}
                        onClick={closeCollapse}
                        activeClassName="active"
                      >
                        <i className={prop.icon} />
                        {prop.name}
                      </NavLink>
                    </NavItem>
                  </Nav>
                );
              })
          }

          {/* Divider */}
          {
            parentMenuList.length - 1 > key && (
              <hr className="my-3" />
            )
          }
        </div>
      ))
    );
  };

  function splitMulti(str, tokens) {
    if (Array.isArray(str)) {
      return str;
    }

    str = str || '';

    var tempChar = tokens[0]; // We can use the first token as a temporary join character
    for (var i = 1; i < tokens.length; i++) {
      str = str.split(tokens[i]).join(tempChar);
    }
    str = str.split(tempChar);
    return str;
  }

  const createLinkMenu = routes => {


    routes = routes || [];
    //const claim = [];
    let childrens = [];
    let claimFilter = [];
    const parents = _.sortBy(routes.filter(p => !p.parentID && p.status == 1), p => p.sortOrder);

    // if (ACCOUNT_CLAIM) {
    //   const claim = splitMulti(ACCOUNT_CLAIM, [',', '[', ']', '"']).filter(x => x != "") || [];
    if (localStorage.getItem('ACCOUNT_CLAIM')) {
      const claim = splitMulti(localStorage.getItem('ACCOUNT_CLAIM'), [',', '[', ']', '"']).filter(x => x != "") || [];
      claim.map(x => {
        if (x.includes(".View")) {
          claimFilter.push(x);
        }
      })
    }

    return parents.map(itemParent => {

      childrens = _.sortBy(routes.filter(p => p.parentID == itemParent.id && p.status == 1), p => p.sortOrder);

      claimFilter.map(x => {
        childrens.filter(chiu => (chiu.uniqueCode + '.View' === x))
          .map(childrens => {
            childrens.sttuniqueCodeView = 1;
          })
      }
      )
      return (
        <div key={itemParent.id} className={classes.navItem}>
          <div className='wrap-navigation-item-header-item'>
            {ICON_MENUS[itemParent.uniqueCode] ? <img src={ICON_MENUS[itemParent.uniqueCode]} className='wrap-navigation-item-header-item-icon' /> : null}
            <h6 className={`navbar-heading text-muted ${classes.sessionTitle} wrap-navigation-item-header-item-title`}>{itemParent.name || ''}</h6>
          </div>
          {/* {!IS_ADMIN ? ( */}

          {!JSON.parse(localStorage.getItem('IS_ADMIN')) ? (
            childrens.filter(child => child.sttuniqueCodeView == 1)
              .map(itemChildren => {
                return (
                  <Nav navbar key={itemChildren.id}>
                    <Route path={'/trang_chu' + itemChildren.url} children={({ match }) => {
                      return (
                        <NavItem className='wrap-navigation-item-body-item'>
                          {ICON_MENUS[itemChildren.uniqueCode] ? <img src={ICON_MENUS[itemChildren.uniqueCode]} className='wrap-navigation-item-body-item-icon' /> : null}
                          <NavLink
                            to={'/trang_chu' + itemChildren.url}
                            tag={NavLinkRRD}
                            //exact="/"
                            onClick={closeCollapse}
                            activeClassName="active"
                            active={true}
                            className={`wrap-navigation-item-body-item-link ${((match || {}).isExact && itemChildren.url) ? 'link-active' : ''}`}
                          >
                            {itemChildren.name || ''}
                          </NavLink>
                        </NavItem>
                      )
                    }} />
                  </Nav>
                );
              })
          ) : (
            childrens
              .map(itemChildren => {
                return (
                  <Nav navbar key={itemChildren.id}>
                    <Route path={'/trang_chu' + itemChildren.url} children={({ match }) => {
                      return (
                        <NavItem className='wrap-navigation-item-body-item'>
                          {ICON_MENUS[itemChildren.uniqueCode] ? <img src={ICON_MENUS[itemChildren.uniqueCode]} className='wrap-navigation-item-body-item-icon' /> : null}
                          <NavLink
                            to={'/trang_chu' + itemChildren.url}
                            tag={NavLinkRRD}
                            //exact="/"
                            onClick={closeCollapse}
                            activeClassName="active"
                            active={true}
                            className={`wrap-navigation-item-body-item-link ${((match || {}).isExact && itemChildren.url) ? 'link-active' : ''}`}
                          >
                            {itemChildren.name || ''}
                          </NavLink>
                        </NavItem>
                      )
                    }} />
                  </Nav>
                );
              }))
          }
        </div>
      )

    })
  };

  const { bgColor, routes, logo } = props;

  let navbarBrandProps;
  if (logo && logo.innerLink) {
    navbarBrandProps = {
      to: logo.innerLink,
      tag: Link,
    };
  } else if (logo && logo.outterLink) {
    navbarBrandProps = {
      href: logo.outterLink,
      target: "_blank",
    };
  }

  const handleCloseApp = () => {
    deleteCookie('AUTHEN_INFO');
    window.location.href = '/';
  }

  return (
    <Navbar
      className={`navbar-vertical fixed-left navbar-light bg-white ${classes.navbarcs}`}
      expand="md"
      id="sidenav-main"
    >
      <Container fluid>
        {/* Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleCollapse}
        >
          <span className="navbar-toggler-icon" />
        </button>
        {/* Brand */}
        {logo ? (
          <NavbarBrand className={`pt-0 ${classes.logo} ${classes.desktop}`} {...navbarBrandProps}>
            <img
              alt={logo.imgAlt}
              className="navbar-brand-img"
              src={logo.imgSrc}
            />
          </NavbarBrand>
        ) : null}
        {logo ? (
          <NavbarBrand className={`pt-0 ${classes.logo} ${classes.mobile}`} {...navbarBrandProps}>
            <img
              alt={logo.imgAlt}
              className="navbar-brand-img"
              src={logo.imgSrc}
            />
          </NavbarBrand>
        ) : null}
        {/* User */}
        <Nav className="align-items-center d-md-none">
          <UncontrolledDropdown nav>
            <DropdownToggle nav className="nav-link-icon">
              <i className="ni ni-bell-55" />
            </DropdownToggle>
            <DropdownMenu
              aria-labelledby="navbar-default_dropdown_1"
              className="dropdown-menu-arrow"
              right
            >
              <DropdownItem>Action</DropdownItem>
              <DropdownItem>Another action</DropdownItem>
              <DropdownItem divider />
              <DropdownItem>Something else here</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          <UncontrolledDropdown nav>
            <DropdownToggle nav>
              <Media className="align-items-center">
                <span className="avatar avatar-sm rounded-circle">
                  {
                    // (ACCOUNT_AVA !== null && fileView !== null) ||
                    //   (ACCOUNT_AVA == null && fileView !== null) ||
                    //   (ACCOUNT_AVA !== null && fileView == null) ? (
                    //   <div id='avatar' className={`${classes.avatar} ${classes.avatarBck}`}
                    //     style={{
                    //       background: `url(${notChang == true ? (fileView == null ? NoImg : fileView) : ACCOUNT_AVA})`
                    //     }} />
                    (localStorage.getItem('ACCOUNT_AVA') !== null && fileView !== null) ||
                      (localStorage.getItem('ACCOUNT_AVA') == null && fileView !== null) ||
                      (localStorage.getItem('ACCOUNT_AVA') !== null && fileView == null) ? (
                      <div id='avatar' className={`${classes.avatar} ${classes.avatarBck}`}
                        style={{
                          background: `url(${notChang == true ? (fileView == null ? NoImg : fileView) : localStorage.getItem('ACCOUNT_AVA')})`
                        }} />
                    ) : (
                      // <i className={`ni ni-circle-08 ${classes.avatar}`} />
                      <div id='avatar' className={`${classes.avatar} ${classes.avatarBck}`}
                        style={{
                          background: `url(${NoImg})`
                        }} />
                    )
                  }
                </span>
              </Media>
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-arrow" right>
              <DropdownItem to="/" tag={Link}>
                <i className="ni ni-single-02" />
                <span>Đổi mật khẩu</span>
              </DropdownItem>
              {/* {ACCOUNT_NAME == "Administrator" ? null : ( */}
              {localStorage.getItem('ACCOUNT_NAME') == "Administrator" ? null : (
                <DropdownItem onClick={() => {
                  toggleModal('updateModal');
                  handleOpenEdit();
                }}>
                  {/* <div className={classes.updateAvaArea}>
										<div className="upload-btn-wrapper">
											<div>*/}
                  <i className={`ni ni-circle-08 ${classes.updateAva}`} />
                  <span>Đổi hình đại diện</span>
                  {/* </div>

										</div>
									</div> */}
                </DropdownItem>
              )}
              {
                details ?
                  <UpdatePopup
                    moduleTitle='Đổi hình đại diện'
                    moduleBody={
                      <ChangeAvatar
                        data={details}
                        handleNewData={handleNewDataUpdate}
                        handleCheckValidation={this.handleCheckValidation}
                        // imgAvatarView={ACCOUNT_AVA}
                        imgAvatarView={localStorage.getItem('ACCOUNT_AVA')}
                      />}
                    newData={newData}
                    updateModal={updateModal}
                    toggleModal={toggleModal}
                    activeSubmit={activeCreateSubmit}
                    handleUpdateInfoData={this.handleUpdateData}
                  />
                  : null
              }
              <DropdownItem divider />
              <DropdownItem onClick={() => handleCloseApp()}>
                <i className="ni ni-user-run" />
                <span>Đăng xuất</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
        {/* Collapse */}
        <Collapse navbar isOpen={collapseOpen}>
          {/* Collapse header */}
          <div className="navbar-collapse-header d-md-none">
            <Row>
              {logo ? (
                <Col className="collapse-brand" xs="6">
                  {logo.innerLink ? (
                    <Link to={logo.innerLink}>
                      <img alt={logo.imgAlt} src={logo.imgSrc} />
                    </Link>
                  ) : (
                    <a href={logo.outterLink}>
                      <img alt={logo.imgAlt} src={logo.imgSrc} />
                    </a>
                  )}
                </Col>
              ) : null}
              <Col className="collapse-close" xs="6">
                <button
                  className="navbar-toggler"
                  type="button"
                  onClick={toggleCollapse}
                >
                  <span />
                  <span />
                </button>
              </Col>
            </Row>
          </div>
          {/* Form */}
          <Form className="mt-4 mb-3 d-md-none">
            <InputGroup className="input-group-rounded input-group-merge">
              <Input
                aria-label="Search"
                className="form-control-rounded form-control-prepended"
                placeholder="Search"
                type="search"
              />
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <span className="fa fa-search" />
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Form>

          {/* Navigation */}
          {createLinkMenu(routes)}
          {/* Heading */}
          {/* <h6 className={`navbar-heading text-muted ${classes.sessionTitle}`}>Documentation</h6>
        
          <Nav className="mb-md-3" navbar>
            <NavItem>
              <NavLink href="https://demos.creative-tim.com/argon-dashboard-react/#/documentation/overview?ref=adr-admin-sidebar">
                <i className="ni ni-spaceship" />
                Getting started
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="https://demos.creative-tim.com/argon-dashboard-react/#/documentation/colors?ref=adr-admin-sidebar">
                <i className="ni ni-palette" />
                Foundation
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="https://demos.creative-tim.com/argon-dashboard-react/#/documentation/alerts?ref=adr-admin-sidebar">
                <i className="ni ni-ui-04" />
                Components
              </NavLink>
            </NavItem>
          </Nav> */}
        </Collapse>
      </Container>
    </Navbar>
  );
};

Sidebar.defaultProps = {
  routes: [{}],
};

Sidebar.propTypes = {
  // links that will be displayed inside the component
  routes: PropTypes.arrayOf(PropTypes.object),
  logo: PropTypes.shape({
    // innerLink is for links that will direct the user within the app
    // it will be rendered as <Link to="...">...</Link> tag
    innerLink: PropTypes.string,
    // outterLink is for links that will direct the user outside the app
    // it will be rendered as simple <a href="...">...</a> tag
    outterLink: PropTypes.string,
    // the image src of the logo
    imgSrc: PropTypes.string.isRequired,
    // the alt for the img
    imgAlt: PropTypes.string.isRequired,
  }),
};

export default Sidebar;
