import cookie from "js-cookie";

// We can make sure that I am on client in Next.js using process.browser
// - process.browser is true on the client and undefined on the server.

export const setCookie = (key, value) => {
  // Make sure I'm on client side.
  if (process.browser) {
    cookie.set(key, value, {
      expires: 1
    });
  }
};

export const getCookie = key => {
  if (process.browser) {
    return cookie.get(key);
  }
};

export const removeCookie = key => {
  if (process.browser) {
    cookie.remove(key);
  }
};

export const setLocalStorage = (key, value) => {
  if (process.browser) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const removeLocalStorage = key => {
  if (process.browser) {
    localStorage.removeItem(key);
  }
};
