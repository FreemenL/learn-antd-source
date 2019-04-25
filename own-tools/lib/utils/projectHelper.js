const path = require('path');

const cwd = process.cwd();


//以当前工作目录为基准获取文件路径
function getProjectPath(...filePath) {
  return path.join(cwd, ...filePath);
}

function resolve(moduleName) {
  return require.resolve(moduleName);
}

// We need hack the require to ensure use package module first
// For example, `typescript` is required by `gulp-typescript` but provided by `antd`

// 如果当前包的目录里面没有所需依赖 统一到最外层的node_modules 目录下读取 
let injected = false;
function injectRequire() {
  if (injected) return;
  const Module = require('module');
  const oriRequire = Module.prototype.require;
  Module.prototype.require = function(...args) {
    const moduleName = args[0];
    try {
      return oriRequire.apply(this, args);
    } catch (err) {
      const newArgs = [...args];
      if (moduleName[0] !== '/') {
        newArgs[0] = getProjectPath('node_modules', moduleName);
      }
      return oriRequire.apply(this, newArgs);
    }
  };
  injected = true;
}

module.exports = {
  getProjectPath,
  resolve,
  injectRequire,
};
