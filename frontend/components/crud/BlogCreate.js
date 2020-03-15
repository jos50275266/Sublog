import Router from "next/router";
import fetch from "isomorphic-fetch";
// Methods
import { getCookie } from "../../actions/authHelpers";
import { getTags } from "../../actions/tag";
import { getCategories } from "../../actions/category";
import { createBlog } from "../../actions/blog";
// React
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { withRouter } from "next/router";

// React Editor
// https://github.com/jpuri/react-draft-wysiwyg/issues/893
// import { Editor } from "react-draft-wysiwyg";
// https://kokohapps.tistory.com/entry/Nextjs-nextdynamic-%EC%9D%B4%EC%9A%A9%ED%95%B4%EC%84%9C-%ED%8A%B9%EC%A0%95-%EC%BB%B4%ED%8F%AC%EB%84%8C%ED%8A%B8-SSR-%EC%95%88%ED%95%98%EA%B3%A0-%ED%81%B4%EB%9D%BC%EC%9D%B4%EC%96%B8%ED%8A%B8%EC%97%90%EC%84%9C%EB%A7%8C-%EB%A0%8C%EB%8D%94%EB%A7%81%ED%95%98%EA%B8%B0
const Editor = dynamic(
  () => import("react-draft-wysiwyg").then(mod => mod.Editor),
  { ssr: false }
);
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import "../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";

// withRouter 사용하면 props으로 router을 받을 수 있다.
const CreateBlog = ({ router }) => {
  const [body, setBody] = useState(EditorState.createEmpty());

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  const [checkedCategory, setCheckedCategories] = useState([]);
  const [checkedTag, setCheckedTags] = useState([]);

  // const [body, setBody] = useState(blogFromLocalStorage());
  const [values, setValues] = useState({
    error: "",
    sizeError: "",
    success: "",
    formData: "",
    title: "",
    excerpt: "",
    hidePublishButton: false
  });

  const {
    error,
    sizeError,
    success,
    formData,
    title,
    hidePublishButton,
    excerpt
  } = values;

  const token = getCookie("token");

  useEffect(() => {
    blogFromLS();
    setValues({ ...values, formData: new FormData() });
    initCategories();
    initTags();
  }, [router]);

  const blogFromLS = () => {
    if (typeof window === "undefined") {
      return false;
    }

    if (localStorage.getItem("draftRaw")) {
      const rawContentFromStore = convertFromRaw(
        JSON.parse(localStorage.getItem("draftRaw"))
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

  // const blogFromLocalStorage = () => {
  //   // 아래 함수 때문에 새로고침을 눌러도 body에는 이전에 작성하던 것이 그대로 붙는다.
  //   if (typeof window === "undefined") return false;

  //   if (localStorage.getItem("blog")) {
  //     return JSON.parse(localStorage.getItem("blog"));
  //   } else {
  //     return false;
  //   }
  // };
  // https://stackoverflow.com/questions/55354720/how-to-read-draftjs-state-from-localstorage
  const saveRawContentToLocalStorage = e => {
    if (typeof window !== "undefined") {
      const contentState = body.getCurrentContent();
      const rawContent = convertToRaw(contentState);
      window.localStorage.setItem("draftRaw", JSON.stringify(rawContent));
    }
  };

  const initCategories = () => {
    getCategories()
      .then(data => {
        if (data.error) setValues({ ...values, error: data.error });
        else setCategories(data);
      })
      .catch(err => console.log(err));
  };

  const initTags = () => {
    getTags()
      .then(data => {
        if (data.error) setValues({ ...values, error: data.error });
        else setTags(data);
      })
      .catch(err => console.log(err));
  };

  const publishBlog = e => {
    e.preventDefault();
    // console.log("출판할 준비가 되었습니다.");
    // console.log("abcd", convertToRaw(body.getCurrentContent()));
    // console.log("bbbb", convertToRaw(body.getCurrentContent()).blocks[0].text);

    formData.set(
      "body",
      JSON.stringify(convertToRaw(body.getCurrentContent()))
    );

    createBlog(formData, token)
      .then(data => {
        if (data === undefined) {
          return false;
        } else if (data.error) {
          setValues({ ...values, error: data.error });
        } else {
          console.log("body", body);
          alert("글 생성 성공!");
          window.localStorage.removeItem("draftRaw");
          setValues({
            ...values,
            title: "",
            error: "",
            success: `${data.title} 제목의 새로운 글이 생성되었습니다.`
          });
          setBody(EditorState.createEmpty()); //setBody is synchronous with localStorage
          setCategories([]);
          setTags([]);
          setTimeout(() => {
            Router.push("/blogs");
          }, 1000);
        }
      })
      .catch(err => console.log(err));
  };

  const handleChange = name => e => {
    const value = name === "photo" ? e.target.files[0] : e.target.value;
    formData.set(name, value);
    setValues({
      ...values,
      [name]: value,
      formData,
      error: "",
      success: "",
      error: ""
    });
  };

  // const handleBody = e => {
  //   setBody(e);
  //   formData.set("body", e);
  //   if (typeof window !== "undefined") {
  //     localStorage.setItem("blog", JSON.stringify(e));
  //   }
  // };

  const handleCategoriesToggle = category => () => {
    setValues({ ...values, error: "" });
    // return the first index or -1
    const clickedCategory = checkedCategory.indexOf(category);
    const all = [...checkedCategory];
    const notExist = -1;
    const oneElement = 1;

    if (clickedCategory === notExist) all.push(category);
    else all.splice(clickedCategory, oneElement);

    setCheckedCategories(all);
    formData.set("categories", all);
  };

  const handleTagsToggle = tag => () => {
    setValues({ ...values, error: "" });
    // return the first index or - 1
    const clickedTag = checkedTag.indexOf(tag);
    const all = [...checkedTag];
    const notExist = -1;
    const oneElement = 1;

    if (clickedTag === notExist) all.push(tag);
    else all.splice(clickedTag, oneElement);

    setCheckedTags(all);
    formData.set("tags", all);
  };

  const showCategories = () => {
    return (
      categories &&
      categories.map((c, i) => (
        <li key={i} className="list-unstyled">
          <input
            onChange={handleCategoriesToggle(c._id)}
            type="checkbox"
            className="mr-2"
          />
          <label className="form-check-label">{c.name}</label>
        </li>
      ))
    );
  };

  const showTags = () => {
    return (
      tags &&
      tags.map((t, i) => (
        <li key={i} className="list-unstyled">
          <input
            onChange={handleTagsToggle(t._id)}
            type="checkbox"
            className="mr-2"
          />
          <label className="form-check-label">{t.name}</label>
        </li>
      ))
    );
  };

  const showError = () => (
    <div
      className="alert alert-danger"
      style={{ display: error ? "" : "none" }}
    >
      {error}
    </div>
  );

  const showSuccess = () => (
    <div
      className="alert alert-success"
      style={{ display: success ? "" : "none" }}
    >
      {success}
    </div>
  );

  const createBlogForm = () => {
    return (
      <form onSubmit={publishBlog}>
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
          <label className="text-muted">소개</label>
          <input
            type="text"
            className="form-control"
            value={excerpt}
            onChange={handleChange("excerpt")}
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
            출간하기
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="container-fluid">
      <div className="pb-3">
        {showError()}
        {showSuccess()}
      </div>
      <div className="row">
        <div className="col-md-8">{createBlogForm()}</div>
        <div className="col-md-4">
          <div>
            <div className="form-group pb-2">
              <h5>이미지 등록: 최대 크기: 1mb</h5>
              <hr />

              <label className="btn btn-outline-info">
                이미지 등록하기
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
            <ul style={{ maxHeight: "200px", overflowY: "scroll" }}>
              {showTags()}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(CreateBlog);

// <ReactQuill
// modules={QuillModules}
// formats={QuillFormats}
// value={body}
// placeholder="흥미로운 이야기를 공유해주세요..."
// onChange={handleBody}
// />

// toolbar={{
//   image: {
//     urlEnabled: true,
//     uploadEnabled: true,
//     previewImage: true,
//     uploadCallback: uploadImageCallBack,
//     alignmentEnabled: true,
//     alt: { present: true, mandatory: true }
//   },
//   inputAccept:
//     "application/pdf,text/plain,application/vnd.openxmlformatsofficedocument.wordprocessingml.document,application/msword,application/vnd.ms-excel,image/gif,image/jpeg,image/jpg,image/png,image/svg"
// }}
