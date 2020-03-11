import Layout from "../../components/Layout";
import Admin from "./../../components/auth/Admin";
import Link from "next/link";

const AdminIndex = () => {
  return (
    <Layout>
      <Admin>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12 pt-5 pb-5">
              <h2>Admin Dashboard</h2>
            </div>
            <div className="col-md-8">
              <ul>
                <li className="list-group-item">
                  <Link href="/admin/crud/category-tag">
                    <a>카테고리 생성</a>
                  </Link>
                </li>
                <li className="list-group-item">
                  <Link href="/admin/crud/category-tag">
                    <a>태그 생성</a>
                  </Link>
                </li>
                <li className="list-group-item">
                  <Link href="/admin/crud/blog">
                    <a>블로그 생성</a>
                  </Link>
                </li>
                <li className="list-group-item">
                  <Link href="/admin/crud/blogs">
                    <a>블로그 업데이트/삭제</a>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-md-4"></div>
          </div>
        </div>
      </Admin>
    </Layout>
  );
};

export default AdminIndex;
