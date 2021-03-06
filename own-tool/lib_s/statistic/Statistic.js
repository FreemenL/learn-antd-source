"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var React = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _configProvider = require("../config-provider");

var _Number = _interopRequireDefault(require("./Number"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var Statistic = function Statistic(props) {
  var prefixCls = props.prefixCls,
      className = props.className,
      style = props.style,
      valueStyle = props.valueStyle,
      _props$value = props.value,
      value = _props$value === void 0 ? 0 : _props$value,
      title = props.title,
      valueRender = props.valueRender,
      prefix = props.prefix,
      suffix = props.suffix;
  var valueNode = React.createElement(_Number["default"], _extends({}, props, {
    value: value
  }));

  if (valueRender) {
    valueNode = valueRender(valueNode);
  }

  return React.createElement("div", {
    className: (0, _classnames["default"])(prefixCls, className),
    style: style
  }, title && React.createElement("div", {
    className: "".concat(prefixCls, "-title")
  }, title), React.createElement("div", {
    style: valueStyle,
    className: "".concat(prefixCls, "-content")
  }, prefix && React.createElement("span", {
    className: "".concat(prefixCls, "-content-prefix")
  }, prefix), valueNode, suffix && React.createElement("span", {
    className: "".concat(prefixCls, "-content-suffix")
  }, suffix)));
};

Statistic.defaultProps = {
  decimalSeparator: '.',
  groupSeparator: ','
};
var WrapperStatistic = (0, _configProvider.withConfigConsumer)({
  prefixCls: 'statistic'
})(Statistic);
var _default = WrapperStatistic;
exports["default"] = _default;
module.exports = exports.default;