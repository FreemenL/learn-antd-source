const less = require("less");
const path = require("path");
const postcssConfig = require('./postcssConfig');
const postcss = require("postcss");
const { readFileSync } = require('fs');

const lessOpts = {
    paths: [ path.dirname('./index.less') ],
    filename: './index.less',
    javascriptEnabled: true,
    sourceMap: {sourceMapFileInline: true}
};

let data = readFileSync('index.less', 'utf-8');
  data = data.replace(/^\uFEFF/, '');

less.render(data, lessOpts).then((res)=>{
    return res;
}).then(result => postcss(postcssConfig.plugins).process(result.css, { from: undefined }))
.then(r => console.log(r.css));
// console.log(less.render(data, lessOpts).then((res)=>{
//     // console.log(res);
// }));