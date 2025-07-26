const marked = require("marked");

function parseMarkdown(md) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Project Page</title>
  <link rel="stylesheet" href="/assets/css/style.css">
</head>
<body>
  ${marked.parse(md || "")}
</body>
</html>
`;
}

module.exports = { parseMarkdown };
