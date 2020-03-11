import { stateToHTML } from "draft-js-export-html";
import { convertFromRaw } from "draft-js";

const convertFromJSONToHTML = text => {
  try {
    // console.log("Hello", JSON.parse(text));
    // console.log(stateToHTML(convertFromRaw(JSON.parse(text))));
    return { __html: stateToHTML(convertFromRaw(JSON.parse(text))) };
  } catch (exp) {
    console.log(exp);
    return { __html: "Error" };
  }
};

module.exports = {
  convertFromJSONToHTML
};
