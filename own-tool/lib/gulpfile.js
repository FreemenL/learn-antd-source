const { getProjectPath, injectRequire } = require('./utils/projectHelper'); // eslint-disable-line import/order

// 从新定义node 的 require 函数
injectRequire();

const merge2 = require('merge2');// 将多个流按顺序或并行合并为一个流 
const { execSync } = require('child_process');
//用于处理node的stream
const through2 = require('through2');
const webpack = require('webpack');
const babel = require('gulp-babel');
const argv = require('minimist')(process.argv.slice(2));
const chalk = require('chalk');
const path = require('path');
const watch = require('gulp-watch');
const ts = require('gulp-typescript');
const gulp = require('gulp');
const fs = require('fs');
const rimraf = require('rimraf');
//编译后处理
const stripCode = require('gulp-strip-code');
const install = require('./install');
const runCmd = require('./runCmd');
const getBabelCommonConfig = require('./getBabelCommonConfig');
const transformLess = require('./transformLess');
const getNpm = require('./getNpm');
const selfPackage = require('../package.json');
const getNpmArgs = require('./utils/get-npm-args');
const { cssInjection } = require('./utils/styleUtil');
const tsConfig = require('./getTSCommonConfig')();
const replaceLib = require('./replaceLib');

const packageJson = require(getProjectPath('package.json'));

const tsDefaultReporter = ts.reporter.defaultReporter();
const cwd = process.cwd();
const libDir = getProjectPath('lib_s');
const esDir = getProjectPath('es_s');

function dist(done) {
  rimraf.sync(getProjectPath('dist'));
  process.env.RUN_ENV = 'PRODUCTION';
  const webpackConfig = require(getProjectPath('webpack.config.js'));
  //生产环境webpack配置会导出一个数组
  webpack(webpackConfig, (err, stats) => {
    if (err) {
      console.error(err.stack || err);
      if (err.details) {
        console.error(err.details);
      }
      return;
    }
    const info = stats.toJson();

    if (stats.hasErrors()) {
      console.error(info.errors);
    }

    if (stats.hasWarnings()) {
      console.warn(info.warnings);
    }

    const buildInfo = stats.toString({
      colors: true,
      children: true,
      chunks: false,
      modules: false,
      chunkModules: false,
      hash: false,
      version: false,
    });
    console.log(buildInfo);
    done(0);
  });
}

function tag() {
  console.log('tagging');
  const { version } = packageJson;
  execSync(`git tag ${version}`);
  execSync(`git push origin ${version}:${version}`);
  execSync('git push origin master:master');
  console.log('tagged');
}

// 发包之前   检查git的状态  和有无没有没有提交的内容
gulp.task(
  'check-git',
  gulp.series(done => {
    runCmd('git', ['status', '--porcelain'],(code, result) => {
      if (/^\?\?/m.test(result)) {
        return done(`There are untracked files in the working tree.\n${result}
      `);
      }
      if (/^([ADRM]| [ADRM])/m.test(result)) {
        return done(`There are uncommitted changes in the working tree.\n${result}
      `);
      }
      return done();
    });
  })
);

// 删除 _site  _data 文件夹 
gulp.task('clean', () => {
  rimraf.sync(getProjectPath('_site'));
  rimraf.sync(getProjectPath('_data'));
});


gulp.task(
  'dist',
  gulp.series(done => {
    dist(done);
  })
);

const lintWrapper = (amd) => (done)=>{
  if( amd && !Array.isArray(amd)){
    console.error('tslint parameter error!')
    process.exit(1);
  }
  const lastCmd = amd?amd:[];
  const tslintBin = require.resolve('tslint/bin/tslint');
  const tslintConfig = path.join(__dirname, './tslint.json');
  const args = [tslintBin, '-c', tslintConfig, 'components/**/*.tsx'].concat(lastCmd);
  runCmd('node', args, done);
}

/**
 * 下面是lint 执行的代码 ，这里所做的就是把ts-lint的依赖和tslint的配置文件 丢在构建工具中   用node去执行tslint 的主文件并把参数传进去
*/
gulp.task(
  'ts-lint',
   gulp.series(lintWrapper())
);

gulp.task(
  'ts-lint-fix',
  gulp.series(lintWrapper(['--fix']))
);

const tsFiles = ['**/*.ts', '**/*.tsx', '!node_modules/**/*.*', 'typings/**/*.d.ts'];

// 编译ts文件
function compileTs(stream) {
  return stream
    .pipe(ts(tsConfig))
    .js.pipe(
      through2.obj(function(file, encoding, next) {
        // console.log(file.path, file.base);
        file.path = file.path.replace(/\.[jt]sx$/, '.js');
        this.push(file);
        next();
      })
    )
    .pipe(gulp.dest(process.cwd()));
}

gulp.task('tsc', () =>
  compileTs(
    gulp.src(tsFiles, {
      base: cwd,
    })
  )
);

gulp.task(
  'watch-tsc',
  gulp.series('tsc', () => {
    watch(tsFiles, f => {
      if (f.event === 'unlink') {
        const fileToDelete = f.path.replace(/\.tsx?$/, '.js');
        if (fs.existsSync(fileToDelete)) {
          fs.unlinkSync(fileToDelete);
        }
        return;
      }
      const myPath = path.relative(cwd, f.path);
      compileTs(
        gulp.src([myPath, 'typings/**/*.d.ts'], {
          base: cwd,
        })
      );
    });
  })
);

// babel 解析 es6语法
function babelify(js, modules) {
  const babelConfig = getBabelCommonConfig(modules);
  delete babelConfig.cacheDirectory;
  if (modules === false) {
    //如果是es6 的模块化 则添加自定义babel插件处理引入关系 从es文件夹下引入模块
    babelConfig.plugins.push(replaceLib);
  } else {
    // babel-plugin-add-module-exports 处理文件中的导出语法
    babelConfig.plugins.push(require.resolve('babel-plugin-add-module-exports'));
  }
  let stream = js.pipe(babel(babelConfig)).pipe(
    through2.obj(function z(file, encoding, next) {
      this.push(file.clone());
      if (file.path.match(/(\/|\\)style(\/|\\)index\.js/)) {
        const content = file.contents.toString(encoding);
        if (content.indexOf("'react-native'") !== -1) {
          // actually in antd-mobile@2.0, this case will never run,
          // since we both split style/index.mative.js style/index.js
          // but let us keep this check at here
          // in case some of our developer made a file name mistake ==
          next();
          return;
        }
        // 根据index.js生成一份css.js
        file.contents = Buffer.from(cssInjection(content));
        file.path = file.path.replace(/index\.js/, 'css.js');
        this.push(file);
        next();
      } else {
        next();
      }
    })
  );
  if (modules === false) {
    // 编译后删除 以
    // @remove-on-es-build-begin 开头 
    // @remove-on-es-build-end 结尾
    // 的部分
    stream = stream.pipe(
      stripCode({
        start_comment: '@remove-on-es-build-begin',
        end_comment: '@remove-on-es-build-end',
      })
    );
  }
  return stream.pipe(gulp.dest(modules === false ? esDir : libDir));
}

/** 
>1.编译less 文件输出一份拷贝的less 和css 文件
>2.处理静态资源文件
>3.处理ts文件
>4.用babel解析js文件流
*/
function compile(modules) {
  rimraf.sync(modules !== false ? libDir : esDir);
  // 编译less 文件输出一份拷贝的less 和css 文件
  const less = gulp
    .src(['components/**/*.less'])
    .pipe(
      through2.obj(function(file, encoding, next) {
        // file._contents // 文件内容 Buffer
        // 添加原文件
        this.push(file.clone());
        if (
          file.path.match(/(\/|\\)style(\/|\\)index\.less$/) ||
          file.path.match(/(\/|\\)style(\/|\\)v2-compatible-reset\.less$/)
        ) {
          // 转换css 
          transformLess(file.path)
            .then(css => {
              file.contents = Buffer.from(css);
              file.path = file.path.replace(/\.less$/, '.css');
              this.push(file);
              next();
            })
            .catch(e => {
              console.error(e);
            });
        } else {
            next();
        }
      })
    )
  //css less 文件产出
  .pipe(gulp.dest( modules === false ? esDir : libDir));
  const assets = gulp
    .src(['components/**/*.@(png|svg)'])
    .pipe(gulp.dest(modules === false ? esDir : libDir));
  let error = 0;
  const source = ['components/**/*.tsx', 'components/**/*.ts', 'typings/**/*.d.ts'];
  // allow jsx file in components/xxx/
  if (tsConfig.allowJs) {
    source.unshift('components/**/*.jsx');
  }
  // 处理ts文件
  //tsResult是包含生成的JavaScript和定义文件的流。在许多情况下，需要在JavaScript文件上执行一些插件。对于这些情况，流具有子流，即JavaScript流（tsResult.js）和定义文件流（tsResult.dts）
  const tsResult = gulp.src(source).pipe(
    ts(tsConfig, {
      error(e) {
        tsDefaultReporter.error(e);
        error = 1;
      },
      finish:tsDefaultReporter.finish,
    })
  );

  function check() {
    if (error && !argv['ignore-error']) {
      process.exit(1);
    }
  }

  tsResult.on('finish', check);
  tsResult.on('end', check);
  // console.log(tsResult);
  //处理 es6 文件
  const tsFilesStream = babelify(tsResult.js, modules);
  const tsd = tsResult.dts.pipe(gulp.dest(modules === false ? esDir : libDir));
  return merge2([less, tsFilesStream, tsd, assets]);
}

function publish(tagString, done) {
  let args = ['publish', '--with-antd-tools', '--access=public'];
  if (tagString) {
    args = args.concat(['--tag', tagString]);
  }
  const publishNpm = process.env.PUBLISH_NPM_CLI || 'npm';
  runCmd(publishNpm, args, code => {
    if (!argv['skip-tag']) {
      tag();
    }
    done(code);
  });
}

function pub(done) {
  dist(code => {
    if (code) {
      done(code);
      return;
    }
    const notOk = !packageJson.version.match(/^\d+\.\d+\.\d+$/);
    let tagString;
    if (argv['npm-tag']) {
      tagString = argv['npm-tag'];
    }
    if (!tagString && notOk) {
      tagString = 'next';
    }
    if (packageJson.scripts['pre-publish']) {
      runCmd('npm', ['run', 'pre-publish'], code2 => {
        if (code2) {
          done(code2);
          return;
        }
        publish(tagString, done);
      });
    } else {
      publish(tagString, done);
    }
  });
}

gulp.task('compile-with-es', done => {
  console.log('[Parallel] Compile to es...');
  compile(false).on('finish', done);
});

gulp.task('compile-with-lib', done => {
  console.log('[Parallel] Compile to js...');
  compile().on('finish', done);
});

//gulp.parallel 并发执行
gulp.task('compile', gulp.parallel('compile-with-es', 'compile-with-lib'));

gulp.task(
  'install',
  gulp.series(done => {
    install(done);
  })
);

gulp.task(
  'pub',
 //gulp.series 串行执行 check-git compile
  gulp.series('check-git', 'compile', done => {
    // console.log("pub task");
    pub(done);
    // done();
  })
);

// 更新自己 antd-tools 
gulp.task(
  'update-self',
  gulp.series(done => {
    getNpm(npm => {
      console.log(`${npm} updating ${selfPackage.name}`);
      runCmd(npm, ['update', selfPackage.name], c => {
        console.log(`${npm} update ${selfPackage.name} end`);
        done(c);
      });
    });
  })
);

function reportError() {
  console.log(chalk.bgRed('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!'));
  console.log(chalk.bgRed('!! `npm publish` is forbidden for this package. !!'));
  console.log(chalk.bgRed('!! Use `npm run pub` instead.        !!'));
  console.log(chalk.bgRed('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!'));
}


//屏蔽掉 npm publish 的方式发包  （ 因为 prepuhlish 在包目录下执行npm install时也会执行）直接运行 npm publish 抛出错误
gulp.task(
  'guard',
  gulp.series(done => {
    // 获取 npm 参数 ;
    const npmArgs = getNpmArgs();

    if (npmArgs) {
      for (let arg = npmArgs.shift(); arg; arg = npmArgs.shift()) {
        if (/^pu(b(l(i(sh?)?)?)?)?$/.test(arg) && npmArgs.indexOf('--with-antd-tools') < 0) {
          reportError();
          done(1);
          return;
        }
      }
    }
    done();
  })
);









