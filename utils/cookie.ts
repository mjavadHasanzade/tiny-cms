export const setCookie = (
  cookieName: string,
  cookieValue: string,
  expireDays: number
) => {
  const date = new Date();
  date.setTime(date.getTime() + expireDays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + date.toUTCString();
  document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
};

export const getCookie = (cookieName: string, cookieStr: string) => {
  let name = cookieName + "=";
  let decodedCookie = decodeURIComponent(cookieStr);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};

export const deleteCookie = (cookieName: string) => {
  document.cookie = `${cookieName}= ; expires = Thu, 01 Jan 1970 00:00:00 GMT`;
};
