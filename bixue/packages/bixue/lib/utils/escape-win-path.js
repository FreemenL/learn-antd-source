"use strict";

// require('D:\ant-design') will throw a module not found error need to escape `\` to `\\`.
// Note that this is only required when you persist code to file
// 路径添加 /
function escapeWinPath(path) {
  return path.replace(/\\/g, '\\\\');
} //路径删除 /


function toUriPath(path) {
  return path.replace(/\\/g, '/');
}

module.exports = {
  escapeWinPath: escapeWinPath,
  toUriPath: toUriPath
};