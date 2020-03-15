import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import moment from "moment";
import { API } from "../../config";
import { getCookie } from "../../actions/authHelpers";
import { like, likeUpdate } from "../../actions/blog";
import "../../public/style.css";

const Card = ({ blog }) => {
  const [numberOfLike, setNumberOfLike] = useState(0);

  useEffect(() => {
    initialzeLikeNum();
  }, []);

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

  const showBlogCategories = blog =>
    blog.categories.map((c, i) => (
      <Link key={i} href={`/categories/${c.slug}`}>
        <span className="badge badge-pill badge-primary p-2">{c.name}</span>
      </Link>
    ));

  const showBlogTags = blog =>
    blog.tags.map((t, i) => (
      <Link key={i} href={`/tags/${t.slug}`}>
        <a className="badge badge-pill badge-secondary p-2">{t.name}</a>
      </Link>
    ));

  return (
    <section className="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 bg-white border border-white">
      <article>
        <ul className="blog-post">
          <li>
            <img
              className="img-responsive"
              src={`${API}/blog/photo/${blog.slug}`}
              alt="해당 포스트는 이미지가 존재하지않습니다."
            />
            <h3 className="mt-3">
              <strong>{blog.title}</strong>
            </h3>
            <p>{blog.excerpt}</p>

            <section className="button">
              <Link href={`/blogs/${blog.slug}`}>
                <a className="text-light">
                  <b>더보기...</b>
                </a>
              </Link>
            </section>
            <br />

            <p>
              {showBlogCategories(blog)}
              <br />
              {showBlogTags(blog)}
            </p>
            <b>{moment(blog.updatedAt).format("LLL")}</b>

            <section>
              <hr />
              <b>By </b>
              <Link href={`/profile/${blog.postedBy.username}`}>
                <a>{blog.postedBy.name}</a>
              </Link>
              <label className="float-right">
                <FontAwesomeIcon
                  icon="heart"
                  onClick={updateLikeNum}
                  style={{ color: "red" }}
                />
                &nbsp;
                {numberOfLike}
              </label>
            </section>
          </li>
        </ul>
      </article>
    </section>
  );
};

export default Card;

// <div className="col-sm-6 col-md-4 col-lg-4 col-xl-4 bg-white">
// <div className="card">
//   <div className="card-header bg-white">
//     <span>
//       By &nbsp;
//       <Link href={`/profile/${blog.postedBy.username}`}>
//         <a>{blog.postedBy.name}</a>
//       </Link>
//       , {moment(blog.updatedAt).fromNow()}
//     </span>
//   </div>
//   <img
//     src={`${API}/blog/photo/${blog.slug}`}
//     style={{ maxHeight: "300px", width: "auto" }}
//     alt="해당 포스트는 이미지가 존재하지않습니다."
//   />
//   <div className="card-block">
//     <h4 className="card-title pt-4 pl-2">{blog.title}</h4>
//     <span style={{ display: "block" }} className="card-text pl-2">
//       {blog.excerpt}
//     </span>
//     <Link href={`/blogs/${blog.slug}`}>
//       <a className="ml-2">Show More...</a>
//     </Link>
//   </div>
//   <p>
//     {showBlogCategories(blog)}
//     {showBlogTags(blog)}
//   </p>
// </div>
// </div>
