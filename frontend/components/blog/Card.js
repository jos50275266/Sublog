import getConfig from "next/config";
import Link from "next/link";
import renderHTML from "react-render-html";
import moment from "moment";
import { API } from "../../config";
import "../../public/style.css";

const Card = ({ blog }) => {
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

  return (
    <div className="col-sm-6 col-md-4 col-lg-4 col-xl-4 bg-white">
      <div className="card">
        <div className="card-header bg-white">
          <span>
            By {blog.postedBy.name}, {moment(blog.updatedAt).fromNow()}
          </span>
        </div>
        <img
          src={`${API}/blog/photo/${blog.slug}`}
          style={{ maxHeight: "300px", width: "auto" }}
          alt="해당 포스트는 이미지가 존재하지않습니다."
        />
        <div className="card-block">
          <h4 className="card-title pt-4 pl-2">{blog.title}</h4>
          <span style={{ display: "block" }} className="card-text pl-2">
            {blog.excerpt}
          </span>
          <Link href={`/blogs/${blog.slug}`}>
            <a className="ml-2">Show More...</a>
          </Link>
        </div>
        <p>
          {showBlogCategories(blog)}
          {showBlogTags(blog)}
        </p>
      </div>
    </div>
  );
};

export default Card;
