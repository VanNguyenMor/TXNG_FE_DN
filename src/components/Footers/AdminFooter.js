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

// reactstrap components
import { Container, Row, Col, Nav, NavItem, NavLink } from "reactstrap";
import classes from './index.module.css';

const Footer = () => {
  return (
    <footer className={`footer ${classes.footerArea}`}>
      <div className="align-items-center">
        <div>
          <div className="copyright text-center text-xl-left text-muted">
            Developer by
            <a
              className="font-weight-bold ml-1"
              href="/"
              rel="noopener noreferrer"
              target="_blank"
            >
              TRACECENTER
            </a>

            <span> © {new Date().getFullYear()}{" "} . LACOGROUP. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
