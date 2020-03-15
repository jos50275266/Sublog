import { useState } from "react";
import { emailContactForm } from "./../../actions/form";

const ContactForm = ({ authorEmail }) => {
  const [values, setValues] = useState({
    message: "",
    name: "",
    email: "",
    sent: false,
    buttonText: "메세지 전송",
    success: false,
    error: false
  });

  const { message, name, email, sent, buttonText, success, error } = values;

  const clickSubmit = e => {
    e.preventDefault();
    setValues({ ...values, buttonText: "메세지 전송중입니다..." });
    console.log("authorEmail:", authorEmail);
    console.log("name:", name);
    console.log("email:", email);
    console.log("message", message);

    emailContactForm({ authorEmail, name, email, message })
      .then(data => {
        console.log(data);
        if (data.error) {
          setValues({ ...values, error: data.error });
        } else {
          setValues({
            ...values,
            sent: true,
            name: "",
            email: "",
            message: "",
            buttonText: "메세지가 성공적으로 전송되었습니다.",
            success: data.success
          });
        }
      })
      .catch(err => console.log(err));
  };

  const handleChange = name => e => {
    setValues({
      ...values,
      [name]: e.target.value,
      error: false,
      success: false,
      buttonText: "메세지 전송"
    });
  };

  const showSuccessMessage = () =>
    success && (
      <div className="alert alert-info">
        Sulog 서비스를 이용해주셔서 감사합니다.
      </div>
    );

  const showErrorMessage = () => (
    <div
      className="alert alert-danger"
      style={{ display: error ? "" : "none" }}
    >
      {error}
    </div>
  );

  const contactForm = () => {
    return (
      <form onSubmit={clickSubmit} className="pb-5">
        <div className="form-group">
          <label className="lead">메세지</label>
          <textarea
            onChange={handleChange("message")}
            type="text"
            className="form-control"
            value={message}
            required
            rows="10"
          ></textarea>
        </div>

        <div className="form-group">
          <label className="lead">이름</label>
          <input
            type="text"
            onChange={handleChange("name")}
            className="form-control"
            value={name}
            required
          />
        </div>

        <div className="form-group">
          <label className="lead">메일</label>
          <input
            type="email"
            onChange={handleChange("email")}
            className="form-control"
            value={email}
            required
          />
        </div>

        <div>
          <button className="btn btn-primary">{buttonText}</button>
        </div>
      </form>
    );
  };

  return (
    <React.Fragment>
      {showSuccessMessage()}
      {showErrorMessage()}
      {contactForm()}
    </React.Fragment>
  );
};

export default ContactForm;
