"use strict";

// 解析 markdown 语法
var markTwain = require('mark-twain');

var _require = require('../utils/escape-win-path'),
    toUriPath = _require.toUriPath; // 返回格式化后的 markdown 语法


module.exports = function (filename, fileContent) {
  var markdown = markTwain(fileContent);
  markdown.meta.filename = toUriPath(filename);
  return markdown;
};