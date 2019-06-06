import * as fs from 'fs';
import * as path from 'path';
import * as resolve from 'resolve';
import rucksack from 'rucksack-css';
import autoprefixer from 'autoprefixer';

// 回去解析markdown 语法的文件路径 
const markdownTransformer = path.join(__dirname, '..', 'transformers', 'markdown');

// bixue 的初始化配置
const defaultConfig = {
  port: 8000,
  source: './posts',
  output: './_site',
  theme: './_theme',
  htmlTemplate: path.join(__dirname, '../template.html'),
  transformers: [],
  devServerConfig: {},
  postcssConfig: {
    plugins: [
      rucksack(),
      autoprefixer({
        browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4'],
      }),
    ],
  },
  webpackConfig(config) {
    return config;
  },
  entryName: 'index',
  root: '/',
  filePathMapper(filePath) {
    return filePath;
  },
};

//返回配置信息
module.exports = function getBishengConfig(configFile) {
  // 读取配置文件和并到 config
  const customizedConfig = fs.existsSync(configFile) ? require(configFile) : {};
  const config = Object.assign({}, defaultConfig, customizedConfig);
  // 修正主题文件的路径
  config.theme = resolve.sync(config.theme, { basedir: process.cwd() });
  config.transformers = config.transformers.concat({
    test: /\.md$/,
    use: markdownTransformer,
  }).map(({ test, use }) => ({
    test: test.toString(), // Hack, for we cannot send RegExp to child process
    use,
  }));
  return config;
};
