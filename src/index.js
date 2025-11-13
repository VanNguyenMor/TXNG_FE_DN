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
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { ConnectedRouter } from "react-router-redux";
import { createBrowserHistory } from "history";
import ConfigureStore from "./store/ConfigureStore";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import registerServiceWorker from "./registerServiceWorker";
// import { localStorage.getItem('TOKEN') } from "./services/Common";

import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";

import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";
import ResetPassword from "views/pages/ResetPassword";
//import { createRoot } from 'react-dom/client';
//import './interceptors/axios';
import "./helpers/cookie";


if (process.env.NODE_ENV === 'production') {
  console.log = () => { }
  console.error = () => { }
  console.debug = () => { }
}
// Create browser history to use in the Redux store
const baseUrl = document.getElementsByTagName("base")[0].getAttribute("href");
const history = createBrowserHistory({ basename: baseUrl });

// Get the application-wide store instance, prepopulating with state from the server where available.
const initialState = window.initialReduxState;
const store = ConfigureStore(history, initialState);

//Node18
const rootElement = document.getElementById("root");
//const rootElement = createRoot(document.getElementById("root"));



//Node18
ReactDOM.render(
//rootElement.render(
  <React.Fragment>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <BrowserRouter>
          <Switch>
            {
              localStorage.getItem('TOKEN') ? (
                <Route path="/trang_chu" component={AdminLayout} />
              ) : (
                <Route path="/nguoi_dung" render={(props) => <AuthLayout {...props} />} />
              )
            }
            {
              localStorage.getItem('TOKEN') ?
                <Redirect from="*" to="/trang_chu/dashboard" />
                : <Redirect from="*" to="/nguoi_dung/login" />
            }
            {/* <Route path="/trang_chu" component={AdminLayout} />
            <Route path="/nguoi_dung" render={(props) => <AuthLayout {...props} />} />
            <Redirect from="*" to="/trang_chu/dashboard" />
            <Redirect from="*" to="/nguoi_dung/login" /> */}
          </Switch>
        </BrowserRouter>
      </ConnectedRouter>
    </Provider>
  </React.Fragment>,

  //Node18
  rootElement
);

registerServiceWorker();
// ReactDOM.render(
//   <React.Fragment>
//     <Provider store={store}>
//       <ConnectedRouter history={history}>
//         <BrowserRouter>
//           <Switch>
//             { 
//               localStorage.getItem('TOKEN') ? (
//                 <Route path="/trang_chu" component={AdminLayout} />
//               ) : (
//                 <Route path="/nguoi_dung" render={(props) => <AuthLayout {...props} />} />
//               )
//             }

//             {
//               localStorage.getItem('TOKEN') ? <Redirect from="*" to="/trang_chu/dashboard" />
//               : <Redirect from="*" to="/nguoi_dung/login" />
//             }

//           </Switch>
//         </BrowserRouter>
//       </ConnectedRouter>
//     </Provider>
//   </React.Fragment>,
//   rootElement
// );