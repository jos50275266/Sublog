import { useState } from "react";
import { getCookie } from "../../actions/authHelpers";
import Link from "next/link";

import { create } from "./../../actions/tag";

const Tag = () => {
  const [values, setValues] = useState({
    name: "",
    error: false,
    success: false
  });

  let { name, error, success } = values;
  const token = getCookie("token");

  const clickSubmit = e => {
    e.preventDefault();
    create({ name }, token)
      .then(data => {
        if (data === undefined) {
          return false;
        } else if (data.error) {
          console.log("data", data);
          setValues({ ...values, error: data.error, success: false });
        } else {
          setValues({ error: false, success: true, name: "" });
        }
      })
      .catch(err => console.log(err));
  };

  const handleChange = e => {
    setValues({
      name: e.target.value,
      error: false,
      success: false
    });
  };

  const showSuccess = () => {
    if (success) return <p className="text-success">새로운 태그 생성됨!</p>;
  };

  const showError = () => {
    if (error) return <p className="text-danger">이미 존재하는 태그 입니다.</p>;
  };

  const mouseMoveHandler = e => {
    setValues({ ...values, error: false, success: false });
  };

  const newTagForm = () => (
    <form onSubmit={clickSubmit}>
      <div className="form-group">
        <label className="text-muted">태그 생성</label>
        <input
          type="text"
          className="form-control"
          onChange={handleChange}
          value={name}
          required
        />
      </div>
      <div>
        <button type="submit" className="btn btn-primary">
          생성하기
        </button>
      </div>
    </form>
  );

  return (
    <React.Fragment>
      <div>
        <Link href="/admin/crud/tagList">
          <a className="btn btn-primary mb-4">모든 태그</a>
        </Link>
      </div>
      {showSuccess()}
      {showError()}
      <div onMouseMove={mouseMoveHandler}>{newTagForm()}</div>
    </React.Fragment>
  );
};

export default Tag;
