"use strict";

var _getWebpackCommonConfig = _interopRequireDefault(require("./config/getWebpackCommonConfig"));

var _updateWebpackConfig = _interopRequireDefault(require("./config/updateWebpackConfig"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//源码里面的 openBrowser 用的是 react-dev-utils 里面打开浏览器的方式  此处我们直接把 react-dev-utils/openBrowser 这个模块的代码抽离出来 单独引用  并添加注释
var openBrowser = require("./utils/openBrowser");

var fs = require('fs');

var path = require('path'); //创建文件夹


var mkdirp = require('mkdirp'); // nunjucks是Mozilla开发的一个纯JavaScript编写的模板引擎 ，语法与Python的模板引擎jinja2类似


var nunjucks = require('nunjucks');

var webpack = require('webpack');

var WebpackDevServer = require('webpack-dev-server'); // 适用于JavaScript程序的实用函数库


var R = require('ramda'); // 用github 部署静态页面


var ghPages = require('gh-pages');

var _require = require('./utils/escape-win-path'),
    escapeWinPath = _require.escapeWinPath;

var getBishengConfig = require('./utils/get-bisheng-config');

var sourceData = require('./utils/source-data');

var generateFilesPath = require('./utils/generate-files-path');

var getThemeConfig = require('./utils/get-theme-config');

var context = require('./context');

var Module = require('module'); // We need to inject the require logic to support use origin node_modules
// if currently not provided.
//修改 require 方法的方式 逻辑为如果当前node_module 中没找到依赖 就去工作目录中找


var oriRequire = Module.prototype.require;

Module.prototype.require = function () {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var moduleName = args[0];

  try {
    return oriRequire.apply(this, args);
  } catch (err) {
    var newArgs = [].concat(args);

    if (moduleName[0] !== '/') {
      newArgs[0] = path.join(process.cwd(), 'node_modules', moduleName);
    }

    return oriRequire.apply(this, newArgs);
  }
}; // 创建 模版文件路径


var tmpDirPath = path.join(__dirname, '..', 'tmp');
mkdirp.sync(tmpDirPath); //

function getRoutesPath(themePath, configEntryName) {
  // router 模版字符串
  var routesTemplate = fs.readFileSync(path.join(__dirname, 'routes.nunjucks.js')).toString();
  var routesPath = path.join(tmpDirPath, "routes.".concat(configEntryName, ".js")); // 之前修改的上下文

  var bishengConfig = context.bishengConfig,
      themeConfig = context.themeConfig; // 在模版文件路径以nunjucks写入routes.index.js

  fs.writeFileSync(routesPath, nunjucks.renderString(routesTemplate, {
    themePath: escapeWinPath(themePath),
    themeConfig: JSON.stringify(bishengConfig.themeConfig),
    themeRoutes: JSON.stringify(themeConfig.routes)
  }));
  return routesPath;
}

function generateEntryFile(configTheme, configEntryName, root) {
  // entry.nunjucks.js  作为string 引入
  var entryTemplate = fs.readFileSync(path.join(__dirname, 'entry.nunjucks.js')).toString(); // 入口文件路径

  var entryPath = path.join(tmpDirPath, "entry.".concat(configEntryName, ".js")); // 在获取路由的路径之前先写入router 的模版js文件

  var routesPath = getRoutesPath(path.dirname(configTheme), configEntryName); // 在模版文件路径中写入入口文件

  fs.writeFileSync(entryPath, nunjucks.renderString(entryTemplate, {
    routesPath: escapeWinPath(routesPath),
    root: escapeWinPath(root)
  }));
}
/** 
 *  program 为命令行 接受的参数
*/


exports.start = function start(program) {
  //获取配置文件
  var configFile = path.join(process.cwd(), program.config || 'bisheng.config.js'); // 获取配置对象

  var bishengConfig = getBishengConfig(configFile); // 获取主题配置

  var themeConfig = getThemeConfig(bishengConfig.theme); //在上下文中导出 bishengConfig 和 themeConfig 

  context.initialize({
    bishengConfig: bishengConfig,
    themeConfig: themeConfig
  }); //创建输出的文件夹

  mkdirp.sync(bishengConfig.output); // 以字符串的方式 读取模版html文件

  var template = fs.readFileSync(bishengConfig.htmlTemplate).toString(); // dev manifest
  //dev manifest 文件

  var manifest = {
    js: ["".concat(bishengConfig.entryName, ".js")],
    // inject style    nikeshope
    css: []
  };
  var templateData = Object.assign({
    root: '/',
    manifest: manifest
  }, bishengConfig.htmlTemplateExtraData || {});
  var templatePath = path.join(process.cwd(), bishengConfig.output, 'index.html'); // 把模版数据写入模版文件并输出到 output 

  fs.writeFileSync(templatePath, nunjucks.renderString(template, templateData)); // 生成入口文件和路由文件

  generateEntryFile(bishengConfig.theme, bishengConfig.entryName, '/');
  var webpackConfig = (0, _updateWebpackConfig["default"])((0, _getWebpackCommonConfig["default"])(), 'start');
  webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());

  var serverOptions = _objectSpread({
    quiet: true,
    hot: true
  }, bishengConfig.devServerConfig, {
    contentBase: path.join(process.cwd(), bishengConfig.output),
    historyApiFallback: true,
    host: 'localhost'
  });

  console.log(webpackConfig); // 启用webpack的热加载

  WebpackDevServer.addDevServerEntrypoints(webpackConfig, serverOptions);
  var compiler = webpack(webpackConfig); // Ref: https://github.com/pigcan/blog/issues/6
  // Webpack startup recompilation fix. Remove when @sokra fixes the bug.
  // https://github.com/webpack/webpack/issues/2983
  // https://github.com/webpack/watchpack/issues/25

  var timefix = 11000;
  compiler.plugin('watch-run', function (watching, callback) {
    watching.startTime += timefix;
    callback();
  });
  compiler.plugin('done', function (stats) {
    stats.startTime -= timefix;
  }); //https://webpack.js.org/guides/hot-module-replacement/#via-the-nodejs-api

  var server = new WebpackDevServer(compiler, serverOptions);
  server.listen(bishengConfig.port, '0.0.0.0', function () {
    return openBrowser("http://localhost:".concat(bishengConfig.port));
  });
}; // const ssrTemplate = fs
//   .readFileSync(path.join(__dirname, 'ssr.nunjucks.js'))
//   .toString();


function filenameToUrl(filename) {
  if (filename.endsWith('index.html')) {
    return filename.replace(/index\.html$/, '');
  }

  return filename.replace(/\.html$/, '');
} // hash { js: ['index-{hash}.js', ...], css: [ 'index.{hash}-{chunkId}.css' ] }
// no hash // { js: ['index.js', ...], css: [ 'index.{chunkId}.css' ] }


function getManifest(compilation) {
  var manifest = {};
  compilation.entrypoints.forEach(function (entrypoint, name) {
    var js = [];
    var css = [];
    var initials = new Set();
    var chunks = entrypoint.chunks; // Walk main chunks

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = chunks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var chunk = _step.value;
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = chunk.files[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var file = _step2.value;

            if (!initials.has(file)) {
              initials.add(file); // Get extname

              var ext = path.extname(file).toLowerCase();

              if (file) {
                // Type classification
                switch (ext) {
                  case '.js':
                    js.push(file);
                    break;

                  case '.css':
                    css.push(file);
                    break;

                  default:
                    break;
                }
              }
            }
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
              _iterator2["return"]();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"] != null) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    manifest[name] = {
      js: js,
      css: css
    };
  });
  return manifest;
}

exports.build = function build(program, callback) {
  var configFile = path.join(process.cwd(), program.config || 'bisheng.config.js'); // 获取配置对象

  var bishengConfig = getBishengConfig(configFile);
  var themeConfig = getThemeConfig(bishengConfig.theme);
  context.initialize({
    bishengConfig: bishengConfig,
    themeConfig: themeConfig,
    isBuild: true
  });
  mkdirp.sync(bishengConfig.output);
  var entryName = bishengConfig.entryName;
  generateEntryFile(bishengConfig.theme, entryName, bishengConfig.root);
  var webpackConfig = (0, _updateWebpackConfig["default"])((0, _getWebpackCommonConfig["default"])(), 'build');
  webpackConfig.plugins.push(new webpack.LoaderOptionsPlugin({
    minimize: true
  }));
  webpackConfig.plugins.push(new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
  }));
  var ssrWebpackConfig = Object.assign({}, webpackConfig);
  var ssrPath = path.join(tmpDirPath, "ssr.".concat(entryName, ".js"));
  var routesPath = getRoutesPath(path.dirname(bishengConfig.theme), entryName);
  fs.writeFileSync(ssrPath, nunjucks.renderString(ssrTemplate, {
    routesPath: escapeWinPath(routesPath)
  }));
  ssrWebpackConfig.entry = _defineProperty({}, "".concat(entryName, "-ssr"), ssrPath);
  ssrWebpackConfig.target = 'node';
  ssrWebpackConfig.output = Object.assign({}, ssrWebpackConfig.output, {
    filename: '[name].js',
    path: tmpDirPath,
    library: 'ssr',
    libraryTarget: 'commonjs'
  });
  webpack(webpackConfig, function (err, stats) {
    if (err !== null) {
      return console.error(err);
    }

    if (stats.hasErrors()) {
      console.log(stats.toString('errors-only'));
      return;
    }

    var manifest = getManifest(stats.compilation)[bishengConfig.entryName];
    var markdown = sourceData.generate(bishengConfig.source, bishengConfig.transformers);
    var filesNeedCreated = generateFilesPath(themeConfig.routes, markdown).map(bishengConfig.filePathMapper);
    filesNeedCreated = R.unnest(filesNeedCreated);
    var template = fs.readFileSync(bishengConfig.htmlTemplate).toString();

    if (!program.ssr) {
      require('./loaders/common/boss').jobDone();

      var templateData = Object.assign({
        root: bishengConfig.root,
        hash: bishengConfig.hash,
        manifest: manifest
      }, bishengConfig.htmlTemplateExtraData || {});
      var fileContent = nunjucks.renderString(template, templateData);
      filesNeedCreated.forEach(function (file) {
        var output = path.join(bishengConfig.output, file);
        mkdirp.sync(path.dirname(output));
        fs.writeFileSync(output, fileContent);
        console.log('Created: ', output);
      });

      if (callback) {
        callback();
      }

      return;
    }

    context.turnOnSSRFlag(); // If we can build webpackConfig without errors, we can build ssrWebpackConfig without errors.
    // Because ssrWebpackConfig are just part of webpackConfig.

    webpack(ssrWebpackConfig, function (ssrBuildErr, ssrBuildStats) {
      if (ssrBuildErr) throw ssrBuildErr;
      if (ssrBuildStats.hasErrors()) throw ssrBuildStats.toString('errors-only');

      require('./loaders/common/boss').jobDone();

      var _require2 = require(path.join(tmpDirPath, "".concat(entryName, "-ssr"))),
          ssr = _require2.ssr;

      var fileCreatedPromises = filesNeedCreated.map(function (file) {
        var output = path.join(bishengConfig.output, file);
        mkdirp.sync(path.dirname(output));
        return new Promise(function (resolve) {
          ssr(filenameToUrl(file), function (error, content) {
            if (error) {
              console.error(error);
              process.exit(1);
            }

            var templateData = Object.assign({
              root: bishengConfig.root,
              content: content,
              hash: bishengConfig.hash,
              manifest: manifest
            }, bishengConfig.htmlTemplateExtraData || {});
            var fileContent = nunjucks.renderString(template, templateData);
            fs.writeFileSync(output, fileContent);
            console.log('Created: ', output);
            resolve();
          });
        });
      });
      Promise.all(fileCreatedPromises).then(function () {
        if (callback) {
          callback();
        }
      });
    });
  });
};

function pushToGhPages(basePath, config) {
  var options = _objectSpread({}, config, {
    depth: 1,
    logger: function logger(message) {
      console.log(message);
    }
  });

  if (process.env.RUN_ENV_USER) {
    options.user = {
      name: process.env.RUN_ENV_USER,
      email: process.env.RUN_ENV_EMAIL
    };
  }

  ghPages.publish(basePath, options, function (err) {
    if (err) {
      throw err;
    }

    console.log('Site has been published!');
  });
}

exports.deploy = function deploy(program) {
  var config = {
    remote: program.remote,
    branch: program.branch
  };

  if (program.pushOnly) {
    var output = typeof program.pushOnly === 'string' ? program.pushOnly : './_site';
    var basePath = path.join(process.cwd(), output);
    pushToGhPages(basePath, config);
  } else {
    var configFile = path.join(process.cwd(), program.config || 'bisheng.config.js');
    var bishengConfig = getBishengConfig(configFile);

    var _basePath = path.join(process.cwd(), bishengConfig.output);

    exports.build(program, function () {
      return pushToGhPages(_basePath, config);
    });
  }
};