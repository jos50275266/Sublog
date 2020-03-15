import { useState, useEffect } from "react";
import jwt from "jsonwebtoken";
import Layout from "./../../../../components/Layout";
import { withRouter } from "next/router";
import { signup } from "./../../../../actions/auth";

const ActivateAccount = ({ router }) => {
  const [values, setValues] = useState({
    name: "",
    token: "",
    error: "",
    loading: false,
    success: false,
    showButton: true
  });

  const { name, token, error, loading, success, showButton } = values;

  useEffect(() => {
    let token = router.query.id;
    if (token) {
      const { name } = jwt.decode(token);
      setValues({ ...values, name, token });
    }
  }, [router]);

  const clickSubmit = e => {
    e.preventDefault();
    setValues({ ...values, loading: true, error: false });
    signup({ token })
      .then(data => {
        if (data.error) {
          setValues({
            ...values,
            error: data.error,
            loading: false,
            showButton: false
          });
        } else {
          setValues({
            ...values,
            loading: false,
            success: true,
            showButton: false
          });
        }
      })
      .catch(err => console.log(err));
  };

  const showLoading = () => (loading ? <h2>Loading...</h2> : "");

  return (
    <Layout>
      <div className="container">
        <h3 className="pb-4">안녕하세요 {name} 님, 계정을 활성화해주세요...</h3>
        {showLoading()}
        {error && error}
        {success && "성공적으로 계정이 활성화되었습니다. 로그인해주세요!"}
        {showButton && (
          <button className="btn btn-outline-primary" onClick={clickSubmit}>
            계정 활성화
          </button>
        )}
      </div>
    </Layout>
  );
};

export default withRouter(ActivateAccount);
