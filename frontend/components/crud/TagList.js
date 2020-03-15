import { useState, useEffect } from "react";
import { getCookie } from "../../actions/authHelpers";
import { getTags, removeTag } from "../../actions/tag";
import Link from "next/link";

const TagListComponent = () => {
  const [values, setValues] = useState({
    tags: [],
    removed: false,
    reload: false
  });

  let { tags, removed, reload } = values;
  const token = getCookie("token");

  useEffect(() => {
    loadTags();
  }, [reload]);

  const loadTags = () => {
    getTags()
      .then(data => setValues({ ...values, tags: data }))
      .catch(err => console.log(err));
  };

  const showTags = () => {
    return tags.map((tag, index) => {
      return (
        <button
          onDoubleClick={() => deleteConfirm(tag.slug)}
          title="삭제하기위해 두 번 클릭하세요"
          key={index}
          className="btn btn-outline-danger mr-1 ml-1 mt-3"
        >
          {tag.name}
        </button>
      );
    });
  };

  const deleteConfirm = slug => {
    let answer = window.confirm("정말 이 태그를 삭제하시겠습니까?");
    if (answer) deleteTag(slug);
  };

  const deleteTag = slug => {
    removeTag(slug, token)
      .then(data => {
        if (data.error) console.log(data.error);
        else setValues({ name: "", removed: !removed, reload: !reload });
      })
      .catch(err => console.log(err));
  };

  const showRemoved = () => {
    if (removed) return <p className="text-danger">카테고리가 제거됨!</p>;
  };

  const mouseMoveHandler = e => {
    setValues({ ...values, removed: false, reload: false });
  };

  return (
    <React.Fragment>
      <div>
        <Link href="/admin/crud/category-tag">
          <a className="btn btn-primary mb-4">태그 생성</a>
        </Link>
      </div>
      <h1>All Tags</h1>
      {showRemoved()}
      <div onMouseMove={mouseMoveHandler}>
        {tags && tags.length > 0 && showTags()}
      </div>
    </React.Fragment>
  );
};

export default TagListComponent;
