const bundle = require("less-bundle-promise");
const less  = require("less");
const path = require("path");
const NpmImportPlugin = require('less-plugin-npm-import');
// bundle({
//     src: './style.less'
// })
// .then(output =>{
//     console.log(generateColorMap(output));
// }).catch(error => {
//     console.log('Error', error);
// });

// 编译less文件输出 css 
function render(text, paths) {
    return less.render.call(less, text, {
      paths: paths,
      javascriptEnabled: true,
      plugins: [new NpmImportPlugin({ prefix: '~' })]
    });
}

let themeVars = ["@component-background"];

bundle({
    src: './style.less'
})
.then(colorsLess => {
    // 解析文件中的颜色变量
    const mappings = Object.assign(generateColorMap(colorsLess));
    return [mappings,colorsLess];
})
.then(([ mappings,colorsLess]) => {
    let css = "";
    themeVars = themeVars.filter(name => name in mappings);
    themeVars.forEach(varName => {
      const color = mappings[varName];
      css = `.${varName.replace("@", "")} { color: ${color}; }\n ${css}`;
    });
    themeVars.forEach(varName => {
      [1, 2, 3, 4, 5, 7].forEach(key => {
        let name = varName === '@primary-color' ? `@primary-${key}` : `${varName}-${key}`;
        css = `.${name.replace("@", "")} { color: ${getShade(name)}; }\n ${css}`;
      });
    });
    
    css = `${colorsLess}\n${css}`;
    // console.log(css);
    
    render(css, [path.join(__dirname,'styles')]);
  })


  function getShade(varName) {
    let [, className, number] = varName.match(/(.*)-(\d)/);
    if (/primary-\d/.test(varName)) className = '@primary-color';
    return 'color(~`colorPalette("@{' + className.replace('@', '') + '}", ' + number + ")`)";
  }

// 验证字符串是否为颜色值
function isValidColor(color) {
  if (!color || color.match(/px/g)) return false;
  if (color.match(/colorPalette|fade/g)) return true;
  if (color.charAt(0) === "#") {
    color = color.substring(1);
    return (
      [3, 4, 6, 8].indexOf(color.length) > -1 && !isNaN(parseInt(color, 16))
    );
  }
  return /^(rgb|hsl|hsv)a?\((\d+%?(deg|rad|grad|turn)?[,\s]+){2,3}[\s\/]*[\d\.]+%?\)$/i.test(
    color
  );
}
/*
  Read following files and generate color variables and color codes mapping
    - Ant design color.less, themes/default.less
    - Your own variables.less
  It will generate map like this
  {
    '@primary-color': '#00375B',
    '@info-color': '#1890ff',
    '@success-color': '#52c41a',
    '@error-color': '#f5222d',
    '@normal-color': '#d9d9d9',
    '@primary-6': '#1890ff',
    '@heading-color': '#fa8c16',
    '@text-color': '#cccccc',
    ....
  }
*/
function generateColorMap(content) {
    console.log(content)
    return content
      .split("\n")
      .filter(line => line.startsWith("@") && line.indexOf(":") > -1)
      .reduce((prev, next) => {
        try {
          const matches = next.match(
            /(?=\S*['-])([@a-zA-Z0-9'-]+).*:[ ]{1,}(.*);/
          );
          if (!matches) {
            return prev;
          }
          
          let [, varName, color] = matches;
          if (color && color.startsWith("@")) {
            color = getColor(color, prev);
            if (!isValidColor(color)) return prev;
            prev[varName] = color;
          } else if (isValidColor(color)) {
            prev[varName] = color;
          }
          return prev;
        } catch (e) {
          console.log("e", e);
          return prev;
        }
      }, {});
  }