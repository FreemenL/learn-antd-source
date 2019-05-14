var gulp = require('gulp');
var ts = require('gulp-typescript');
var merge = require('merge2');  // Requires separate installation
const tsDefaultReporter = ts.reporter.defaultReporter();
const tsConfig = require('./getTSCommonConfig')();
// gulp.task('scripts', function() {

//     var tsResult = gulp.src('components/**/*.ts')
//         .pipe(ts({
//             declaration: true
//         }));
 
//     return merge([
//         tsResult.dts.pipe(gulp.dest('release/definitions')),
//         tsResult.js.pipe(gulp.dest('release/js'))
//     ]);

// });


let error = 0;
gulp.task('default', async function() {
    const source = ['components/**/*.tsx', 'components/**/*.ts', 'typings/**/*.d.ts'];
    const tsResult = gulp.src(source).pipe(
        ts(tsConfig,{
        error(e) {
            tsDefaultReporter.error(e);
            error = 1;
        },
            finish: tsDefaultReporter.finish,
        })
    );

    function check() {
        if (error && !argv['ignore-error']) {
            console.log(error)
            process.exit(1);
        }
    }

    tsResult.on('finish', check);
    tsResult.on('end', check);
    // const tsFilesStream = babelify(tsResult.js, modules);
    await tsResult.dts.pipe(gulp.dest("libs"));
  })
