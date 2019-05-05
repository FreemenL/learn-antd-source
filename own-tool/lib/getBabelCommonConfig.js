const { resolve } = require('./utils/projectHelper');

module.exports = function(modules) {
  const plugins = [
    //添加了将import文件内容用作DataURI 的机会
     
    resolve('babel-plugin-inline-import-data-uri'),
    // 确保在属性访问中引用保留字 
    resolve('@babel/plugin-transform-member-expression-literals'),
    // Object.assign 的兼容处理 
    resolve('@babel/plugin-transform-object-assign'),
    // 确保在对象属性键中引用保留字
    resolve('@babel/plugin-transform-property-literals'),
    [
      // 外部引用辅助函数和内置函数，自动填充代码而不会污染全局变量
      resolve('@babel/plugin-transform-runtime'),
      {
        helpers: false,
      },
    ],
    // 处理es6 展开符 
    resolve('@babel/plugin-transform-spread'),
    // 处理es6 模板字符串
    resolve('@babel/plugin-transform-template-literals'),
    // 编译导出默认为ES2015
    resolve('@babel/plugin-proposal-export-default-from'),
    // 将导出命名空间编译为ES2015
    resolve('@babel/plugin-proposal-export-namespace-from'),
    // 处理对象中的展开符
    resolve('@babel/plugin-proposal-object-rest-spread'),
    [
      // 将类和对象装饰器编译为ES5
      resolve('@babel/plugin-proposal-decorators'),
      {
        legacy: true,
      },
    ],
    //此插件转换静态类属性以及使用属性初始化程序语法声明的属性
    resolve('@babel/plugin-proposal-class-properties'),
  ];
  return {
    presets: [
      // 解析ts 语法
      resolve('@babel/preset-typescript'),
      //react class 及jsx 语法的处理
      resolve('@babel/preset-react'),
      [
        //智能预设 处理poly-fill 和兼容问题
        resolve('@babel/preset-env'),
        {
          modules,
          targets:{
            //poly-fill 要兼容的浏览器 会直接影响编译后包的大小
            browsers: [
              'last 2 versions',
              'Firefox ESR',
              '> 1%',
              'ie >= 9',
              'iOS >= 8',
              'Android >= 4',
            ],
          },
        },
      ],
    ],
    plugins,
  };
};
