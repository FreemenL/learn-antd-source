const postcss = require('postcss');
const less = require("less");

// postcss.plugin('postcss-test-plugin', function (opts) {
//     opts = opts || {};
//     // Work with options here
//     return function (root, result) {
//         // Transform CSS AST here
//     };
// });

const postcssPlugin = postcss.plugin("postcssPlugin", (opts) => {
    opts = opts || {};
    return css => {
        console.log(css);
        // css.walkAtRules(atRule => {
        //     atRule.remove();
        // });
        // css.walkRules(cleanRule);
        // css.walkComments(c => c.remove());
    };
});


postcss([postcssPlugin])
.process(`a{color:#fff}`, {
    parser: less.parser,
    from: './style.less',
    to:   'app.css'
    // map: { inline: true },
}).then((css)=>{
    console.log(css);
})



/**
 * 
 * 
 * const reducePlugin = postcss.plugin("reducePlugin", () => {
  const cleanRule = rule => {
    if (rule.selector.startsWith(".main-color .palatte-")) {
      rule.remove();
      return;
    }
    let removeRule = true;
    // 遍历每个属性
    rule.walkDecls(decl => {
      if (
        !decl.prop.includes("color") &&
        !decl.prop.includes("background") &&
        !decl.prop.includes("border") &&
        !decl.prop.includes("box-shadow")
      ) {
        decl.remove();
      } else {
        removeRule = false;
      }
    });
    if (removeRule) {
      rule.remove();
    }
  };
  return css => {
    css.walkAtRules(atRule => {
      atRule.remove();
    });
    // 循环遍历每个声明块
    css.walkRules(cleanRule);

    css.walkComments(c => c.remove());
  };
});
 */