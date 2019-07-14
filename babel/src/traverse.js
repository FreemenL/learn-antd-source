import * as parser from "@babel/parser";
import traverse from "@babel/traverse";
import generate from '@babel/generator';

const code = `function square(n) {
  return n * n;
}`;
// 解析 
const ast = parser.parse(code,{ sourceFilename: 'a.js' });
// 转换
traverse(ast, {
  enter(path) {
    if (path.isIdentifier({ name: "n" })) {
      path.node.name = "x";
    }
  }
});
// 生成
const output = generate(ast, { 
}, code);


console.log(output.code);
