'use strict';
//babel-plugin 的方式 转换导入导出路径  处理类似如下语法

// import ... from  '...';
// export { default as Badge } from './badge';

const { dirname } = require('path');
const fs = require('fs');
const { getProjectPath } = require('./utils/projectHelper');

function replacePath(path) {
  if (path.node.source && /\/lib\//.test(path.node.source.value)) {
    const esModule = path.node.source.value.replace('/lib/', '/es/');
    const esPath = dirname(getProjectPath('node_modules', esModule));
    if (fs.existsSync(esPath)) {
      path.node.source.value = esModule;
    }
  }
}

function replaceLib() {
  return {
    visitor: {
      ImportDeclaration: replacePath,
      ExportNamedDeclaration: replacePath,
    },
  };
}

module.exports = replaceLib;
