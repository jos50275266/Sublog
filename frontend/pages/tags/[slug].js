import Head from "next/head";
import Layout from "./../../components/Layout";
import { singleTag } from "./../../actions/tag";
import Card from "./../../components/blog/Card";
import { API, DOMAIN, APP_NAME, FB_APP_ID } from "../../config";
import "../../static/style.css";

const Tag = ({ tag, blogs, query }) => {
  const head = () => (
    <Head>
      <title>
        {tag.title} | {APP_NAME}
      </title>
      <meta name="description" content={`Sulog ${tag.name}`} />
      <link rel="canonical" href={`${DOMAIN}/tags/${query.slug}`} />
      <meta property="og:title" content={`${tag.name} | ${APP_NAME}`} />
      <meta property="og:description" content={`Sulog ${tag.name}`} />
      <meta property="og:type" content="webiste" />
      <meta property="og:url" content={`${DOMAIN}/tags/${query.slug}`} />
      <meta property="og:site_name" content={`${APP_NAME}`} />

      <meta
        property="og:image"
        content={`${DOMAIN}/static/page.jpg}
      />
      <meta
        property="og:image:secure_url"
        content={${DOMAIN}/static/page.jpg`}
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
              <h1 className="display-4 font-weight-bold">{tag.name}</h1>
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

Tag.getInitialProps = ({ query }) => {
  return singleTag(query.slug).then(data => {
    if (data.error) {
      console.log(data.error);
    } else {
      console.log(data.blogs);
      return { tag: data.tag, blogs: data.blogs, query };
    }
  });
};

export default Tag;
