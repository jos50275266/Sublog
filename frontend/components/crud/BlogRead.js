import Link from "next/link";
import { useState, useEffect } from "react";
import Router from "next/router";
import { isAuth } from "../../actions/auth";
import { getCookie } from "../../actions/authHelpers";
import { list, removeBlog } from "../../actions/blog";
import moment from "moment";

const BlogRead = ({ username }) => {
  const [blogs, setBlogs] = useState([]);
  const [message, setMessage] = useState("");
  const token = getCookie("token");

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = () => {
    list(username)
      .then(data => {
        if (data.error) {
          console.log(data.error);
        } else {
          setBlogs(data);
        }
      })
      .catch(err => console.log(err));
  };

  const deleteBlog = slug => {
    removeBlog(slug, token)
      .then(data => {
        if (data.error) {
          setMessage(data.error);
          console.log(data.error);
        } else {
          setMessage(data.message);
          loadBlogs();
        }
      })
      .catch(err => console.log(err));
  };

  const deleteConfirm = slug => {
    let answer = window.confirm("이 글을 정말로 삭제하시겠습니까?");
    if (answer) {
      deleteBlog(slug);
    }
  };

  const showUpdateButton = blog => {
    if (isAuth() && isAuth().role === 0) {
      return (
        <Link href={`/user/crud/${blog.slug}`}>
          <a className="ml-2 btn btn-sm btn-warning">업데이트</a>
        </Link>
      );
    } else if (isAuth() && isAuth().role === 1) {
      return (
        <Link href={`/admin/crud/${blog.slug}`}>
          <a className="ml-2 btn btn-sm btn-warning">업데이트</a>
        </Link>
      );
    }
  };

  const showAllBlogs = () => {
    return blogs.map((blog, i) => {
      return (
        <div key={i} className="pb-5">
          <h3>{blog.title}</h3>
          <p className="mark">
            <b>By</b> {blog.postedBy.name} | &nbsp;
            {moment(blog.updatedAt).fromNow()} 작성됨.
          </p>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => deleteConfirm(blog.slug)}
          >
            삭제
          </button>
          {showUpdateButton(blog)}
        </div>
      );
    });
  };

  return (
    <React.Fragment>
      <div className="row">
        <div className="col-md-12">
          {message && <div className="alert alert-warning">{message}</div>}
          {showAllBlogs()}
        </div>
      </div>
    </React.Fragment>
  );
};

export default BlogRead;
