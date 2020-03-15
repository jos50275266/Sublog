import { useState, useEffect } from "react";
import Link from "next/link";
import Router from "next/router";
import NProgress from "nprogress";
import { APP_NAME } from "../config";
import { logout, isAuth } from "../actions/auth";

// Document에 link를 이용하거나 아래와 같이 node_modules을 이용할 수 있다.
// 하지만 이 방식은 React 에서는 가능하지만 next에서는 안된다.
// 하지만, next.config.js의 설정을 변경해주면 가능하다.
import ".././node_modules/nprogress/nprogress.css";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

Router.onRouteChangeStart = url => NProgress.start();
Router.onRouteChangeComplete = url => NProgress.done();
Router.onRouteChangeError = url => NProgress.done();

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isAuth()) setName(isAuth().name);
  }, [name]);

  return (
    <header>
      <Navbar color="light" light expand="md">
        <Link href="/">
          <NavLink className="font-weight-bold">{APP_NAME}</NavLink>
        </Link>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <React.Fragment>
              <NavItem>
                <Link href="/blogs">
                  <NavLink>Sulog</NavLink>
                </Link>
              </NavItem>
              <NavItem>
                <Link href="/contact">
                  <NavLink>Contact</NavLink>
                </Link>
              </NavItem>
              <NavItem>
                <Link href="/search">
                  <NavLink>검색</NavLink>
                </Link>
              </NavItem>
            </React.Fragment>

            {!isAuth() && (
              <React.Fragment>
                <NavItem>
                  <Link href="/signin">
                    <NavLink>로그인</NavLink>
                  </Link>
                </NavItem>
                <NavItem>
                  <Link href="/signup">
                    <NavLink>회원가입</NavLink>
                  </Link>
                </NavItem>
              </React.Fragment>
            )}

            {isAuth() && isAuth().role === 0 && (
              <NavItem>
                <Link href="/user">
                  <NavLink>{`${name}`}</NavLink>
                </Link>
              </NavItem>
            )}

            {isAuth() && isAuth().role === 1 && (
              <NavItem>
                <Link href="/admin">
                  <NavLink>{`${name}`}</NavLink>
                </Link>
              </NavItem>
            )}

            {isAuth() && (
              <React.Fragment>
                <NavItem>
                  <NavLink
                    onClick={() => logout(() => Router.replace(`/signin`))}
                  >
                    로그아웃
                  </NavLink>
                </NavItem>
                <NavItem>
                    <a href="/user/crud/blog" className="btn btn-primary text-light">글쓰기</a>
                </NavItem>
              </React.Fragment>
            )}
          </Nav>
        </Collapse>
      </Navbar>
    </header>
  );
};

/** 글쓰기 Draft-js가 제대로 안뜨는 것을 방지하기위해 새로고침으로 
 * <NavLink></NavLink> 대신에 a 태그 사용, 완전한 reloading을 위해
  
              <NavLink
                href="/user/crud/blog"
                className="btn btn-primary text-light"
              >
                글쓰기
              </NavLink>
 */

export default Header;
