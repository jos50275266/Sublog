import moment from "moment";
import Head from "next/head";
import Link from "next/link";
import Layout from "./../../components/Layout";
import { writerData } from "../../actions/user";
import { convertFromJSONToHTML } from "../../helpers/dataParser.js";
import { useState, useEffect } from "react";
import { singleBlog, listRelated } from "./../../actions/blog";
import SmallCard from "./../../components/blog/SmallCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getCookie } from "../../actions/authHelpers";
import { like, likeUpdate } from "../../actions/blog";
import { API, DOMAIN, APP_NAME, FB_APP_ID } from "../../config";
import DisqusThread from "./../../components/DisqusThread";

const SingleBlog = ({ blog, query }) => {
  const [related, setRelated] = useState([]);
  const [writer, setWriter] = useState({});
  const [numberOfLike, setNumberOfLike] = useState(0);

  const initialzeLikeNum = () => {
    like(blog.slug)
      .then(data => setNumberOfLike(data.like.length))
      .catch(err => console.log(err));
  };

  const updateLikeNum = () => {
    const token = getCookie("token");

    likeUpdate(blog.slug, token)
      .then(data => {
        // console.log(data);
        setNumberOfLike(data.like.length);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const loadRelated = () => {
    listRelated({ blog })
      .then(data => {
        if (data === undefined) console.log("undefined");
        else if (data.error) console.log(data.error);
        else setRelated(data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const getUserProfile = username => {
    writerData(username)
      .then(data => {
        if (data === undefined) console.log("undefined");
        else if (data.error) console.log(data.error);
        else setWriter(data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(() => {
    // console.log("blog", blog);
    // console.log(convertFromJSONToHTML(blog.body));
    initialzeLikeNum();
    getUserProfile(blog.postedBy.username);
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
      <section
        className="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-4"
        key={index}
      >
        <SmallCard blog={blog} />
      </section>
    ));
  };

  const showComments = () => {
    return (
      <DisqusThread
        id={blog._id}
        title={blog.title}
        path={`/blog/${blog.slug}`}
      />
    );
  };

  const showWriter = () => {
    return (
      <article className="container-fluid">
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <section
          style={{ marginLeft: "auto", marginRight: "auto" }}
          className="col-12 col-sm-10 col-md-10 col-lg-8 col-xl-8 border border-white"
        >
          <div className="row">
            <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3 border border-white">
              <Link href={`/profile/${blog.postedBy.username}`}>
                <img
                  className="rounded-circle"
                  src={`${API}/user/photo/${writer.username}`}
                  alt="프로필이미지가 없습니다."
                  style={{ height: "150px", width: "150px" }}
                />
              </Link>
            </div>
            <div className="col-5 col-sm-5 col-md-5 col-lg-5 col-xl-5 border border-white pt-5 pb-5">
              <h4>
                <Link href={`/profile/${blog.postedBy.username}`}>
                  <a>{blog.postedBy.name}</a>
                </Link>
              </h4>
              <p className="float-left">{writer.about}</p>
            </div>
          </div>
          <hr />
        </section>
      </article>
    );
  };

  return (
    <React.Fragment>
      {head()}
      <Layout>
        <article className="container-fluid">
          <header
            className="col-12 col-sm-10 col-md-10 col-lg-8 col-xl-8 border border-white rounded mb-4"
            style={{ marginLeft: "auto", marginRight: "auto" }}
          >
            <h1 className="display-4">{blog.title}</h1>
            <p className="lead mt-3">
              By&nbsp;
              <Link href={`/profile/${blog.postedBy.username}`}>
                <a>{blog.postedBy.name}</a>
              </Link>
              , {moment(blog.updatedAt).fromNow()}
            </p>
            <section className="pb-3">
              {showBlogCategories(blog)}
              {showBlogTags(blog)}
              <label className="float-right">
                <FontAwesomeIcon
                  icon="heart"
                  onClick={updateLikeNum}
                  style={{ width: "50px", height: "50px", color: "red" }}
                />
                &nbsp;
                <h4 style={{ display: "inline-block" }}>{numberOfLike}</h4>
              </label>
              <br />
            </section>
            <figure>
              <img
                src={`${API}/blog/photo/${blog.slug}`}
                alt={blog.title}
                style={{
                  display: "block",
                  maxHeight: "30%",
                  maxWidth: "60%",
                  marginLeft: "auto",
                  marginRight: "auto"
                }}
              />
            </figure>
          </header>

          <section className="container-fluid">
            <section
              dangerouslySetInnerHTML={convertFromJSONToHTML(blog.body)}
              style={{ marginLeft: "auto", marginRight: "auto" }}
              className="col-12 col-sm-10 col-md-10 col-lg-8 col-xl-8 border border-white"
            ></section>
          </section>

          {showWriter()}

          <footer className="container mt-5">
            <hr />
            <h2 className="bg-info text-center pt-2 pb-2 h2">관련 글</h2>
            <section className="row m-5">{showRelatedBlog()}</section>
            <br />
            <br />
            <hr />
            {showComments()}
          </footer>
        </article>
      </Layout>
    </React.Fragment>
  );
};

SingleBlog.getInitialProps = ({ query }) => {
  return singleBlog(query.slug)
    .then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        // console.log('GET INITIAL PROPS IN SINGLE BLOG', data);
        return { blog: data, query };
      }
    })
    .catch(err => console.log(err));
};

export default SingleBlog;
