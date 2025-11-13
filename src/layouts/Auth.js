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
import { useLocation, Route, Switch, Redirect } from "react-router-dom";
// reactstrap components
import { Container, Row, Col } from "reactstrap";

import { AlertContext, alertContext } from "../helpers/common";

// core components
import AuthNavbar from "components/Navbars/AuthNavbar.js";
import AuthFooter from "components/Footers/AuthFooter.js";

import "../assets/css/global/theme.css";
import "../assets/css/global/index.css";

import Loading from '../components/loading';
import Message from '../components/message';
import { NoMatch } from "../helpers/common";
import routes from "routes.js";

const Auth = (props) => {
	const mainContent = React.useRef(null);
	const location = useLocation();

	React.useEffect(() => {
		document.body.classList.add("bg-default-Login-cs");
		return () => {
			document.body.classList.remove("bg-default-Login-cs");
		};
	}, []);

	

	React.useEffect(() => {
		document.documentElement.scrollTop = 0;
		document.scrollingElement.scrollTop = 0;
		mainContent.current.scrollTop = 0;
	}, [location]);

	const getRoutes = (routes) => {
		return routes.map((prop, key) => {
			if (prop.layout === "/nguoi_dung") {
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

	return (
		<AlertContext.Provider value={alertContext}>
			<div className="main-content" ref={mainContent}>
				{/* <AuthNavbar /> */}
				{/* <div className="header bg-gradient-info py-7 py-lg-8"> */}
				{/* Page content */}
				<div className="mt-8 pb-5">
					<Row className="justify-content-center" style={{ margin: 0 }}>
						<Switch>
							{getRoutes(routes)}
							<Route exact path="/" />
							<Route path="*">
								<NoMatch />
							</Route>
						</Switch>
						<AlertContext.Consumer>{value => (
							props.children
						)}</AlertContext.Consumer>
					</Row>
				</div>
				{/* <Loading ref={ref => Loading.setRef(ref)} />
        <Message ref={ref => Message.setRef(ref)} /> */}
				<Message ref={ref => Message.setRef(ref)} />
			</div>
		</AlertContext.Provider>
	);
};

export default Auth;
