exports.smartTrim = (str, length, delim, appendix) => {
  if (str.length <= length) return str;

  let trimmedStr = str.substr(0, length + delim.length);

  let lastDelimIndex = trimmedStr.lastIndexOf(delim);
  if (lastDelimIndex >= 0) trimmedStr = trimmedStr.substr(0, lastDelimIndex);
  // 글자가 length 보다 길어도 띄어쓰기 전까지만 출력하는 조건문

  if (trimmedStr) trimmedStr += appendix;
  return trimmedStr;
};

// hello world
// hello wor ...
