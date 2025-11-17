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
import React from "react";
import { useLocation, Route, Switch } from "react-router-dom";
// reactstrap components
import { Container } from "reactstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import compose from 'recompose/compose';
// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import AdminFooter from "components/Footers/AdminFooter.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import { AlertContext, alertContext, MenuContext, menuContext } from "../helpers/common";
import classes from './index.module.css';
import routes, { routeComponents } from "routes.js";

import { actionMenuCreators } from "../actions/ConfigAction";
import { actionCreators } from "../actions/AuthenActions";

import "../assets/css/control/message.css";
import Message from '../components/message';
import Loading from '../components/loading';

import { NoMatch } from "../helpers/common";
// import "../assets/css/global/theme.css";
// import "../assets/css/global/index.css";

import { getRefreshToken } from "../views/pages/Login";
import { VARIABLES } from "../helpers/constant";
import { PLEASE_CHECK_CONNECT, BASE_URL, CLIENT_ID, CLIENT_SECRET, SCOPE, GRANT_TYPE, USER, DOMAIN, API } from "../services/Common";
import axios from 'axios';
import qs from 'qs';
import { deleteCookie, getCookie, setCookie } from "../helpers/cookie.js";
import { MENU_DATA } from "mockData/menuData";



const currentUser = JSON.parse(getCookie('AUTHEN_INFO') || '{}');

const timeRefesh = ((currentUser.expires * 1000) - 2000);

const Admin = (props) => {
  const mainContent = React.useRef(null);
  const location = useLocation();

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);


  React.useEffect(() => {

    // getRefreshToken(actionCreators.userLogin, actionCreators.loginSuccess).then(async result => {
    //   // VARIABLES.isFechingAlert = true;

    //   // if (result) {
    //   //   return await get(url);
    //   // } else {
    //   //   deleteCookie('AUTHEN_INFO');
    //   //   window.location.href = '/';
    //   // }

    //   console.log(result);
    //   console.log('has Refhes');

    // });
    const getRefreshToken = () => {

      return new Promise(async (resolve, reject) => {

        //const currentUser = JSON.parse(getCookie('AUTHEN_INFO') || '{}');
        const currentUser = JSON.parse(getCookie('AUTHEN_INFO') || '{}');

        const refreshToken = currentUser.refreshToken;

        if (!refreshToken) {
          return resolve(false);
        }

        const axiosConfig = {
          baseURL: BASE_URL,
          timeout: 30000,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        };

        const requestData = {
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          grant_type: GRANT_TYPE,
          refresh_token: refreshToken,
          scope: SCOPE,
        };

        try {
          await axios.post('/connect/token', qs.stringify(requestData), axiosConfig).then(async result => {
            let key = null;
            if (result.status == 200) {
              key = await axios.get(DOMAIN + API + USER + 'info', {
                headers: {
                  authorization: 'Bearer ' + result.data.access_token
                }
              });

              const data = key.data.data.token || {};
              data.token = result.data.access_token;
              data.expires = result.data.expires_in;
              data.refreshToken = result.data.refresh_token;

              if (localStorage.getItem('TOKEN') != null) {
                deleteCookie('AUTHEN_INFO');
              }

              setCookie('AUTHEN_INFO', JSON.stringify(data));

            } else {
              alert('Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại!');
              deleteCookie('AUTHEN_INFO');
              window.location.href = '/';
            }
          })
        } catch (error) {
          alert('Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại!');
          deleteCookie('AUTHEN_INFO');
          window.location.href = '/';
        }
      });
    }

    const refresh = setInterval(() => {
      getRefreshToken();
    }, timeRefesh);

    return () => clearInterval(refresh);
  }, [])

  React.useEffect(() => {
    const { getMenu } = props;
    var listMenu = [];

    if (getMenu) {
      getMenu().then(res => {

        if (res.data.data.length > 0) {

          res.data.data.map(item => {
            listMenu.push(item)
          })
          if (listMenu.length > 0) {
            localStorage.setItem('LISTMENU', JSON.stringify(listMenu))
          }
        }
      })
    }



  }, []);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/trang_chu") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };

  // const getRoutesNavigation = routes => {

  //   const arrayRoute = [];

  //   let route = null;

  //   const routeExcludes = routeComponents.filter(p => (routes || []).filter(m => m.uniqueCode == p.key).length <= 0);

  //   routeExcludes.map((item, index) => {
  //     arrayRoute.push(
  //       <Route
  //         path={item.layout + item.url}
  //         component={item.component}
  //         key={index}
  //       />
  //     );
  //   });

  //   routes.map(item => {
  //     route = routeComponents.find(p => p.key && p.key == item.uniqueCode);

  //     if (route) {

  //       arrayRoute.push(
  //         <Route
  //           path={route.layout + item.url}
  //           component={route.component}
  //           key={item.id}
  //         />
  //       );
  //     }
  //   });

  //   return arrayRoute;
  // };

  const getRoutesFromMenuData = (menuData) => {
    const arrayRoute = [];

    const routeExcludes = routeComponents.filter(
      rc => menuData.filter(md => md.uniqueCode === rc.key).length === 0
    );

    routeExcludes.forEach((item, index) => {
      arrayRoute.push(
        <Route
          path={item.layout + item.url}
          component={item.component}
          key={`exclude-${index}`}
        />
      );
    });

    menuData.forEach(item => {
      const route = routeComponents.find(rc => rc.key && rc.key === item.uniqueCode);
      if (route) {
        arrayRoute.push(
          <Route
            path={route.layout + item.url}
            component={route.component}
            key={item.id}
          />
        );
      }
    });

    return arrayRoute;
  };

  const getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (
        props.location.pathname.indexOf(routes[i].layout + routes[i].path) !== -1
      ) {
        return routes[i].name;
      }
    }
    // return "Brand";
    return;
  };

  const menus = (props.configState || {}).menus || [];

  return (
    // ThangContext
    // <AlertContext.Provider value={alertContext} >
    // 	<MenuContext.Provider value={menuContext}>
    // 		<Sidebar
    // 			{...props}
    // 			routes={menus}
    // 			logo={{
    // 				innerLink: "/trang_chu/dashboard",
    // 				imgSrc: require("../assets/img/brand/logo.png").default,
    // 				imgAlt: "...",
    // 			}}
    // 		/>
    // 		<div className="main-content" ref={mainContent}>
    // 			<AdminNavbar
    // 				{...props}
    // 				brandText={getBrandText(props.location.pathname)}
    // 			/>

    // 			<Switch>
    // 				{getRoutesNavigation(menus)}
    // 				{/* {getRoutes(routes)} */}
    // 				{/* <Redirect from="*" to="/trang_chu/dashboard" /> */}
    // 				<Route exact path="/" />
    // 				<Route path="*">
    // 					<NoMatch />
    // 				</Route>
    // 			</Switch>
    // 			{/* ---? Page Name? ----- */}
    // 			<MenuContext.Consumer>
    // 				{value => value.data = getBrandText(props.location.pathname)}
    // 			</MenuContext.Consumer>

    // 			<AlertContext.Consumer>{value => props.children}</AlertContext.Consumer>

    // 			<div className={classes.footerArea}>
    // 				<AdminFooter />
    // 			</div>
    // 			<Loading ref={ref => Loading.setRef(ref)} />
    // 			<Message ref={ref => Message.setRef(ref)} />
    // 		</div>
    // 	</MenuContext.Provider>
    // </AlertContext.Provider >
    <>
      <Sidebar
        {...props}
        routes={menus}
        logo={{
          innerLink: "/trang_chu/dashboard",
          //imgSrc: require("../assets/img/brand/logo.png").default,
          //Node18
          imgSrc: require("../assets/img/brand/logo.png"),
          imgAlt: "...",
        }}
      />
      <AlertContext.Provider value={alertContext}>
        <MenuContext.Provider value={menuContext}>
          <div className="main-content" ref={mainContent}>
            <AdminNavbar
              {...props}
              brandText={getBrandText(props.location.pathname)}
            />

            <Switch>
              {/* {getRoutesNavigation(menus)} */}
              {getRoutesFromMenuData(MENU_DATA)}
              {/* {getRoutes(routes)} */}
              {/* <Redirect from="*" to="/trang_chu/dashboard" /> */}
              <Route exact path="/" />
              <Route path="*">
                <NoMatch />
              </Route>
            </Switch>
            {/* ---? Page Name? ----- */}
            <div style={{ display: 'none' }}>
              <MenuContext.Consumer>
                {value => value.data = getBrandText(props.location.pathname)}
              </MenuContext.Consumer>
            </div>
            <AlertContext.Consumer>{value => props.children}</AlertContext.Consumer>

            <div className={classes.footerArea}>
              <AdminFooter />
            </div>
            <Loading ref={ref => Loading.setRef(ref)} />
            <Message ref={ref => Message.setRef(ref)} />
          </div>
        </MenuContext.Provider>
      </AlertContext.Provider>
    </>
  );
};

const mapStateToProps = states => {
  return {
    configState: states.ConfigStore,
    account: states.AuthenStore
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(actionMenuCreators, dispatch),
    ...bindActionCreators(actionCreators, dispatch)
  }
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Admin);