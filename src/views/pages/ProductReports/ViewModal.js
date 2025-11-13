import React, { Component } from "react";
import Select from "components/Select";
import classes from './index.module.css';
import Validate from "react-validate-form";
import { rules, validations } from "../../../helpers/validation";
import moment from 'moment';
import { handleCurrencyFormat } from "../../../helpers/common";
import 'react-slideshow-image/dist/styles.css'
import { Zoom } from 'react-slideshow-image';
import HeadTitleTable from "components/HeadTitleTable";
import { generateStyleTableCol } from '../../../bases/controls/helper';
import { LIMIT_ITEM_IN_PAGE, LOADING_TIME, COMPANY_REPORTS_PLANNING } from "../../../helpers/constant";
import Pagination from "components/Pagination";
import HeaderTable from "components/HeaderTable";

// reactstrap components
import {
    Table,
    Card,
} from "reactstrap";

class ViewModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: null,
            headerTitle: COMPANY_REPORTS_PLANNING,
            totalElement: 0,
            listLength: 0,
            currentPage: 0,
            limit: 10,
            beginItem: 0,
            endItem: 10
        }
    }

    componentDidMount() {
        const {
            listLength,
            totalPage,
            listGetAreaOuterPlanning,
            listGetAreaPlanning,
        } = this.props;
        if (listGetAreaOuterPlanning) {
            this.setState({ data: listGetAreaOuterPlanning })
        }
        if (listGetAreaPlanning) {
            this.setState({ data: listGetAreaPlanning })
        }
        this.setState({ listLength, totalPage })
    }

    handlePageClick = (data) => {
        const { listGetAreaPlanning, listGetAreaOuterPlanning } = this.props;
        let { limit, beginItem, endItem } = this.state;
        let selected = data.selected;
        
        let offset = Math.ceil(selected * limit);
        let total = 0;

        beginItem = offset;
        endItem = offset + limit;

        if (listGetAreaPlanning) {
            listGetAreaPlanning.map((item, key) => (
                key >= beginItem && key < endItem && total++
            ));
        }
        if (listGetAreaOuterPlanning) {
            listGetAreaOuterPlanning.map((item, key) => (
                key >= beginItem && key < endItem && total++
            ));
        }

        if (selected > 0) {
            total = (selected * limit) + total;
        } else total = total;

        this.setState({
            beginItem: beginItem,
            endItem: endItem,
            currentPage: selected + 1,
            totalElement: total
        });
    };

    render() {
        const {
            listGetAreaOuterPlanning,
            listGetAreaPlanning,
            outerPlanningArea,
            planningArea,
            listLength,
            totalPage,
            totalElement
        } = this.props;
        const { headerTitle } = this.state;
        return (
            <>

                <div style={{ color: '#000' }}><b>Tổng cộng: {listGetAreaPlanning ? planningArea : outerPlanningArea} doanh nghiệp/cá nhân</b></div>

                <Card className="shadow">
                    <Table className="align-items-center tablecs" responsive>
                        <HeadTitleTable
                            headerTitle={headerTitle}
                            hideEdit
                            classHeaderColumns={{
                                0: 'table-scale-col table-user-col-1'
                            }}
                        />
                        {listGetAreaPlanning ? (
                            <tbody ref={ref => this.tableBody = ref}>
                                {
                                    Array.isArray(listGetAreaPlanning) && (
                                        listGetAreaPlanning
                                            // .filter((item, key) => key >= beginItem && key < endItem)
                                            .map((item, key) => (
                                                <tr key={key} style={{ ...generateStyleTableCol(this.tableBody, (listGetAreaPlanning || []).length) }}>
                                                    <td>{key + 1}</td>
                                                    <td>{item.CompanyName}</td>
                                                    <td>{item.TaxCode}</td>
                                                    <td>{item.PhoneNumber}</td>
                                                </tr>
                                            ))
                                    )
                                }
                            </tbody>
                        ) : null}

                        {listGetAreaOuterPlanning ? (
                            <tbody ref={ref => this.tableBody = ref}>
                                {
                                    Array.isArray(listGetAreaOuterPlanning) && (
                                        listGetAreaOuterPlanning
                                            // .filter((item, key) => key >= beginItem && key < endItem)
                                            .map(
                                                (item, key) => (
                                                    <tr key={key} style={{ ...generateStyleTableCol(this.tableBody, (listGetAreaOuterPlanning || []).length) }}>
                                                        <td>{key + 1}</td>
                                                        <td>{item.CompanyName}</td>
                                                        <td>{item.TaxCode}</td>
                                                        <td>{item.PhoneNumber}</td>
                                                    </tr>
                                                )
                                            )
                                    )
                                }
                            </tbody>
                        ) : null}
                    </Table>
                    {listGetAreaPlanning ? (
                        // Page of Table
                        Array.isArray(listGetAreaPlanning) && (
                            listGetAreaPlanning.length > 0 && (
                                <Pagination
                                    data={listGetAreaPlanning}
                                    listLength={listLength}
                                    totalPage={totalPage}
                                    totalElement={totalElement}
                                    handlePageClick={this.handlePageClick}
                                />
                            )
                        )
                    ) : null
                    }
                    {listGetAreaOuterPlanning ? (
                        // Page of Table
                        Array.isArray(listGetAreaOuterPlanning) && (
                            listGetAreaOuterPlanning.length > 0 && (
                                <Pagination
                                    data={listGetAreaOuterPlanning}
                                    listLength={listLength}
                                    totalPage={totalPage}
                                    totalElement={totalElement}
                                    handlePageClick={this.handlePageClick}
                                />
                            )
                        )
                    ) : null
                    }
                </Card>
            </>
        );
    }
};

export default ViewModal;
