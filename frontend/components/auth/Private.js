import { useEffect } from "react";
import Router from "next/router";
import { isAuth } from "./../../actions/auth";

// Login한 유저만 가능
const Private = ({ children }) => {
  useEffect(() => {
    if (!isAuth()) Router.push("/signin");
  }, []);

  return <React.Fragment>{children}</React.Fragment>;
};

export default Private;
