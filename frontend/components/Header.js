import { useState, useEffect } from "react";
import Router from "next/router";
import { APP_NAME } from "../config";
import { isAuth } from "./../actions/auth";
import NavItemWithLink from "./common/NavItemWIthLink";
import NavItemWithoutLink from "./common/NavItemWithoutLink";

import Link from "next/link";

import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavLink
} from "reactstrap";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <Navbar color="light" light expand="md">
        <Link href="/">
          <NavLink className="font-weight-bold">{APP_NAME}</NavLink>
        </Link>

        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            {!isAuth() && (
              <React.Fragment>
                <NavItemWithLink refLink="/signin" name="로그인" />
                <NavItemWithLink refLink="/signup" name="회원가입" />
              </React.Fragment>
            )}

            {isAuth() && <NavItemWithoutLink signout={true} name="로그아웃" />}

            {isAuth() && isAuth().role === 1 && (
              <NavItemWithLink refLink="/admin" name={isAuth().name} />
            )}

            {isAuth() && isAuth().role === 0 && (
              <NavItemWithLink refLink="/user" name={isAuth().name} />
            )}
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default Header;
