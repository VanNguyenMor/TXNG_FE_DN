import React, { Component } from "react";
import { MenuContext, menuContext } from "../../helpers/common";
import classes from './index.module.css';
import custom from './custom.css';
import SaveIcon from "../../assets/img/buttons/apply.svg";
import SearchImg from "../../assets/img/buttons/searchig.svg";
import PlusImg from "../../assets/img/buttons/plus.svg";
import ApplyImg from "../../assets/img/buttons/apply.svg";
import ExitImg from "../../assets/img/buttons/exit.svg";

// reactstrap components
import {
  Button,
  Fade
} from "reactstrap";

class HeaderTableCustom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fadeIn: false
    };
  }

  handleSearchButton = () => {
    let { fadeIn } = this.state;

    this.setState({ fadeIn: !fadeIn });
  }

  toggleModal = (state, type) => {
    const { isPreventForm, closeForm } = this.props;

    if (type != 1 && isPreventForm && this.state[state]) {

    } else {
      if (closeForm) {
        closeForm();
      }

      this.setState({
        [state]: !this.state[state]
      });
    }
  };

  render() {
    const { fadeIn } = this.state;
    const {
      hideSearch,
      searchForm,
      handleSubmitSearchForm,
      customComponent
    } = this.props;

    return (
      <>
        {/* Header */}
        <div className={classes.headerTable}>
          {/*  Name page */}
          <MenuContext.Consumer>
            {value => (
              <p className={`${classes.pageName} text-primary`}>{value.data}</p>
            )}
          </MenuContext.Consumer>

          <div className={classes.mainFunc}>
            {
              typeof (customComponent) !== 'undefined' && customComponent
            }

            {
              typeof (hideSearch) !== 'undefined' ? (
                !hideSearch && (
                  <div className={classes.searchArea}>
                    <Button className={`btn-warning-cs`} color="default" type="button" onClick={() => this.handleSearchButton()}>
                      <img src={SearchImg} alt='Tìm kiếm' />
                      <span>Tìm kiếm</span>
                    </Button>

                    {
                      fadeIn && (
                        <Fade in={fadeIn} tag="div" className={classes.searchBox}>
                          <div>
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
                          </div>
                        </Fade>
                      )
                    }
                  </div>
                )
              ) : (
                <div className={classes.searchArea}>
                  <Button className={`btn-warning-cs`} color="default" type="button" onClick={() => this.handleSearchButton()}>
                    <img src={SearchImg} alt='Tìm kiếm' />
                    <span>Tìm kiếm</span>
                  </Button>

                  {
                    fadeIn && (
                      <Fade in={fadeIn} tag="div" className={classes.searchBox}>
                        <div>
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
                        </div>
                      </Fade>
                    )
                  }
                </div>
              )
            }
          </div>
        </div>
      </>
    );
  }
};

export default HeaderTableCustom;
