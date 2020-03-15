import fetch from "isomorphic-fetch";
import Link from "next/link";
import Router from "next/router";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { withRouter } from "next/router";
//
import { isAuth } from "../../actions/auth";
import { getCookie } from "../../actions/authHelpers";
import { getCategories } from "../../actions/category";
import { getTags } from "../../actions/tag";
import { singleBlog, updateBlog } from "../../actions/blog";

// draft-js
const Editor = dynamic(
  () => import("react-draft-wysiwyg").then(mod => mod.Editor),
  { ssr: false }
);
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";
import "../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";

import { API } from "./../../config";

const BlogUpdate = ({ router }) => {
  const { slug } = router.query;
  const token = getCookie("token");

  const [body, setBody] = useState(EditorState.createEmpty());

  const [values, setValues] = useState({
    title: "",
    error: "",
    success: "",
    formData: "",
    body: "",
    excerpt: ""
  });

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  const [checkedCategories, setCheckedCategories] = useState([]);
  const [checkedTags, setCheckedTags] = useState([]);

  const { error, success, formData, title, excerpt } = values;

  useEffect(() => {
    blogFromLS();
    setValues({ ...values, formData: new FormData() });
    initBlog();
    initCategories();
    initTags();
  }, [router]);

  const blogFromLS = () => {
    if (typeof window === "undefined") {
      return false;
    }

    if (localStorage.getItem("updatedDraftRaw")) {
      const rawContentFromStore = convertFromRaw(
        JSON.parse(localStorage.getItem("updatedDraftRaw"))
      );
      setBody(EditorState.createWithContent(rawContentFromStore));
    } else {
      setBody(EditorState.createEmpty());
    }
  };

  const uploadImageCallBack = file => {
    const formData = new FormData();
    formData.append("file", file);

    return new Promise((resolve, reject) => {
      fetch("http://localhost:8000/uploadImage", {
        method: "POST",
        body: formData
      })
        .then(res => res.json())
        .then(resData => {
          console.log("Hello", resData);
          resolve({ data: { link: resData } });
        })
        .catch(error => {
          console.log(error);
          reject(error.toString());
        });
    });
  };

  const initBlog = () => {
    if (slug) {
      singleBlog(slug)
        .then(data => {
          console.log("data", data);
          if (data.error) {
            console.log(data.error);
          } else {
            setValues({
              ...values,
              title: data.title,
              excerpt: data.excerpt,
              formData: new FormData()
            });
            setBody(
              EditorState.createWithContent(
                convertFromRaw(JSON.parse(data.body))
              )
            ); // 요기
            setCategoriesArray(data.categories);
            setTagsArray(data.tags);
          }
        })
        .catch(err => console.log(err));
    }
  };

  const saveRawContentToLocalStorage = e => {
    if (typeof window !== "undefined") {
      const contentState = body.getCurrentContent();
      const rawContent = convertToRaw(contentState);
      window.localStorage.setItem(
        "updatedDraftRaw",
        JSON.stringify(rawContent)
      );
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
    getCategories()
      .then(data => {
        if (data.error) {
          setValues({ ...values, error: data.error });
        } else {
          setCategories(data);
        }
      })
      .catch(err => console.log(err));
  };

  const initTags = () => {
    getTags()
      .then(data => {
        if (data.error) {
          setValues({ ...values, error: data.error });
        } else {
          setTags(data);
        }
      })
      .catch(err => console.log(err));
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

    formData.set(
      "body",
      JSON.stringify(convertToRaw(body.getCurrentContent()))
    );

    //    console.log("formData", formData);

    updateBlog(formData, token, slug)
      .then(data => {
        if (data === undefined) return false;
        else if (data.error) setValues({ ...values, error: data.error });
        else {
          setValues({
            ...values,
            title: "",
            error: "",
            success: `${data.title}이 성공적으로 업데이트 되었습니다!`,
            excerpt: ""
          });
          alert("업데이트 성공");
          window.localStorage.removeItem("updatedDraftRaw");

          if (isAuth() && isAuth().role === 1) {
            router.replace(`/admin`);
          } else if (isAuth() && isAuth().role === 0) {
            router.replace(`/user`);
          }
        }
      })
      .catch(err => console.log(err));
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
            placeholder="제목을 입력해주세요..."
          />
        </div>
        <div className="form-group">
          <label className="text-muted">소개</label>
          <input
            type="text"
            className="form-control"
            value={excerpt}
            onChange={handleChange("excerpt")}
            placeholder="소개글을 입력해주세요..."
          />
        </div>

        <div className="form-group">
          <Editor
            onChange={saveRawContentToLocalStorage}
            editorState={body}
            wrapperClassName="wrapper-class"
            editorClassName="editor-class"
            toolbarClassName="toolbar-class"
            wrapperStyle={{ border: "2px solid green", marginBottom: "20px" }}
            editorStyle={{ height: "300px", padding: "10px" }}
            onEditorStateChange={editorState => setBody(editorState)}
            toolbar={{
              image: {
                previewImage: true,
                uploadCallback: uploadImageCallBack,
                alt: { present: true, mandatory: false }
              }
            }}
          />
          <textarea
            disabled
            style={{ width: "100%" }}
            value={draftToHtml(convertToRaw(body.getCurrentContent()))}
          />
        </div>

        <div>
          <button type="submit" className="btn btn-primary">
            업데이트
          </button>
          <div>
            {body && (
              <img
                src={`${API}/blog/photo/${slug}`}
                alt={title}
                style={{ width: "200px", height: "200px" }}
              />
            )}
          </div>
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
