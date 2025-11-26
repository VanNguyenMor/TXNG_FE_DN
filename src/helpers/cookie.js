import { splitMulti } from "../helpers/splitMulti";

export function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");

  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  var ccvalue = JSON.parse(cvalue);

  localStorage.setItem("AUTHEN_INFO", ccvalue ? ccvalue : null);
  localStorage.setItem('TOKEN', ccvalue ? 'Bearer ' + ccvalue.token : null)
  localStorage.setItem("ACCOUNT_ID", ccvalue ? ccvalue.id : null);
  localStorage.setItem("IS_ADMIN", ccvalue ? ccvalue.isAdmin : null);
  localStorage.setItem("ACCOUNT_NAME", ccvalue ? ccvalue.fullName : null);
  localStorage.setItem("ACCOUNT_AVA", ccvalue ? ccvalue.avatar : null);
  localStorage.setItem("ACCOUNT_CLAIM", ccvalue ? ccvalue.claims : []);
}

export function deleteCookie(cname) {
  document.cookie = `${cname}=; expires=Thu, 18 Dec 2013 12:00:00 UTC; path=/`;
  localStorage.removeItem("AUTHEN_INFO");
  localStorage.removeItem("TOKEN");
  localStorage.removeItem("ACCOUNT_ID");
  localStorage.removeItem("IS_ADMIN");
  localStorage.removeItem("ACCOUNT_NAME");
  localStorage.removeItem("ACCOUNT_AVA");
  localStorage.removeItem("ACCOUNT_CLAIM");
  localStorage.removeItem("ACCOUNT_CLAIM_FF");
}
