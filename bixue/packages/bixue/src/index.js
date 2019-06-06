// todo : 
//1 检查单独使用 react-dev-utils 里面的方法 和引用整个包 是存在编译后大小的改变

// 这里要说下 import 和 require 的区别 
// import 语法虽然遵循的是es6 的模块化  但是 用babel 编译完的结果仍然是 require
// 但是有一个细节的地方值得注意  import的语法babel编译后存在提升的效果 import的语法会先执行



import getWebpackCommonConfig from './config/getWebpackCommonConfig';
import updateWebpackConfig from './config/updateWebpackConfig';

//源码里面的 openBrowser 用的是 react-dev-utils 里面打开浏览器的方式  此处我们直接把 react-dev-utils/openBrowser 这个模块的代码抽离出来 单独引用  并添加注释
const openBrowser  = require("./utils/openBrowser");
const fs = require('fs');
const path = require('path');

//创建文件夹
const mkdirp = require('mkdirp');
// nunjucks是Mozilla开发的一个纯JavaScript编写的模板引擎 ，语法与Python的模板引擎jinja2类似
const nunjucks = require('nunjucks');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
// 适用于JavaScript程序的实用函数库
const R = require('ramda');
// 用github 部署静态页面
const ghPages = require('gh-pages');
const { escapeWinPath } = require('./utils/escape-win-path');
const getBishengConfig = require('./utils/get-bisheng-config');
const sourceData = require('./utils/source-data');
const generateFilesPath = require('./utils/generate-files-path');
const getThemeConfig = require('./utils/get-theme-config');
const context = require('./context');
const Module = require('module');

// We need to inject the require logic to support use origin node_modules
// if currently not provided.

//修改 require 方法的方式 逻辑为如果当前node_module 中没找到依赖 就去工作目录中找
const oriRequire = Module.prototype.require;
Module.prototype.require = function (...args) {
  const moduleName = args[0];
  try {
    return oriRequire.apply(this, args);
  } catch (err) {
    const newArgs = [...args];
    if (moduleName[0] !== '/') {
      newArgs[0] = path.join(process.cwd(), 'node_modules', moduleName);
    }
    return oriRequire.apply(this, newArgs);
  }
};

// 创建 模版文件路径
const tmpDirPath = path.join(__dirname, '..', 'tmp');
mkdirp.sync(tmpDirPath);

//
function getRoutesPath(themePath, configEntryName) {
  // router 模版字符串
  const routesTemplate = fs.readFileSync(path.join(__dirname, 'routes.nunjucks.js')).toString();
  const routesPath = path.join(tmpDirPath, `routes.${configEntryName}.js`);
  // 之前修改的上下文
  const { bishengConfig, themeConfig } = context;
  // 在模版文件路径以nunjucks写入routes.index.js
  fs.writeFileSync(
    routesPath,
    nunjucks.renderString(routesTemplate, {
      themePath: escapeWinPath(themePath),
      themeConfig: JSON.stringify(bishengConfig.themeConfig),
      themeRoutes: JSON.stringify(themeConfig.routes),
    }),
  );
  return routesPath;
}

function generateEntryFile(configTheme, configEntryName, root) {
  // entry.nunjucks.js  作为string 引入
  const entryTemplate = fs.readFileSync(path.join(__dirname, 'entry.nunjucks.js')).toString();
  // 入口文件路径
  const entryPath = path.join(tmpDirPath, `entry.${configEntryName}.js`);
  // 在获取路由的路径之前先写入router 的模版js文件
  const routesPath = getRoutesPath(
    path.dirname(configTheme),
    configEntryName,
  );
  // 在模版文件路径中写入入口文件
  fs.writeFileSync(
    entryPath,
    nunjucks.renderString(entryTemplate, {
      routesPath: escapeWinPath(routesPath),
      root: escapeWinPath(root),
    }),
  );
}

/** 
 *  program 为命令行 接受的参数
*/

exports.start = function start(program) {
  //获取配置文件
  const configFile = path.join(
    process.cwd(),
    program.config || 'bisheng.config.js',
  );
  // 获取配置对象
  const bishengConfig = getBishengConfig(configFile);
  // 获取主题配置
  const themeConfig = getThemeConfig(bishengConfig.theme);
  //在上下文中导出 bishengConfig 和 themeConfig 
  context.initialize({
    bishengConfig,
    themeConfig,
  });

  //创建输出的文件夹
  mkdirp.sync(bishengConfig.output);
  // 以字符串的方式 读取模版html文件
  const template = fs.readFileSync(bishengConfig.htmlTemplate).toString();
  // dev manifest
  //dev manifest 文件
  const manifest = {
    js: [ `${bishengConfig.entryName}.js` ],
    // inject style    nikeshope
    css: [ ],
  }
  const templateData = Object.assign(
    { root: '/', manifest },
    bishengConfig.htmlTemplateExtraData || {},
  );
  const templatePath = path.join(
    process.cwd(),
    bishengConfig.output,
    'index.html',
  );
  // 把模版数据写入模版文件并输出到 output 
  fs.writeFileSync(templatePath, nunjucks.renderString(template, templateData));
  // 生成入口文件和路由文件
  generateEntryFile(
    bishengConfig.theme,
    bishengConfig.entryName,
    '/',
  );

  const webpackConfig = updateWebpackConfig(getWebpackCommonConfig(), 'start');
  webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
  const serverOptions = {
    quiet: true,
    hot: true,
    ...bishengConfig.devServerConfig,
    contentBase: path.join(process.cwd(), bishengConfig.output),
    historyApiFallback: true,
    host: 'localhost',
  };
  
  console.log(webpackConfig);
  // 启用webpack的热加载
  WebpackDevServer.addDevServerEntrypoints(webpackConfig, serverOptions);
  const compiler = webpack(webpackConfig);
  // Ref: https://github.com/pigcan/blog/issues/6
  // Webpack startup recompilation fix. Remove when @sokra fixes the bug.
  // https://github.com/webpack/webpack/issues/2983
  // https://github.com/webpack/watchpack/issues/25
  const timefix = 11000;
  compiler.plugin('watch-run', (watching, callback) => {
    watching.startTime += timefix;
    callback();
  });
  compiler.plugin('done', (stats) => {
    stats.startTime -= timefix;
  });
  //https://webpack.js.org/guides/hot-module-replacement/#via-the-nodejs-api
  const server = new WebpackDevServer(compiler, serverOptions);
  server.listen(bishengConfig.port, '0.0.0.0', () => openBrowser(`http://localhost:${bishengConfig.port}`));
};

// const ssrTemplate = fs
//   .readFileSync(path.join(__dirname, 'ssr.nunjucks.js'))
//   .toString();

function filenameToUrl(filename) {
  if (filename.endsWith('index.html')) {
    return filename.replace(/index\.html$/, '');
  }
  return filename.replace(/\.html$/, '');
}

// hash { js: ['index-{hash}.js', ...], css: [ 'index.{hash}-{chunkId}.css' ] }
// no hash // { js: ['index.js', ...], css: [ 'index.{chunkId}.css' ] }
function getManifest(compilation) {
  const manifest = {}
  compilation.entrypoints.forEach((entrypoint, name) => {
    const js = [];
    const css = [];
    const initials = new Set();
    const chunks = entrypoint.chunks;
    // Walk main chunks
    for (const chunk of chunks) {
      for (let file of chunk.files) {
        if (!initials.has(file)) {
          initials.add(file);

          // Get extname
          const ext = path.extname(file).toLowerCase();
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
    }

    manifest[name] = { js, css };
  })
  return manifest;
}

exports.build = function build(program, callback) {
  const configFile = path.join(
    process.cwd(),
    program.config || 'bisheng.config.js',
  );
  // 获取配置对象
  const bishengConfig = getBishengConfig(configFile);
  const themeConfig = getThemeConfig(bishengConfig.theme);
  context.initialize({
    bishengConfig,
    themeConfig,
    isBuild: true,
  });
  mkdirp.sync(bishengConfig.output);

  const { entryName } = bishengConfig;
  generateEntryFile(
    bishengConfig.theme,
    entryName,
    bishengConfig.root,
  );
  const webpackConfig = updateWebpackConfig(getWebpackCommonConfig(), 'build');
  webpackConfig.plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    }),
  );

  webpackConfig.plugins.push(
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(
        process.env.NODE_ENV || 'production',
      ),
    }),
  );

  const ssrWebpackConfig = Object.assign({}, webpackConfig);
  const ssrPath = path.join(tmpDirPath, `ssr.${entryName}.js`);
  const routesPath = getRoutesPath(path.dirname(bishengConfig.theme), entryName);
  fs.writeFileSync(ssrPath, nunjucks.renderString(ssrTemplate, { routesPath: escapeWinPath(routesPath) }));

  ssrWebpackConfig.entry = {
    [`${entryName}-ssr`]: ssrPath,
  };
  ssrWebpackConfig.target = 'node';
  ssrWebpackConfig.output = Object.assign({}, ssrWebpackConfig.output, {
    filename: '[name].js',
    path: tmpDirPath,
    library: 'ssr',
    libraryTarget: 'commonjs',
  });

  webpack(webpackConfig, (err, stats) => {
    if (err !== null) {
      return console.error(err);
    }

    if (stats.hasErrors()) {
      console.log(stats.toString('errors-only'));
      return;
    }
    const manifest = getManifest(stats.compilation)[bishengConfig.entryName];

    const markdown = sourceData.generate(bishengConfig.source, bishengConfig.transformers);
    let filesNeedCreated = generateFilesPath(themeConfig.routes, markdown).map(bishengConfig.filePathMapper);
    filesNeedCreated = R.unnest(filesNeedCreated);

    const template = fs.readFileSync(bishengConfig.htmlTemplate).toString();

    if (!program.ssr) {
      require('./loaders/common/boss').jobDone();
      const templateData = Object.assign(
        {
          root: bishengConfig.root,
          hash: bishengConfig.hash,
          manifest,
        },
        bishengConfig.htmlTemplateExtraData || {},
      );
      const fileContent = nunjucks.renderString(template, templateData);
      filesNeedCreated.forEach((file) => {
        const output = path.join(bishengConfig.output, file);
        mkdirp.sync(path.dirname(output));
        fs.writeFileSync(output, fileContent);
        console.log('Created: ', output);
      });

      if (callback) {
        callback();
      }
      return;
    }

    context.turnOnSSRFlag();
    // If we can build webpackConfig without errors, we can build ssrWebpackConfig without errors.
    // Because ssrWebpackConfig are just part of webpackConfig.
    webpack(ssrWebpackConfig, (ssrBuildErr, ssrBuildStats) => {
      if (ssrBuildErr) throw ssrBuildErr;
      if (ssrBuildStats.hasErrors()) throw ssrBuildStats.toString('errors-only');

      require('./loaders/common/boss').jobDone();

      const { ssr } = require(path.join(tmpDirPath, `${entryName}-ssr`));
      const fileCreatedPromises = filesNeedCreated.map((file) => {
        const output = path.join(bishengConfig.output, file);
        mkdirp.sync(path.dirname(output));
        return new Promise((resolve) => {
          ssr(filenameToUrl(file), (error, content) => {
            if (error) {
              console.error(error);
              process.exit(1);
            }
            const templateData = Object.assign(
              {
                root: bishengConfig.root,
                content, hash: bishengConfig.hash,
                manifest,
              },
              bishengConfig.htmlTemplateExtraData || {},
            );
            const fileContent = nunjucks.renderString(template, templateData);
            fs.writeFileSync(output, fileContent);
            console.log('Created: ', output);
            resolve();
          });
        });
      });
      Promise.all(fileCreatedPromises).then(() => {
        if (callback) {
          callback();
        }
      });
    });
  });
};

function pushToGhPages(basePath, config) {
  const options = {
    ...config,
    depth: 1,
    logger(message) {
      console.log(message);
    },
  };
  if (process.env.RUN_ENV_USER) {
    options.user = {
      name: process.env.RUN_ENV_USER,
      email: process.env.RUN_ENV_EMAIL,
    };
  }
  ghPages.publish(basePath, options, (err) => {
    if (err) {
      throw err;
    }
    console.log('Site has been published!');
  });
}
exports.deploy = function deploy(program) {
  const config = {
    remote: program.remote,
    branch: program.branch,
  };
  if (program.pushOnly) {
    const output = typeof program.pushOnly === 'string' ? program.pushOnly : './_site';
    const basePath = path.join(process.cwd(), output);
    pushToGhPages(basePath, config);
  } else {
    const configFile = path.join(
      process.cwd(),
      program.config || 'bisheng.config.js',
    );
    const bishengConfig = getBishengConfig(configFile);
    const basePath = path.join(process.cwd(), bishengConfig.output);
    exports.build(program, () => pushToGhPages(basePath, config));
  }
};
