const { validationResult } = require("express-validator");

exports.runValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Error 422 (Unprocessable Entity): 요청은 잘 만들어졌지만, 문법 오류로 인하여 따를 수 없습니다.
    return res.status(422).json({ error: errors.array()[0].msg });
  }
  next();
};
