import moment from "moment";
import Head from "next/head";
import Link from "next/link";
import Layout from "./../../components/Layout";
import { convertFromJSONToHTML } from "../../helpers/dataParser.js";
import { useState, useEffect } from "react";
import { singleBlog, listRelated } from "./../../actions/blog";
import SmallCard from "./../../components/blog/SmallCard";
import { API, DOMAIN, APP_NAME, FB_APP_ID } from "../../config";
import DisqusThread from "./../../components/DisqusThread";

const SingleBlog = ({ blog, query }) => {
  const [related, setRelated] = useState([]);

  const loadRelated = () => {
    listRelated({ blog }).then(data => {
      if (data === undefined) console.log("undefined");
      else if (data.error) console.log(data.error);
      else setRelated(data);
    });
  };

  useEffect(() => {
    console.log(convertFromJSONToHTML(blog.body));
    loadRelated();
  }, []);

  const head = () => (
    <Head>
      <title>
        {blog.title} | {APP_NAME}
      </title>
      <meta name="description" content={blog.mdesc} />
      <link rel="canonical" href={`${DOMAIN}/blogs/${query.slug}`} />
      <meta property="og:title" content={`${blog.title} | ${APP_NAME}`} />
      <meta property="og:description" content={blog.mdesc} />
      <meta property="og:type" content="webiste" />
      <meta property="og:url" content={`${DOMAIN}/blogs/${query.slug}`} />
      <meta property="og:site_name" content={`${APP_NAME}`} />

      <meta property="og:image" content={`${API}/blog/photo/${blog.slug}`} />
      <meta
        property="og:image:secure_url"
        content={`${API}/blog/photo/${blog.slug}`}
      />
      <meta property="og:image:type" content="image/jpg" />
      <meta property="fb:app_id" content={`${FB_APP_ID}`} />
    </Head>
  );

  const showBlogCategories = blog =>
    blog.categories.map((c, i) => (
      <Link key={i} href={`/categories/${c.slug}`}>
        <a className="btn btn-primary mr-1 ml-1 mt-3">{c.name}</a>
      </Link>
    ));

  const showBlogTags = blog =>
    blog.tags.map((t, i) => (
      <Link key={i} href={`/tags/${t.slug}`}>
        <a className="btn btn-outline-primary mr-1 ml-1 mt-3">{t.name}</a>
      </Link>
    ));

  const showRelatedBlog = () => {
    return related.map((blog, index) => (
      <div key={index} className="col-md-4">
        <article>
          <SmallCard blog={blog} />
        </article>
      </div>
    ));
  };

  const showComments = () => {
    return (
      <div>
        <DisqusThread
          id={blog._id}
          title={blog.title}
          path={`/blog/${blog.slug}`}
        />
      </div>
    );
  };

  return (
    <React.Fragment>
      {head()}
      <Layout>
        <main>
          <article>
            <div className="container-fluid">
              <section>
                <img
                  src={`${API}/blog/photo/${blog.slug}`}
                  alt={blog.title}
                  style={{
                    display: "block",
                    maxHeight: "60%",
                    maxWidth: "50%",
                    marginLeft: "auto",
                    marginRight: "auto"
                  }}
                />
              </section>

              <section>
                <div className="container">
                  <h1 className="display-2 pb-3 font-weight-bold text-center pt-3">
                    {blog.title}
                  </h1>
                  <p className="lead mt-3">
                    By {blog.postedBy.name} | {moment(blog.updatedAt).fromNow()}
                  </p>
                  <div className="pb-3">
                    {showBlogCategories(blog)}
                    {showBlogTags(blog)}
                    <br />
                    <br />
                  </div>
                </div>
              </section>
            </div>
            <div className="container">
              <section>
                <div
                  dangerouslySetInnerHTML={convertFromJSONToHTML(blog.body)}
                  className="col-md-12 lead"
                ></div>
              </section>
            </div>

            <div className="container pb-5">
              <h4 className="text-center pt-5 pb-5 h2">관련 포스트</h4>
              <hr />
              <div className="row">{showRelatedBlog()}</div>
            </div>

            <div className="container pb-5">{showComments()}</div>
          </article>
        </main>
      </Layout>
    </React.Fragment>
  );
};

SingleBlog.getInitialProps = ({ query }) => {
  return singleBlog(query.slug).then(data => {
    if (data.error) {
      console.log(data.error);
    } else {
      // console.log('GET INITIAL PROPS IN SINGLE BLOG', data);
      return { blog: data, query };
    }
  });
};

export default SingleBlog;
