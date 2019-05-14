const { series } = require('gulp');

function javascript(cb) {
  // body omitted
   console.log("js")
  cb();
}

function css(cb) {
  console.log('css');
  cb();
}

series(javascript, css)();
