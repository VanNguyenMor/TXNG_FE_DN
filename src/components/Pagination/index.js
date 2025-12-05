import React, { Component } from "react";
import classes from './index.module.css';
import ReactPaginate from 'react-paginate';
import { LIMIT_ITEM_IN_PAGE } from "../../helpers/constant";

class Pagination extends Component {
  constructor(props) {
    super(props);

    this.state = {
      limit: LIMIT_ITEM_IN_PAGE,
      beginItem: 0,
      endItem: LIMIT_ITEM_IN_PAGE,
      currentPage: props.currentPage || 0,
    };
  }

  componentDidUpdate(prevProps) {
    // Sync currentPage from parent when it changes (e.g., on data reload)
    if (prevProps.currentPage !== this.props.currentPage) {
      this.setState({ currentPage: this.props.currentPage || 0 });
    }
  }

  render() {
    const { data, listLength, totalPage, handlePageClick, totalElement, currentPage } = this.props;
    const { currentPage: stateCurrentPage } = this.state;

    return (
      <>
        {
            // Page of Table
            Array.isArray(data) && (
                <div className={classes.pageBoxArea}>
                  <p>{'Hiển thị '}{ totalElement }{' trên '}{ listLength }</p>

                  <ReactPaginate
                    previousLabel={'<'}
                    nextLabel={'>'}
                    breakLabel={'...'}
                    // breakClassName={'break-me'}
                    pageCount={totalPage}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageClick}
                    containerClassName={classes.pageArea}
                    pageClassName={classes.pageItem}
                    nextClassName={classes.pageItem}
                    previousClassName={classes.pageItem}
                    activeClassName={classes.pageActiveItem}
                    breakClassName={classes.breakPageItem}
                    forcePage={currentPage !== undefined ? currentPage : stateCurrentPage}
                  />
                </div>
            )
        }
      </>
    );
  }
};

export default Pagination;
