"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = updateWebpackConfig;

var _path = _interopRequireDefault(require("path"));

var _webpack = _interopRequireDefault(require("webpack"));

var _miniCssExtractPlugin = _interopRequireDefault(require("mini-css-extract-plugin"));

var _context = _interopRequireDefault(require("../context"));

var _getStyleLoadersConfig = _interopRequireDefault(require("./getStyleLoadersConfig"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var bishengLib = _path["default"].join(__dirname, '..');

var bishengLibLoaders = _path["default"].join(bishengLib, 'loaders');

function updateWebpackConfig(webpackConfig, mode) {
  var bishengConfig = _context["default"].bishengConfig;
  var styleLoadersConfig = (0, _getStyleLoadersConfig["default"])(bishengConfig);
  /* eslint-disable no-param-reassign */

  webpackConfig.entry = {};

  if (_context["default"].isBuild) {
    webpackConfig.output.path = _path["default"].join(process.cwd(), bishengConfig.output);
  }

  webpackConfig.output.publicPath = _context["default"].isBuild ? bishengConfig.root : '/';

  if (mode === 'start') {
    styleLoadersConfig.forEach(function (config) {
      webpackConfig.module.rules.push({
        test: config.test,
        use: ['style-loader'].concat(_toConsumableArray(config.use))
      });
    });
  }

  if (mode === 'build') {
    webpackConfig.output.filename = bishengConfig.hash ? '[name]-[contenthash:8].js' : '[name].js', styleLoadersConfig.forEach(function (config) {
      webpackConfig.module.rules.push({
        test: config.test,
        use: [_miniCssExtractPlugin["default"].loader].concat(_toConsumableArray(config.use))
      });
    });
  }

  webpackConfig.module.rules.push({
    test: function test(filename) {
      return filename === _path["default"].join(bishengLib, 'utils', 'data.js') || filename === _path["default"].join(bishengLib, 'utils', 'ssr-data.js');
    },
    loader: _path["default"].join(bishengLibLoaders, 'bisheng-data-loader')
  });
  /* eslint-enable no-param-reassign */

  var customizedWebpackConfig = bishengConfig.webpackConfig(webpackConfig, _webpack["default"]);

  var entryPath = _path["default"].join(bishengLib, '..', 'tmp', "entry.".concat(bishengConfig.entryName, ".js"));

  if (customizedWebpackConfig.entry[bishengConfig.entryName]) {
    throw new Error("Should not set `webpackConfig.entry.".concat(bishengConfig.entryName, "`!"));
  }

  customizedWebpackConfig.entry[bishengConfig.entryName] = entryPath;
  return customizedWebpackConfig;
}