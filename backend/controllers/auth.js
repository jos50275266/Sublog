const _ = require("lodash");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { User } = require("../models/user");
const { Blog } = require("../models/blog");
const jwt = require("jsonwebtoken");
const expressJWT = require("express-jwt");
const { errorHandler } = require("../helpers/dbErrorHandler");
const shortId = require("shortid");
const { OAuth2Client } = require("google-auth-library");
dotenv.config();

// sendGrid
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.preSignup = (req, res) => {
  const { name, email, password } = req.body;
  User.findOne({ email: email.toLowerCase() })
    .then(user => {
      console.log(user);
      if (user) {
        return res.status(400).json({
          error: "이미 등록된 이메일입니다..."
        });
      }

      const token = jwt.sign(
        { name, email, password },
        process.env.JWT_ACCOUNT_ACTIVATION,
        {
          expiresIn: "1d"
        }
      );

      const emailData = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: `계정 활성화 링크`,
        html: `
          <p>계정 활성화 링크입니다! (10 분 안에 새로 설정해주세요!):</p>
          <p>${process.env.CLIENT_URL}/auth/account/activate/${token}</p>
          <hr />
          <p>This email may contain sensetive information</p>
          <p>https://www.sulog.com</p>
      `
      };

      sgMail.send(emailData).then(sent => {
        return res.json({
          message: `새 계정 설정 절차가 ${email}로 전송되었습니다... (해당 링크는 10분 후에 만료됩니다...) 지침에 따라 새 계정을 설정해주세요! `
        });
      });
    })
    .catch(err => {
      return res.status(401).json({ error: errorHandler(err) });
    });
};

exports.signup = async (req, res, next) => {
  const token = req.body.token;
  if (token) {
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function(
      err,
      decoded
    ) {
      if (err) {
        return res.status(401).json({
          error: "만료된 링크, 다시 회원가입해주세요!"
        });
      }

      const { name, email, password } = jwt.decode(token);

      let username = shortId.generate();
      let profile = `${process.env.CLIENT_URL}/profile/${username}`;

      const user = new User({ name, email, password, profile, username });
      user
        .save()
        .then(data => {
          return res.json({ message: "회원가입성공! 로그인해주세요!" });
        })
        .catch(err => {
          return res.status(401).json({ error: errorHandler(err) });
        });
    });
  } else {
    return res.json({
      message: "오류가 발생했습니다. 다시 시도해주세요!"
    });
  }

  // let newUser = await User.findOne({ email: req.body.email });
  // if (newUser)
  //   return res.status(400).json({ error: "이미 등록된 email 입니다" });

  // const { name, email, password } = req.body;
  // let username = shortId.generate(); // unique shortId 값 생성
  // let profile = `${process.env.CLIENT_URL}/profile/${username}`; // 도메인 이름 생성
  // newUser = new User({ name, email, password, profile, username });

  // newUser
  //   .save()
  //   .then(() =>
  //     res.status(201).json({ message: "회원가입 성공! 로그인해주세요!" })
  //   )
  //   .catch(err => res.status(400).json({ error: err }));
};

exports.signin = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({ error: "등록되지않은 계정 입니다." });
  }

  // Authenticate
  if (!user.authenticate(req.body.password)) {
    return res
      .status(401)
      .json({ error: "해당 이메일과 입력하신 비밀번호가 일치하지않습니다." });
  }

  // 민감한 정보를 보내지 않기 위해서.
  const { _id, username, name, email, role } = user;

  const token = user.generateAuthToken();

  res.cookie("token", token, { expiresIn: "1d" });

  return res.status(200).json({
    token,
    user: { _id, username, name, email, role }
  });
};

exports.logout = (req, res, next) => {
  res.clearCookie("token");
  res.status(200).json({
    message: "로그아웃 되었습니다."
  });
};

exports.requireSignin = expressJWT({
  secret: process.env.JWT_SECRET
});

// Authorization: Bearer <token ...>

exports.authMiddleware = (req, res, next) => {
  const authUserId = req.user._id;
  User.findById({ _id: authUserId })
    .then(user => {
      req.profile = user;
      next();
    })
    .catch(err => {
      return res.status(400).json({ error: "사용자를 찾지 못했습니다..." });
    });
};

exports.adminMiddleware = (req, res, next) => {
  const adminUserId = req.user._id;
  User.findById({ _id: adminUserId })
    .then(user => {
      if (!user) {
        return res.status(400).json({
          error: "관리자를 찾지 못했습니다..."
        });
      }

      if (user.role !== 1) {
        return res.status(400).json({
          error: "관리자 권한의 사용자만 접근할 수 있습니다..."
        });
      }

      req.profile = user;
      next();
    })
    .catch(err => {
      return res.status(400).json({
        error: "관리자를 찾지 못했습니다..."
      });
    });
};

exports.canUpdateDeleteBlog = (req, res, next) => {
  const slug = req.params.slug.toLowerCase();
  Blog.findOne({ slug })
    .then(data => {
      let authorizedUser =
        data.postedBy._id.toString() === req.profile._id.toString();
      if (!authorizedUser) {
        return res.status(400).json({
          error: "해당 글에 권한이 없습니다..."
        });
      }
      next();
    })
    .catch(err => {
      return res.status(400).json({ error: errorHandler(err) });
    });
};

exports.forgotPassword = (req, res) => {
  const { email } = req.body;

  User.findOne({ email })
    .then(user => {
      const token = jwt.sign(
        { _id: user._id },
        process.env.JWT_RESET_PASSWORD,
        {
          expiresIn: "10m"
        }
      );

      const emailData = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: `새 비밀번호 설정 링크`,
        html: `
        <p>새 비밀번호 설정 링크 입니다 (10 분 안에 새로 설정해주세요!):</p>
        <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
        <hr />
        <p>This email may contain sensetive information</p>
        <p>https://www.sulog.com</p>
    `
      };

      // populating the db > user > resetPasswordLink
      return user
        .updateOne({ resetPasswordLink: token })
        .then(success => {
          sgMail
            .send(emailData)
            .then(sent => {
              return res.json({
                message: `새 비밀번호 설정 절차가 ${email}로 전송되었습니다... (해당 링크는 10분 후에 만료됩니다...) 지침에 따라 새 비밀번호를 설정해주세요! `
              });
            })
            .catch(err => console.log(err));
        })
        .catch(err => {
          return res.json({ error: errorHandler(err) });
        });
    })
    .catch(err => {
      return res.status(401).json({
        error: "해당 이메일의 사용자가 존재하지않습니다."
      });
    });
};

exports.resetPassword = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;

  if (resetPasswordLink) {
    jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, function(
      err,
      decoded
    ) {
      if (err) {
        return res.status(401).json({
          error: "만료된 링크입니다, 다시 설정 절차를 따라주세요!..."
        });
      }

      User.findOne({ resetPasswordLink })
        .then(user => {
          const updatedFields = {
            password: newPassword,
            resetPasswordLink: ""
          };

          user = _.extend(user, updatedFields);

          user
            .save()
            .then(result => {
              return res.json({
                message: `새 비밀번호 설정 성공! 다시 로그인주세요!`
              });
            })
            .catch(err => {
              return res.status(400).json({
                error: errorHandler(err)
              });
            });
        })
        .catch(err => {
          return res.status(401).json({
            error: "문제가 발생했습니다, 다시 설정 절차를 따라주세요!..."
          });
        });
    });
  }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
exports.googleLogin = (req, res) => {
  const idToken = req.body.tokenId;
  client
    .verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID })
    .then(response => {
      // console.log(response);
      const { email_verified, name, email, jti } = response.payload;
      if (email_verified) {
        User.findOne({ email })
          .then(user => {
            if (user) {
              // console.log(user)
              const token = user.generateAuthToken();
              res.cookie("token", token, { expiresIn: "1d" });
              const { _id, email, name, role, username } = user;
              return res.json({
                token,
                user: { _id, email, name, role, username }
              });
            } else {
              let username = shortId.generate();
              let profile = `${process.env.CLIENT_URL}/profile/${username}`;
              // for further security
              // let password = jti + process.env.JWT_SECRET
              let password = jti;
              user = new User({ name, email, profile, username, password });
              user
                .save()
                .then(data => {
                  const token = data.generateAuthToken();
                  res.cookie("token", token, { expiresIn: "1d" });
                  const { _id, email, name, role, username } = data;
                  return res.json({
                    token,
                    user: { _id, email, name, role, username }
                  });
                })
                .catch(err => {
                  return res.status(401).json({
                    error: errorHandler(err)
                  });
                });
            }
          })
          .catch(err => {
            return res.status(400).json({
              error: "구글 로그인 실패. 다시 시도해주세요."
            });
          });
      }
    });
};
