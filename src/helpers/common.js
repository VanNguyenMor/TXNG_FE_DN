/* Props fake in context */
import React from "react";
import AlertComp from "../components/AlertComp";
import { useLocation } from "react-router-dom";
import moment from "moment";

export const alertContext = { status: null, message: '' };
export let AlertContext = React.createContext(alertContext);
export const menuContext = { data: null };
export let MenuContext = React.createContext(menuContext);

/**
 * Set Alert Context
 * @param {*} val: message, code 
 */
export function setAlertContext(val) {
  AlertContext = React.createContext(val);
}

/**
 * Open Alert Context
 * @param {*} val: message, code 
 */
export function openAlertContext(val) {
  return null;
  return (
    <AlertContext.Consumer>
      {value => (
        value.status !== null && <AlertComp value={val} />
      )}
    </AlertContext.Consumer>
  );
}

/**
 * Set Menu Info Context
 * @param {*} val: acccount value
 */
export function setMenuInfoContext(val) {
  return (
    <MenuContext.Consumer>
      {value => value.data = val.data}
    </MenuContext.Consumer>
  );
}

/**
 * isTrue: Value of Boolean
 * @param {*} value: value by string 
 */
export function isTrue(value) {
  return value === 'true' ? true : false;
}

export function handleCurrencyFormat(number) {
  return new Intl.NumberFormat('de-DE').format(number);
}

/**
 * Remove Duplicates list array
 * @param {*} data: list 
 * @param {*} key: key in list 
 * @returns 
 */
export function removeDuplicates(data, key) {
  return [
    ...new Map(data.map(item => [key(item), item])).values()
  ]
};

export function getUnique(array, key) {
  if (typeof key !== 'function') {
    const property = key;
    key = function (item) { return item[property]; };
  }
  return Array.from(array.reduce(function (map, item) {
    const k = key(item);
    if (!map.has(k)) map.set(k, item);
    return map;
  }, new Map()).values());
}

/**
 * addDays: Add more day
 * @param {*} date: date
 * @param {*} days: days want to add 
 * @returns 
 */
export function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * NoMatch: No Match Page
 * @returns 
 */
export function NoMatch() {
  let location = useLocation();

  return (
    <div style={{ margin: 15 }}>
      <h3>
        Không tìm thấy <code>{location.pathname}</code>
      </h3>
    </div>
  );
}

export function getCurrentDatetimeStringForFile() {
  const currentDateTime = moment();

  return currentDateTime.format('DDMMYYYYHHmmss');
}

export function fakeDownloadLinkFile(pathFile, fileName) {
  const a = document.createElement('a');

  a.href = pathFile;
  a.target = '_parent';
  a.setAttribute('download', fileName);
  a.click();

  a.remove();
}