import Link from "next/link";
import { useState, useEffect } from "react";
import Router from "next/router";
import dynamic from "next/dynamic";
import { withRouter } from "next/router";
import { isAuth } from "../../actions/auth";
import { getCookie } from "../../actions/authHelpers";
import { getCategories } from "../../actions/category";
import { getTags } from "../../actions/tag";
import { singleBlog, updateBlog } from "../../actions/blog";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "../../node_modules/react-quill/dist/quill.snow.css";
import { QuillModules, QuillFormats } from "../../helpers/quill";
import { API } from "./../../config";

const BlogUpdate = ({ router }) => {
  const { slug } = router.query;
  const token = getCookie("token");

  const [body, setBody] = useState("");

  const [values, setValues] = useState({
    title: "",
    error: "",
    success: "",
    formData: "",
    body: ""
  });

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  const [checkedCategories, setCheckedCategories] = useState([]);
  const [checkedTags, setCheckedTags] = useState([]);

  const { error, success, formData, title } = values;

  useEffect(() => {
    setValues({ ...values, formData: new FormData() });
    initBlog();
    initCategories();
    initTags();
  }, [router]);

  const initBlog = () => {
    if (slug) {
      singleBlog(slug).then(data => {
        if (data.error) {
          console.log(data.error);
        } else {
          setValues({ ...values, title: data.title, formData: new FormData() });
          setBody(data.body);
          setCategoriesArray(data.categories);
          setTagsArray(data.tags);
        }
      });
    }
  };

  const setCategoriesArray = blogCategories => {
    let categories = [];
    blogCategories.map((c, i) => {
      categories.push(c._id);
    });
    setCheckedCategories(categories);
  };

  const setTagsArray = blogTags => {
    let tags = [];
    blogTags.map((t, i) => {
      tags.push(t._id);
    });
    setCheckedTags(tags);
  };

  const initCategories = () => {
    getCategories().then(data => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setCategories(data);
      }
    });
  };

  const initTags = () => {
    getTags().then(data => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setTags(data);
      }
    });
  };

  const handleCategoriesToggle = category => () => {
    setValues({ ...values, error: "" });
    // return the first index or -1
    const clickedCategory = checkedCategories.indexOf(category);
    const all = [...checkedCategories];

    if (clickedCategory === -1) all.push(category);
    else all.splice(clickedCategory, 1);

    console.log(all);
    setCheckedCategories(all);
    formData.set("categories", all);
  };

  const handleTagsToggle = tag => () => {
    setValues({ ...values, error: "" });
    // return the first index or -1
    const clickedTag = checkedTags.indexOf(tag);
    const all = [...checkedTags];

    if (clickedTag === -1) all.push(tag);
    else all.splice(clickedTag, 1);

    console.log(all);
    setCheckedTags(all);
    formData.set("tags", all);
  };

  const findOutCategories = category => {
    const result = checkedCategories.indexOf(category);
    if (result !== -1) return true;
    else return false;
  };

  const findOutTags = tag => {
    const result = checkedTags.indexOf(tag);
    if (result !== -1) return true;
    else return false;
  };

  const handleBody = e => {
    setBody(e);
    formData.set("body", e);
  };

  const handleChange = name => e => {
    const value = name === "photo" ? e.target.files[0] : e.target.value;
    formData.set(name, value);
    setValues({ ...values, [name]: value, formData, error: "" });
  };

  const showCategories = () => {
    return (
      categories &&
      categories.map((category, index) => (
        <li key={index} className="list-unstyled">
          <input
            onChange={handleCategoriesToggle(category._id)}
            checked={findOutCategories(category._id)}
            type="checkbox"
            className="mr-2"
          />
          <label className="form-check-label">{category.name}</label>
        </li>
      ))
    );
  };

  const showTags = () => {
    return (
      tags &&
      tags.map((tag, index) => (
        <li key={index} className="list-unstyled">
          <input
            onChange={handleTagsToggle(tag._id)}
            checked={findOutTags(tag._id)}
            type="checkbox"
            className="mr-2"
          />
          <label className="form-check-label">{tag.name}</label>
        </li>
      ))
    );
  };

  // Blog가 update 되어도 url은 처음 만든 것으로 유지.
  const editBlog = e => {
    e.preventDefault();
    updateBlog(formData, token, slug).then(data => {
      if (data.error) setValues({ ...values, error: data.error });
      else {
        setValues({
          ...values,
          title: "",
          success: `${data.title}이 성공적으로 업데이트 되었습니다!`
        });
        alert("업데이트 성공");
        if (isAuth() && isAuth().role === 1) {
          router.replace(`/admin`);
        } else if (isAuth() && isAuth().role === 0) {
          router.replace(`/user`);
        }
      }
    });
  };

  const showError = () => {
    <div
      className="alert alert-danger"
      style={{ display: error ? "" : "none" }}
    >
      {error}
    </div>;
  };

  const showSuccess = () => {
    <div
      className="alert alert-danger"
      style={{ display: success ? "" : "none" }}
    >
      {success}
    </div>;
  };

  const updateBlogForm = () => {
    return (
      <form onSubmit={editBlog}>
        <div className="form-group">
          <label className="text-muted">제목</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={handleChange("title")}
          />
        </div>

        <div className="form-group">
          <ReactQuill
            modules={QuillModules}
            formats={QuillFormats}
            value={body}
            placeholder="놀라운 이야기를 공유해주세요!..."
            onChange={handleBody}
          />
        </div>

        <div>
          <button type="submit" className="btn btn-primary">
            업데이트
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="container-fluid pb-5">
      <div className="row">
        <div className="col-md-8">
          {updateBlogForm()}
          <div className="pt-3">
            {showError()}
            {showSuccess()}
          </div>
          {body && (
            <img
              src={`${API}/blog/photo/${slug}`}
              alt={title}
              style={{ width: "100%" }}
            />
          )}
        </div>

        <div className="col-md-4">
          <div>
            <div className="form-group pb-2">
              <h5>이미지</h5>
              <hr />

              <small className="text-muted">Max size: 1mb</small>
              <br />
              <label className="btn btn-outline-info">
                클릭: 이미지 등록
                <input
                  onChange={handleChange("photo")}
                  type="file"
                  accept="image/*"
                  hidden
                />
              </label>
            </div>
          </div>
          <div>
            <h5>카테고리</h5>
            <hr />
            <ul style={{ maxHeight: "200px", overflowY: "scroll" }}>
              {showCategories()}
            </ul>
          </div>
          <div>
            <h5>태그</h5>
            <hr />
            <ul style={{ maxHeight: "200px", overflowY: "scroll" }}>
              {showTags()}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(BlogUpdate);
