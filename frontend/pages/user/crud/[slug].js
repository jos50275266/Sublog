import Layout from "./../../../components/Layout";
import Private from "./../../../components/auth/Private";
import BlogUpdate from "../../../components/crud/BlogUpdate";
import { isAuth } from "../../../actions/auth";

const Blog = () => {
  const username = isAuth() && isAuth().username;
  return (
    <Layout>
      <Private>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12 pt-5 pb-5">
              <h2>글 업데이트</h2>
            </div>
            <div className="col-md-12">
              <BlogUpdate username={username} />
            </div>
          </div>
        </div>
      </Private>
    </Layout>
  );
};

export default Blog;
