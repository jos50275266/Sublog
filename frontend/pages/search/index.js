import Layout from "../../components/Layout";
import Private from "../../components/auth/Private";
import Search from "../../components/blog/Search";

const UserIndex = () => {
  return (
    <Layout>
      <Private>
        <Search />
      </Private>
    </Layout>
  );
};

export default UserIndex;
