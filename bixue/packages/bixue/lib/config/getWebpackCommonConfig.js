"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = getWebpackCommonConfig;

var _path = require("path");

var _miniCssExtractPlugin = _interopRequireDefault(require("mini-css-extract-plugin"));

var _caseSensitivePathsWebpackPlugin = _interopRequireDefault(require("case-sensitive-paths-webpack-plugin"));

var _friendlyErrorsWebpackPlugin = _interopRequireDefault(require("friendly-errors-webpack-plugin"));

var _terserWebpackPlugin = _interopRequireDefault(require("terser-webpack-plugin"));

var _webpackbar = _interopRequireDefault(require("webpackbar"));

var _context = _interopRequireDefault(require("../context"));

var _getBabelCommonConfig = _interopRequireDefault(require("./getBabelCommonConfig"));

var _getTSCommonConfig = _interopRequireDefault(require("./getTSCommonConfig"));

var _CleanUpStatsPlugin = _interopRequireDefault(require("../utils/CleanUpStatsPlugin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// 公共webpack 配置
// import webpack from 'webpack';
// 压缩js文件
// 进度
// babel config 
// ts config 
// 自定插件

/* eslint quotes:0 */
function getWebpackCommonConfig() {
  var isBuild = _context["default"].isBuild,
      bishengConfig = _context["default"].bishengConfig;
  var NODE_ENV = process.env.NODE_ENV || 'production';
  var isProd = NODE_ENV === 'production';
  var fileNameHash = "[name]".concat(isProd ? '.[contenthash:6]' : '');
  var chunkFileName = "".concat(fileNameHash, ".js");
  var isHash = isBuild && bishengConfig.hash;
  var cssFileName = isHash ? '[name]-[contenthash:8].css' : '[name].css';
  var babelOptions = (0, _getBabelCommonConfig["default"])();
  var tsOptions = (0, _getTSCommonConfig["default"])();
  return {
    mode: NODE_ENV,
    output: {
      filename: '[name].js',
      chunkFilename: chunkFileName
    },
    resolve: {
      modules: ['node_modules', (0, _path.join)(__dirname, '../../node_modules')],
      extensions: ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.ts', '.tsx', '.js', '.jsx', '.json']
    },
    resolveLoader: {
      modules: ['node_modules', (0, _path.join)(__dirname, '../../node_modules')]
    },
    module: {
      // 忽略 momentjs 提高构建心性能  
      noParse: [/moment.js/],
      rules: [{
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: require.resolve('babel-loader'),
        options: babelOptions
      }, {
        test: /\.tsx?$/,
        use: [{
          loader: require.resolve('babel-loader'),
          options: babelOptions
        }, {
          loader: require.resolve('ts-loader'),
          options: {
            transpileOnly: true,
            compilerOptions: tsOptions
          }
        }]
      }, {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          mimetype: 'application/font-woff'
        }
      }, {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          mimetype: 'application/font-woff'
        }
      }, {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          minetype: 'application/octet-stream'
        }
      }, {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          minetype: 'application/vnd.ms-fontobject'
        }
      }, {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          minetype: 'image/svg+xml'
        }
      }, {
        test: /\.(png|jpg|jpeg|gif)(\?v=\d+\.\d+\.\d+)?$/i,
        loader: 'url-loader',
        options: {
          limit: 10000
        }
      }]
    },
    optimization: {
      minimizer: [new _terserWebpackPlugin["default"]({
        parallel: true,
        cache: true
      })]
    },
    plugins: [new _miniCssExtractPlugin["default"]({
      filename: cssFileName
    }), new _caseSensitivePathsWebpackPlugin["default"](), 
      // new _webpackbar["default"]({
      //   name: '🚚  BiXue',
      //   color: '#2f54eb'
      // }),
     new _friendlyErrorsWebpackPlugin["default"](), new _CleanUpStatsPlugin["default"]()]
  };
}