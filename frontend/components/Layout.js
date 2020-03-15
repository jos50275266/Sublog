import Header from "./Header";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faHeart, faKey } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
library.add(faHeart, faKey);
moment.locale("ko");

const Layout = ({ children }) => {
  return (
    <React.Fragment>
      <Header />
      {children}
    </React.Fragment>
  );
};

export default Layout;
