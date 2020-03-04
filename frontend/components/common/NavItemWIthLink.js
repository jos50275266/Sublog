import { NavLink, NavItem } from "reactstrap";
import Link from "next/link";

export const NavItemWithLink = props => {
  let { refLink, name } = props;

  return (
    <NavItem>
      <Link href={refLink}>
        <NavLink style={{ cursor: "pointer" }}>{`${name}'s Dashboard`}</NavLink>
      </Link>
    </NavItem>
  );
};

export default NavItemWithLink;
