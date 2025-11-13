import React from "react";
import { removeDuplicates } from "./common";

/**
 * handleGenTree: Handle Gen Tree
 * @param {*} arrays: array list 
 * @paran {*} arrays: field name of child tree
 * @returns: return tree array 
 */
export function handleGenTree(arrays, fieldName, int) {

	let res = [];
	let resNew = [];

	const cb = (e, key) => {
		res.push({ id: e.id, parentID: e.parentID, [fieldName]: e[fieldName], ...e, key: key });
	}
	// debugger
	arrays.forEach(cb);

	resNew = handleGenArray(res, int);

	return resNew;
}

/**
 * handleGenArray: Handle Gen Array - Have parent - child
 * @param {*} resS 
 * @returns 
 */
export function handleGenArray(resS, int) {
	let childrenArr = [];
	let newArr = [];
	let nodeLv = 0;
	if (int) {
		resS.forEach((value, key, map) => {
			if (value.parentID == 0 || value.parentID == null) { value.parentID = "" }
			if (value.parentID !== null) {

				if (value.parentID.length === 0) {

					newArr.push({ ...value, children: [], nodelv: nodeLv });
				} else {
					childrenArr.push({ ...value, children: [], nodelv: null });
				}
			}

		});
	} else {
		resS.forEach((value, key, map) => {
			if (value.parentID == 0 || value.parentID == null) { value.parentID = "" }
			if (value.parentID !== null) {
				if (value.parentID.length === 0) {
					// debugger
					newArr.push({ ...value, children: [], nodelv: nodeLv });
				} else {
					childrenArr.push({ ...value, children: [], nodelv: null });
				}
			}

		});
	}



	handleGenChildrenArray(childrenArr, newArr, nodeLv);
	return newArr;
}

/**
 * handleGenChildrenArray: Handle Gen Tree Of Children Array
 * @param {*} childrenArr: children array 
 * @param {*} newArr: update array have children all level 
 */
export function handleGenChildrenArray(childrenArr, newArr, nodeLv) {
	let arr = [];

	if (Array.isArray(newArr)) {
		newArr.forEach((value, key, map) => {
			value.nodelv = nodeLv + 1;
			childrenArr.forEach((val, key, map) => {
				if (value.id === val.parentID) {
					value.children.push(val);
					value.children = removeDuplicates(value.children, item => item.id);
					handleGenChildrenArray(childrenArr, value.children, value.nodelv);
				}
			});
		});
	}
}

/**
 * renderTreeView: Render Tree View Basic
 * @param {*} data: Array (Have tree view) 
 * @returns: return view tree 
 */
export function renderTreeView(data, fieldName) {
	const { classes } = this.props;
	let list = [];
	let parentid = [];

	data.forEach(e => parentid.push(e.id));

	const cb = (e, key, map) => {
		list.push(
			<div
				key={key}
				index={e.id}
				parentID={e.parentID}
				className={e.parentID.length === 0 ?
					classes.treeParent : `${classes.treeChild}${parentid.includes(e.parentID) ? ' childs' : ' childs-item'}`}
			>
				{e[fieldName]}
			</div>
		);
		e.children && e.children.forEach(cb);
	}

	data.forEach(cb);

	return (
		<div>{list}</div>
	);
}