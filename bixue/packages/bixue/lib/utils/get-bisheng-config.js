"use strict";

var fs = _interopRequireWildcard(require("fs"));

var path = _interopRequireWildcard(require("path"));

var resolve = _interopRequireWildcard(require("resolve"));

var _rucksackCss = _interopRequireDefault(require("rucksack-css"));

var _autoprefixer = _interopRequireDefault(require("autoprefixer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

// 回去解析markdown 语法的文件路径 
var markdownTransformer = path.join(__dirname, '..', 'transformers', 'markdown'); // bixue 的初始化配置

var defaultConfig = {
  port: 8000,
  source: './posts',
  output: './_site',
  theme: './_theme',
  htmlTemplate: path.join(__dirname, '../template.html'),
  transformers: [],
  devServerConfig: {},
  postcssConfig: {
    plugins: [(0, _rucksackCss["default"])(), (0, _autoprefixer["default"])({
      browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4']
    })]
  },
  webpackConfig: function webpackConfig(config) {
    return config;
  },
  entryName: 'index',
  root: '/',
  filePathMapper: function filePathMapper(filePath) {
    return filePath;
  }
}; //返回配置信息

module.exports = function getBishengConfig(configFile) {
  // 读取配置文件和并到 config
  var customizedConfig = fs.existsSync(configFile) ? require(configFile) : {};
  var config = Object.assign({}, defaultConfig, customizedConfig); // 修正主题文件的路径

  config.theme = resolve.sync(config.theme, {
    basedir: process.cwd()
  });
  config.transformers = config.transformers.concat({
    test: /\.md$/,
    use: markdownTransformer
  }).map(function (_ref) {
    var test = _ref.test,
        use = _ref.use;
    return {
      test: test.toString(),
      // Hack, for we cannot send RegExp to child process
      use: use
    };
  });
  return config;
};