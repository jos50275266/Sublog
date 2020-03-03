import { NavLink, NavItem } from "reactstrap";
import { logout } from "../../actions/auth";
import Router from "next/router";

const NavItemWithoutLink = props => {
  const { name, signout } = props;

  return (
    <NavItem>
      <NavLink
        style={{ cursor: "pointer" }}
        onClick={signout ? () => logout(() => Router.replace("/signin")) : null}
      >
        {name}
      </NavLink>
    </NavItem>
  );
};

export default NavItemWithoutLink;
