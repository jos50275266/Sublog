import { useState, useEffect } from "react";
import { getCookie } from "../../actions/authHelpers";
import { getCategories, removeCategory } from "../../actions/category.js";
import Link from "next/link";

const CategoryListComponent = () => {
  const [values, setValues] = useState({
    categories: [],
    removed: false,
    reload: false
  });

  const { categories, removed, reload } = values;
  const token = getCookie("token");

  useEffect(() => {
    loadCategories();
  }, [reload]);

  const loadCategories = () => {
    getCategories()
      .then(data => setValues({ ...values, categories: data }))
      .catch(err => console.log(err));
  };

  const showCategories = () => {
    return categories.map((category, index) => {
      return (
        <button
          onDoubleClick={() => deleteConfirm(category.slug)}
          title="삭제하기위해 두 번 클릭하세요..."
          key={index}
          className="btn btn-outline-primary mr-1 ml-1 mt-3"
        >
          {category.name}
        </button>
      );
    });
  };

  const deleteConfirm = slug => {
    let answer = window.confirm("정말 이 카테고리를 삭제하시겠습니까?");
    if (answer) deleteCategory(slug);
  };

  const deleteCategory = slug => {
    removeCategory(slug, token)
      .then(data => {
        if (data.error) console.log(data.error);
        else
          setValues({
            ...values,
            name: "",
            removed: !removed,
            reload: !reload
          });
      })
      .catch(err => console.log(err));
  };

  // const deleteCategory = slug => {
  //   removeCategory(slug, token)
  //     .then(data =>
  //       setValues({
  //         ...values,
  //         removed: !removed,
  //         reload: !reload
  //       })
  //     )
  //     .catch(err => console.log(err));
  // };

  const showRemoved = () => {
    if (removed) return <p className="text-danger">카테고리가 제거됨!</p>;
  };

  const mouseMoveHandler = e => {
    setValues({ ...values, removed: false });
  };

  return (
    <React.Fragment>
      <div>
        <Link href="/admin/crud/category-tag">
          <a className="btn btn-primary mb-4">카테고리 생성</a>
        </Link>
      </div>
      <h1>All Categories</h1>
      {showRemoved()}
      <div onMouseMove={mouseMoveHandler}>
        {categories && categories.length > 0 && showCategories()}
      </div>
    </React.Fragment>
  );
};

export default CategoryListComponent;
