const { marked } = require("marked");

function markdownToHTML(markdown) {
  return marked.parse(markdown || "");
}

module.exports = { markdownToHTML };
