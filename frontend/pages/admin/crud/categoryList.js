import Layout from "./../../../components/Layout";
import Admin from "./../../../components/auth/Admin";
import CategoryListComponent from "./../../../components/crud/CategoryList";

const CategoryList = () => {
  return (
    <Layout>
      <Admin>
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12 col-md-12 col-lg-12">
              <CategoryListComponent />
            </div>
          </div>
        </div>
      </Admin>
    </Layout>
  );
};

export default CategoryList;
