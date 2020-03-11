const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { User } = require("../models/user");
const { Blog } = require("../models/blog");
const expressJWT = require("express-jwt");
const { errorHandler } = require("../helpers/dbErrorHandler");
const shortId = require("shortid");
dotenv.config();

exports.signup = async (req, res, next) => {
  let newUser = await User.findOne({ email: req.body.email });
  if (newUser)
    return res.status(400).json({ error: "이미 등록된 email 입니다" });

  const { name, email, password } = req.body;
  let username = shortId.generate(); // unique shortId 값 생성
  let profile = `${process.env.CLIENT_URL}/profile/${username}`; // 도메인 이름 생성
  newUser = new User({ name, email, password, profile, username });

  newUser
    .save()
    .then(() =>
      res.status(201).json({ message: "회원가입 성공! 로그인해주세요!" })
    )
    .catch(err => res.status(400).json({ error: err }));
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
