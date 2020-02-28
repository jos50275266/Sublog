const { check } = require("express-validator");

exports.userSignupValidator = [
  check("name")
    .not()
    .isEmpty()
    .withMessage("반드시 이름을 입력해주세요"),
  check("email")
    .isEmail()
    .withMessage("알맞은 이메일 형식으로 작성해주세요"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("비밀번호는 6 글자 이상 이어야합니다.")
];

exports.userSigninValidator = [
    check("email")
        .isEmail()
        .withMessage("알맞은 이메일은 입력해주세요!"),
    check("password")
        .isLength({min: 6})
        .withMessage("비밀번호는 6 글자 이상이어야 합니다.")
]