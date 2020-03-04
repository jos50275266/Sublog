import Layout from "./../../../components/Layout";
import Admin from "./../../../components/auth/Admin";
import TagListComponent from "./../../../components/crud/TagList";

const TagList = () => {
  return (
    <Layout>
      <Admin>
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12 col-md-12 col-lg-12">
              <TagListComponent />
            </div>
          </div>
        </div>
      </Admin>
    </Layout>
  );
};

export default TagList;
