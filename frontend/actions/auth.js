import fetch from "isomorphic-fetch";
import { API } from "../config";
import {
  setCookie,
  getCookie,
  removeCookie,
  setLocalStorage,
  removeLocalStorage
} from "../actions/authHelpers";

export const signup = user => {
  return fetch(`${API}/signup`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  })
    .then(res => {
      return res.json();
    })
    .catch(err => console.log(err));
};

export const signin = user => {
  return fetch(`${API}/signin`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  })
    .then(res => {
      return res.json();
    })
    .catch(err => console.log(err));
};

export const logout = next => {
  removeCookie("token");
  removeLocalStorage("user");
  next();

  return;
};

export const authenticate = (data, next) => {
  const { token, user } = data;
  setCookie("token", token);
  setLocalStorage("user", user);
  next();
};

export const isAuth = () => {
  if (process.browser) {
    const cookieChecked = getCookie("token");
    if (cookieChecked) {
      if (localStorage.getItem("user")) {
        return JSON.parse(localStorage.getItem("user"));
      } else {
        return false;
      }
    }
  }
};
