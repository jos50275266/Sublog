import Head from "next/head";
import Layout from "./../../components/Layout";
import { singleCategory } from "./../../actions/category";
import Card from "./../../components/blog/Card";
import { API, DOMAIN, APP_NAME, FB_APP_ID } from "../../config";

const Category = ({ category, blogs, query }) => {
  const head = () => (
    <Head>
      <title>
        {category.title} | {APP_NAME}
      </title>
      <meta name="description" content={`Sulog ${category.name}`} />
      <link rel="canonical" href={`${DOMAIN}/categories/${query.slug}`} />
      <meta property="og:title" content={`${category.name} | ${APP_NAME}`} />
      <meta property="og:description" content={`Sulog ${category.name}`} />
      <meta property="og:type" content="webiste" />
      <meta property="og:url" content={`${DOMAIN}/categories/${query.slug}`} />
      <meta property="og:site_name" content={`${APP_NAME}`} />

      <meta property="og:image" content={`${DOMAIN}/static/page.jpg`} />
      <meta
        property="og:image:secure_url"
        content={`${DOMAIN}/static/page.jpg`}
      />
      <meta property="og:image:type" content="image/jpg" />
      <meta property="fb:app_id" content={`${FB_APP_ID}`} />
    </Head>
  );

  return (
    <React.Fragment>
      {head()}
      <Layout>
        <main>
          <div className="container-fluid text-center">
            <header>
              <h1 className="display-4 font-weight-bold">{category.name}</h1>
              <article className="row">
                {blogs.map((b, i) => (
                  <Card key={i} blog={b} />
                ))}
              </article>
            </header>
          </div>
        </main>
      </Layout>
    </React.Fragment>
  );
};

Category.getInitialProps = ({ query }) => {
  return singleCategory(query.slug).then(data => {
    if (data.error) {
      console.log(data.error);
    } else {
      return { category: data.category, blogs: data.blogs, query };
    }
  });
};

export default Category;
