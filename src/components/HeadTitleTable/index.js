import React, { Component } from "react";
import classes from './index.module.css';

class HeadTitleTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    const { headerTitle, hideEdit, classHeaderColumns, reSize, reSizeName } = this.props;
    const _classHeaderColumns = classHeaderColumns || [];

    return (
      <>
        <thead className="thead-dark">
          <tr>
            {
              headerTitle.map((item, key) => (
                item.indexOf('Stt') > -1 ?
                  <th scope="col" key={key} className={`${classes.indexTitle} ${_classHeaderColumns[key] || ''} font-bold font-size-15px`}>{item}</th>
                  : (reSize && item.indexOf(reSizeName) > -1 ?
                    <th scope="col" key={key} style={{ whiteSpace: 'normal', width: reSize }} className={`${_classHeaderColumns[key] || ''} font-bold font-size-15px`}>{item}</th>
                    : <th scope="col" key={key} style={{ whiteSpace: 'normal' }} className={`${_classHeaderColumns[key] || ''} font-bold font-size-15px`}>{item}</th>)
              ))
            }
            {
              typeof (hideEdit) !== 'undefined' ? (
                !hideEdit && (
                  <th scope="col" className={`${classes.editHeaderArea} ${_classHeaderColumns['edit'] || ''} font-bold font-size-15px`}></th>
                )
              ) : (
                <th scope="col" className={`${classes.editHeaderArea} ${_classHeaderColumns['other'] || ''} font-bold font-size-15px`}></th>
              )
            }
          </tr>
        </thead>
      </>
    );
  }
};

export default HeadTitleTable;
