import { useState, useEffect } from "react";
import { getCookie } from "../../actions/authHelpers";
import { isAuth, updateUser } from "../../actions/auth";
import { getProfile, update } from "../../actions/user";
import { API } from "../../config";

const ProfileUpdate = () => {
  const [values, setValues] = useState({
    username: "",
    username_for_photo: "",
    name: "",
    email: "",
    about: "",
    password: "",
    error: false,
    success: false,
    loading: false,
    photo: "",
    userData: process.browser && new FormData()
  });

  const token = getCookie("token");
  const {
    username,
    username_for_photo,
    name,
    email,
    about,
    password,
    error,
    success,
    loading,
    photo,
    userData
  } = values;

  const init = () => {
    getProfile(token)
      .then(data => {
        if (data.error) {
          setValues({ ...values, error: data.error });
        } else {
          setValues({
            ...values,
            username: data.username,
            username_for_photo: data.username,
            name: data.name,
            email: data.email,
            about: data.about
          });
        }
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    init();
    setValues({ ...values, userData: new FormData() });
  }, []);

  const handleChange = name => e => {
    // console.log(e.target.value);
    const value = name === "photo" ? e.target.files[0] : e.target.value;
    // let userData = new FormData();
    userData.set(name, value);
    console.log(...userData); // SEE THE FORMDATA IN CONSOLE
    setValues({
      ...values,
      [name]: value,
      userData,
      error: false,
      success: false
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setValues({ ...values, loading: true });
    update(token, userData)
      .then(data => {
        if (data.error) {
          console.log("data.error", data.error);
        } else {
          updateUser(data, () => {
            setValues({
              ...values,
              username: data.username,
              name: data.name,
              email: data.email,
              about: data.about,
              password: "",
              success: true,
              loading: false
            });
          });
        }
      })
      .catch(err => console.log(err));
  };

  const profileUpdateForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="btn btn-outline-info">
          프로필 사진
          <input
            onChange={handleChange("photo")}
            type="file"
            accept="image/*"
            hidden
          />
        </label>
      </div>
      <div className="form-group">
        <label className="text-muted">사용자 이름</label>
        <input
          onChange={handleChange("username")}
          type="text"
          value={username}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label className="text-muted">이름</label>
        <input
          onChange={handleChange("name")}
          type="text"
          value={name}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label className="text-muted">About</label>
        <textarea
          onChange={handleChange("about")}
          type="text"
          value={about}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label className="text-muted">비밀번호</label>
        <input
          onChange={handleChange("password")}
          type="password"
          value={password}
          className="form-control"
        />
      </div>
      <div>
        {showSuccess()}
        {showError()}
        {showLoading()}
      </div>
      <div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!username || !name || !email}
        >
          업데이트
        </button>
      </div>
    </form>
  );

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
      Profile updated
    </div>
  );

  const showLoading = () => (
    <div
      className="alert alert-info"
      style={{ display: loading ? "" : "none" }}
    >
      Loading...
    </div>
  );

  return (
    <React.Fragment>
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <img
              src={`${API}/user/photo/${username_for_photo}`}
              className="img img-fluid img-thumbnail mb-3"
              style={{ maxHeight: "auto", maxWidth: "100%" }}
              alt="user profile"
            />
          </div>
          <div className="col-md-8 mb-5">{profileUpdateForm()}</div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ProfileUpdate;
