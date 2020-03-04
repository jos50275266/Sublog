import { useState } from "react";
import { getCookie } from "../../actions/authHelpers";
import Link from "next/link";

import { create } from "../../actions/category.js";

const Category = () => {
  const [values, setValues] = useState({
    name: "",
    error: false,
    success: false
  });

  let { name, error, success } = values;
  const token = getCookie("token");

  // const clickSubmit = e => {
  //   e.preventDefault();
  //   create({ name }, token)
  //     .then(data =>
  //       setValues({
  //         ...values,
  //         error: false,
  //         success: true,
  //         name: "",
  //         reload: !reload
  //       })
  //     )
  //     .catch(error =>
  //       setValues({
  //         ...values,
  //         error: error,
  //         success: false,
  //         reload: !reload
  //       })
  //     );
  // };

  const clickSubmit = e => {
    e.preventDefault();
    // console.log('create category', name);
    create({ name }, token).then(data => {
      if (data.error) {
        console.log("data", data);
        setValues({ ...values, error: data.error, success: false });
      } else {
        setValues({
          ...values,
          error: false,
          success: true,
          name: ""
        });
      }
    });
  };

  const handleChange = e => {
    setValues({
      name: e.target.value,
      error: false,
      success: false
    });
  };

  const showSuccess = () => {
    if (success) return <p className="text-success">새로운 카테고리 생성됨!</p>;
  };

  const showError = () => {
    if (error)
      return <p className="text-danger">이미 존재하는 카테고리 입니다.</p>;
  };

  const mouseMoveHandler = e => {
    setValues({ ...values, error: false, success: false });
  };

  const newCategoryForm = () => (
    <form onSubmit={clickSubmit}>
      <div className="form-group">
        <label className="text-muted">카테고리 생성</label>
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
        <Link href="/admin/crud/categoryList">
          <a className="btn btn-primary mb-4">모든 카테고리</a>
        </Link>
      </div>
      {showSuccess()}
      {showError()}
      <div onMouseMove={mouseMoveHandler}>{newCategoryForm()}</div>
    </React.Fragment>
  );
};

export default Category;
