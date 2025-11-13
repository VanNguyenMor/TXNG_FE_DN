import { map } from "lodash";
import React, { Component } from "react";
import classes from './index.module.css';
import './SelectTree.css'

class SelectTree extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      value: null,
      currentArray: []
    };

    this.ref = null;
  }

  handleOpen = () => {
    const { handleOpenSelectTree } = this.props;
    let { open } = this.state;

    handleOpenSelectTree(!open);
    this.setState({ open: !open });
  }

  handleSelect = (event) => {
    const { handleChange, name, id } = this.props;
    const ev = event.target;

    let value = ev.value;

    this.setState({ value: value });

    // Handle Changge Custom
    if (typeof (handleChange) !== 'undefined') {
      handleChange(value, name);
    }
  }

  renderTreeLine = (nodelv) => {
    let line = '-';

    for (let i = 0; i < nodelv; i++) {
      // line = `${line.repeat(2)}`;
      line = line + '--'
    }

    return line;
  }

  renderTreeSelect = (data, currentArray, labelName, val, disableParent, dataAll) => {
    const { beginItem, endItem } = this.state;
    const { selected, fieldName } = this.props;
    let list = [];
    let parentid = [];
    let autoIndex = 0;
    let isDisable = true;

    data.filter((item, key) => key >= beginItem && key < endItem);
    data.forEach(e => parentid.push(e.id));

    let dataAll1;
    if (dataAll == "undefined" || dataAll == null || dataAll == "") {
      dataAll1 = ""
    } else {
      dataAll1 = dataAll.filter(x => dataAll.find(y => y.parentID === x.id))
    }

    const cb = (e, key, array) => {

      const renderClass = e.parentID.length === 0 ? (
        `${classes.treeParent}`
      ) : (
        `${classes.treeChild}${parentid.includes(e.parentID) ? ` ${classes.childs}` : ` ${classes.childsItem}`}`
      );

      if (disableParent == true) {
        list.push(
          typeof (labelName) === 'undefined' ? (
            <option
              key={autoIndex}
              parentid={e.parentID}
              currentid={e.id} index={autoIndex}
              className={classes.items}
              disabled={e.parentID == "" || dataAll1.find(x => x.id === e.id) ? isDisable : null}
              //disabled={e.parentID == "" ? isDisable : null}
              // label={e} 
              value={e}
              selected={selected === e ? true : false}
              style={currentArray.find(p => p.value == e.id) ? { backgroundColor: 'rgba(0, 0, 0, 0.1)' } : {}}
            >
              {e.nodelv > 1 && this.renderTreeLine(e.nodelv)}
              {e}
            </option>
          ) : (
            <option
              key={autoIndex}
              parentid={e.parentID}
              currentid={e.id} index={autoIndex}
              className={classes.items}
              disabled={e.parentID == "" || dataAll1.find(x => x.id === e.id) ? isDisable : null}
              //disabled={e.parentID == "" ? isDisable : null}
              // label={e[labelName]} 
              value={e[val]}
              selected={selected === e[val] ? true : false}
              style={currentArray.find(p => p.value == e.id) ? { backgroundColor: 'rgba(0, 0, 0, 0.1)' } : {}}>
              {e.nodelv > 1 && this.renderTreeLine(e.nodelv)}
              {e[fieldName]}
            </option>
          )
        );
      }
      else {
        list.push(
          typeof (labelName) === 'undefined' ? (

            <option
              key={autoIndex}
              parentid={e.parentID}
              currentid={e.id} index={autoIndex}
              className={classes.items}
              //disabled={e.parentID == "" ? isDisable : null}
              // label={e} 
              value={e}
              selected={selected === e ? true : false}
              style={currentArray.find(p => p.value == e.id) ? { backgroundColor: 'rgba(0, 0, 0, 0.1)' } : {}}
            >
              {e.nodelv > 1 && this.renderTreeLine(e.nodelv)}
              {e}
            </option>
          ) : (
            <option
              key={autoIndex}
              parentid={e.parentID}
              currentid={e.id} index={autoIndex}
              className={classes.items}
              //disabled={e.parentID == "" ? isDisable : null}
              // label={e[labelName]} 
              value={e[val]}
              selected={selected === e[val] ? true : false}
              style={currentArray.find(p => p.value == e.id) ? { backgroundColor: 'rgba(0, 0, 0, 0.1)' } : {}}>
              {e.nodelv > 1 && this.renderTreeLine(e.nodelv)}
              {e[fieldName]}
            </option>
          )
        );
      }


      autoIndex++;
      e.children && e.children.forEach(cb);
    }

    data.forEach(cb);
    return list;
  }

  render() {
    const { title, data, labelName, val, name, isHideSelectAll, id, hidenTitle, disableParent, dataAll } = this.props;
    const { currentArray, open, value } = this.state;

    return (
      <select ref={ref => this.ref = ref} id={id} className={`${classes.select} css-select-height-button`} onChange={(event) => { this.handleSelect(event) }} >
        {hidenTitle == true ? (
          null
        ) : (<option value="" selected className={classes.selectHeader}>{`--- ${title} ---`}</option>)}
        {/* <option className={classes.selectHeader} value="">
          Tất cả
        </option> */}

        {
          Array.isArray(data) && (
            this.renderTreeSelect(data, currentArray, labelName, val, disableParent, dataAll)
          )
        }
      </select>
    );
  }
};

export default SelectTree;

