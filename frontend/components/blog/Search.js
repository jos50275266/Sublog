import Link from "next/link";
import { useState } from "react";
import { listSearch } from "../../actions/blog";

const Search = () => {
  const [values, setValues] = useState({
    search: undefined,
    results: [],
    searched: false,
    message: ""
  });

  const { search, results, searched, message } = values;

  const searchSubmit = e => {
    e.preventDefault();
    listSearch({ search }).then(data => {
      setValues({
        ...values,
        results: data,
        searched: true,
        message: `${data.length}개의 글이 발견됬습니다.`
      });
    });
  };

  const handleChange = e => {
    setValues({
      ...values,
      search: e.target.value,
      searched: false,
      results: []
    });
  };

  const searchedBlogs = (results = []) => {
    return (
      <div className="jumbotron bg-white">
        {message && <p className="text-muted font-italic">{message}</p>}

        {results.map((blog, index) => {
          return (
            <div key={index}>
              <Link href={`/blogs/${blog.slug}`}>
                <a className="text-primary">{blog.title}</a>
              </Link>
            </div>
          );
        })}
      </div>
    );
  };

  const searchForm = () => (
    <form onSubmit={searchSubmit}>
      <div className="row">
        <div className="col-md-8">
          <input
            type="search"
            className="form-control"
            placeholder="Search Blogs"
            onChange={handleChange}
          />
        </div>

        <div className="col-md-4 mb-4">
          <button className="btn btn-block btn-outline-primary" type="submit">
            검색
          </button>
        </div>
      </div>
    </form>
  );

  return (
    <div className="container-fluid">
      <div className="mb-2">{searchForm()}</div>
      {searched && <div>{searchedBlogs(results)}</div>}
    </div>
  );
};

export default Search;
