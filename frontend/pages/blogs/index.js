import { withRouter } from "next/router";
import Head from "next/head"; //meta
import Link from "next/link";
import Layout from "./../../components/Layout";
import { listBlogsWithCategoriesAndTags } from "../../actions/blog";
import Card from "../../components/blog/Card";
import { API, DOMAIN, APP_NAME, FB_APP_ID } from "../../config";
import "../../public/style.css";

const Blogs = ({ blogs, categories, tags, size, router }) => {
  const head = () => (
    <Head>
      <title>Sulog | {APP_NAME}</title>
      <meta
        name="description"
        content="This is Sulog where you can share your story!"
      />
      <link rel="canonical" href={`${DOMAIN}${router.pathname}`} />
      <meta
        property="og:title"
        content={`Sulog where you can share your story! | ${APP_NAME}`}
      />
      <meta
        property="og:description"
        content="This is Sulog where you can share your story!"
      />
      <meta property="og:type" content="webiste" />
      <meta property="og:url" content={`${DOMAIN}${router.pathname}`} />
      <meta property="og:site_name" content={`${APP_NAME}`} />

      <meta
        property="og:image"
        content={`${DOMAIN}/static/images/seoblog.jpg`}
      />
      <meta
        property="og:image:secure_url"
        content={`${DOMAIN}/public/static/images/seoblog.jpg`}
      />
      <meta property="og:image:type" content="image/jpg" />
      <meta property="fb:app_id" content={`${FB_APP_ID}`} />
    </Head>
  );

  const showAllBlogs = () => {
    return blogs.map((blog, index) => {
      return <Card key={index} blog={blog} />;
    });
  };

  const showAllCategories = () => {
    return categories.map((category, index) => (
      <Link href={`/categories/${category.slug}`} key={index}>
        <a className="btn btn-primary mr-1 ml-1 mt-3">{category.name}</a>
      </Link>
    ));
  };

  const showAllTags = () => {
    return tags.map((tag, index) => (
      <Link href={`/tags/${tag.slug}`} key={index}>
        <a className="btn btn-outline-primary mr-1 ml-1 mt-3">{tag.name}</a>
      </Link>
    ));
  };

  return (
    <React.Fragment>
      {head()}
      <Layout className="bg-white">
        <section className="container-fluid">
          <header>
            <article className="col-md-12 pt-3">
              <h1 className="display-4 font-weight-bold text-center">Sulog</h1>
            </article>
            <article className="pb-5 text-center">
              {showAllCategories()}
              <br />
              {showAllTags()}
            </article>
          </header>
        </section>
        <section className="container-fluid">
          <main className="row">{showAllBlogs()}</main>
        </section>
      </Layout>
    </React.Fragment>
  );
};

// Lifecycle method, getInitialProps can be used only on pages not in components
// getInitialProps를 사용하면 pre-rendered page가 사라짐
Blogs.getInitialProps = () => {
  return listBlogsWithCategoriesAndTags()
    .then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        // return 값을 props 값으로 사용할 수 있다.
        return {
          blogs: data.blogs,
          categories: data.categories,
          tags: data.tags,
          size: data.size
        };
      }
    })
    .catch(err => console.log(err));
};

export default withRouter(Blogs); //getInitialProps
