'use strict';

const fs = require('fs');
const assign = require('object-assign');
const path = require('path');
const cwd = process.cwd();


//以当前工作目录为基准获取文件路径
function getProjectPath(...filePath) {
  return path.join(cwd, ...filePath);
}

module.exports = function() {
  let my = {};
  //读取项目中ts配置文件
  if (fs.existsSync(getProjectPath('tsconfig.json'))) {
    my = require(getProjectPath('tsconfig.json'));
  }
  // 合并默认默认配置 和 当前项目中的配置;
  return assign(
    {
      // 若有未使用的参数则抛错
      noUnusedParameters: true,
      //若有未使用的局部变量则抛错
      noUnusedLocals: true,
      //在严格的 null检查模式下， null和 undefined值不包含在任何类型里，只允许用它们自己和 any来赋值（有个例外， undefined可以赋值到 void
      strictNullChecks: true,
      // 指定生成哪个模块系统代码
      target: 'es6',
      // TypeScript具有三种JSX模式：preserve，react和react-native。 这些模式只在代码生成阶段起作用 - 类型检查并不受影响。 在preserve模式下生成代码中会保留JSX以供后续的转换操作使用（比如：Babel）
      jsx: 'preserve',
      //决定如何处理模块。或者是"Node"对于Node.js/io.js，或者是"Classic"（默认）。查看模块解析了解详情
      moduleResolution: 'node',
      // 生成相应的 .d.ts文件
      declaration: true,
      //允许从没有设置默认导出的模块中默认导入。这并不影响代码的输出，仅为了类型检查。
      allowSyntheticDefaultImports: true,
    },
    my.compilerOptions
  );
};
