import fetch from "isomorphic-fetch";
import { API } from "../config";
import Router from "next/router";
import {
  setCookie,
  getCookie,
  removeCookie,
  setLocalStorage,
  removeLocalStorage
} from "../actions/authHelpers";

export const handleResponse = response => {
  logout(() => {
    Router.push({
      pathname: "/signin",
      query: {
        message: "세션이 만료되었습니다. 다시 로그인해주세요..."
      }
    });
  });
};

export const preSignup = user => {
  return fetch(`${API}/pre-signup`, {
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

export const updateUser = (user, next) => {
  if (process.browser) {
    if (localStorage.getItem("user")) {
      let auth = JSON.parse(localStorage.getItem("user"));
      auth = user; // update this variable;
      localStorage.setItem("user", JSON.stringify(auth));
      next();
    }
  }
};

export const forgotPassword = email => {
  return fetch(`${API}/forgot-password`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(email)
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export const resetPassword = resetpassword => {
  return fetch(`${API}/reset-password`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(resetpassword)
  })
    .then(res => {
      return res.json();
    })
    .catch(err => console.log(err));
};

export const loginWithGoogle = user => {
  return fetch(`${API}/google-login`, {
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
