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
  // localStorage.setItem('TOKEN', ccvalue ? 'Bearer ' + ccvalue.token : null)
  localStorage.setItem(
    "TOKEN",
    ccvalue
      ? "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjNGOTIwMEUwMDZGMzVERTRBNEE1OEI2QkU3NUQxQzQzIiwidHlwIjoiYXQrand0In0.eyJuYmYiOjE3NjQwNjY5OTgsImV4cCI6MTc2NDE1MzM5OCwiaXNzIjoiaHR0cHM6Ly90cnV5eHVhdG5ndW9uZ29jLnRpZW5naWFuZy5nb3Yudm46OTkwMyIsImF1ZCI6IlR4bmdfQ2VudGVyX2FwaSIsImNsaWVudF9pZCI6IkFkbWluQ2xpZW50SWQiLCJzdWIiOiIxIiwiYXV0aF90aW1lIjoxNzY0MDY2OTk4LCJpZHAiOiJsb2NhbCIsImlhdCI6MTc2NDA2Njk5OCwic2NvcGUiOlsib3BlbmlkIiwicHJvZmlsZSIsInJvbGVzIiwiVHhuZ19DZW50ZXJfYXBpIiwib2ZmbGluZV9hY2Nlc3MiXSwiYW1yIjpbInB3ZCJdfQ.WGM28iJmm3ZcRu3bAj43kv-nWPTurqkkZWKJD0T5773w7b2WQP3ol0JPf426PlpFksF_K7V1Ef04yTV07UwXQ-u3FsIfZEHP9jypd5jQvvgXyjIOmcstk1cpyAWB0BBeLVq_fG658CHtomQ1EELaXWdAUMkC6MpSehAN-BShimCIPUdultht5LtOQUsgDeVQY-06iEfCHHlUWy6P_FOz9aDVBCiHv9qq5AM3QC7VBbMBXSfJXQTXs5VVk8xpfKl6P8cw4x_PDyUQnn6UQ1jBbYigJ1m_d9DAMvO8arN9jgciZBqFBorLc835lwkcV5wswBu4Xx-wcgoQkBXLFoju6A"
      : null
  );
  localStorage.setItem("ACCOUNT_ID", ccvalue ? ccvalue.id : null);
  localStorage.setItem("IS_ADMIN", ccvalue ? ccvalue.isAdmin : null);
  localStorage.setItem("ACCOUNT_NAME", ccvalue ? ccvalue.fullName : null);
  localStorage.setItem("ACCOUNT_AVA", ccvalue ? ccvalue.avatar : null);
  localStorage.setItem("ACCOUNT_CLAIM", ccvalue ? ccvalue.claims : []);

  // localStorage.setItem('ACCOUNT_CLAIM_FF', ccvalue ? (splitMulti(ccvalue.claims, [',', '[', ']', '"']).filter(x => x != "") || []) : [])
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
