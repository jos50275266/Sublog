import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import moment from "moment";
import { getCookie } from "../../actions/authHelpers";
import { like, likeUpdate } from "../../actions/blog";
import { API } from "../../config";

const SmallCard = ({ blog }) => {
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

  return (
    <div className="card">
      <section>
        <Link href={`/blogs/${blog.slug}`}>
          <a>
            <img
              className="img img-fluid"
              style={{ maxHeight: "auto", width: "100%" }}
              src={`${API}/blog/photo/${blog.slug}`}
              alt={blog.title}
            />
          </a>
        </Link>
      </section>
      <article className="card-body">
        <div>
          <Link href={`/blogs/${blog.slug}`}>
            <a>
              <h5 className="card-title">{blog.title}</h5>
            </a>
          </Link>
        </div>
        <div className="card-body">
          <span style={{ display: "block" }} className="card-text pl-2">
            {blog.excerpt}
          </span>
          <Link href={`/blogs/${blog.slug}`}>
            <a className="ml-2">Show More...</a>
          </Link>
          <hr />
          {moment(blog.updatedAt).format("lll")}
          <Link href={`/`}>
            <a className="float-left">By {blog.postedBy.name}</a>
          </Link>
          <label className="float-right">
            <FontAwesomeIcon icon="heart" onClick={updateLikeNum}                   style={{ color: "red" }}
            />
            &nbsp;
            {numberOfLike}
          </label>
        </div>
      </article>
    </div>
  );
};

export default SmallCard;
