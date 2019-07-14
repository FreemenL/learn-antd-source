"use strict";

var parser = _interopRequireWildcard(require("@babel/parser"));

var _traverse = _interopRequireDefault(require("@babel/traverse"));

var _generator = _interopRequireDefault(require("@babel/generator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

var code = "function square(n) {\n  return n * n;\n}"; // 解析 

var ast = parser.parse(code, {
  sourceFilename: 'a.js'
}); // 转换

(0, _traverse["default"])(ast, {
  enter: function enter(path) {
    if (path.isIdentifier({
      name: "n"
    })) {
      path.node.name = "x";
    }
  }
}); // 生成

var output = (0, _generator["default"])(ast, {}, code);
console.log(output.code);