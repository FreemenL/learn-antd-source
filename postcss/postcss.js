const postcss = require('postcss');
const less = require("less");

// 要转换的语法
const parseProps = {
    ta:'text-align'
}

// 策略模式转换语法
const parseRules = (rule,props)=> {
    if(parseProps[props]){
        rule['nodes'][0]['prop'] = parseProps[props];
    }
}

//定义插件
const postcssPlugin = postcss.plugin("postcssPlugin", (opts) => {
    // 在这里配置你的选项
    opts = opts || {};
    return root => {
        // root.walkRules 遍历容器的后代节点，为每个规则节点调用回调，如果传递过滤器，迭代将仅发生在具有匹配选择器的规则上。
        root.walkRules((rule)=>{
            parseRules(rule,rule['nodes'][0]['prop'])
        }); 
        root.walkComments(c => c.remove())
    };
});


postcss([postcssPlugin])
.process(`
    /* 这里是注释 */
    a{
        ta : center;
    }`, {
    parser: less.parser,
    from: './style.less',
}).then((css)=>{
    // 转换后的内容
    console.log(css.root);
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