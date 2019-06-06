// 解析 markdown 语法
const markTwain = require('mark-twain');
const { toUriPath } = require('../utils/escape-win-path');

// 返回格式化后的 markdown 语法
module.exports = function (filename, fileContent) {
  const markdown = markTwain(fileContent);
  markdown.meta.filename = toUriPath(filename);
  return markdown;
};
