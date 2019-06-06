"use strict";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var chain = require('ramda/src/chain'); //把 jsonml 转为 reactElement 


var toReactElement = require('jsonml-to-react-element');

var exist = require('exist.js');

var NProgress = require('nprogress-for-antd');

var NotFound = require('/Users/jiayali/Desktop/learn-antd-source/learn-antd-source/ant-design-3.16.1/site/theme/template/NotFound');

var themeConfig = JSON.parse('{"categoryOrder":{"Ant Design":0,"原则":1,"Principles":1,"视觉":2,"Visual":2,"模式":3,"Patterns":3,"其他":6,"Other":6,"Components":100},"typeOrder":{"General":0,"Layout":1,"Navigation":2,"Data Entry":3,"Data Display":4,"Feedback":5,"Other":6,"通用":0,"布局":1,"导航":2,"数据录入":3,"数据展示":4,"反馈":5,"其他":6},"docVersions":{"0.9.x":"http://09x.ant.design","0.10.x":"http://010x.ant.design","0.11.x":"http://011x.ant.design","0.12.x":"http://012x.ant.design","1.x":"http://1x.ant.design","2.x":"http://2x.ant.design"}}');

function calcPropsPath(dataPath, params) {
  return typeof dataPath === 'function' ? dataPath(params) : Object.keys(params).reduce(function (path, param) {
    return path.replace(":".concat(param), params[param]);
  }, dataPath);
}

function generateUtils(data, props) {
  var plugins = data.plugins.map(function (pluginTupple) {
    return pluginTupple[0](pluginTupple[1], props);
  });
  var converters = chain(function (plugin) {
    return plugin.converters || [];
  }, plugins);
  var utils = {
    get: exist.get,
    toReactComponent: function toReactComponent(jsonml) {
      return toReactElement(jsonml, converters);
    }
  };
  plugins.map(function (plugin) {
    return plugin.utils || {};
  }).forEach(function (u) {
    return Object.assign(utils, u);
  });
  return utils;
}

function defaultCollector(_x) {
  return _defaultCollector.apply(this, arguments);
}

function _defaultCollector() {
  _defaultCollector = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(nextProps) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", nextProps);

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _defaultCollector.apply(this, arguments);
}

module.exports = function getRoutes(data) {
  function templateWrapper(template) {
    var dataPath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    var Template = require("/Users/jiayali/Desktop/learn-antd-source/learn-antd-source/ant-design-3.16.1/site/theme/template".concat(template.replace(/^\.\/template/, '')));

    return function (nextState, callback) {
      var propsPath = calcPropsPath(dataPath, nextState.params);
      var pageData = exist.get(data.markdown, propsPath.replace(/^\//, '').split('/'));
      var utils = generateUtils(data, nextState);
      var collector = (Template["default"] || Template).collector || defaultCollector;
      var dynamicPropsKey = nextState.location.pathname;

      var nextProps = _objectSpread({}, nextState, {
        themeConfig: themeConfig,
        data: data.markdown,
        picked: data.picked,
        pageData: pageData,
        utils: utils
      });

      collector(nextProps).then(function (collectedValue) {
        try {
          var Comp = Template["default"] || Template;
          Comp[dynamicPropsKey] = _objectSpread({}, nextProps, collectedValue);
          callback(null, Comp);
        } catch (e) {
          console.error(e);
        }
      })["catch"](function (err) {
        var Comp = NotFound["default"] || NotFound;
        Comp[dynamicPropsKey] = nextProps;
        callback(err === 404 ? null : err, Comp);
      });
    };
  }

  var themeRoutes = JSON.parse('{"path":"/","component":"./template/Layout/index","indexRoute":{"component":"./template/Home/index"},"childRoutes":[{"path":"app-shell","component":"./template/AppShell"},{"path":"index-cn","component":"./template/Home/index"},{"path":"docs/pattern/:children","component":"./template/Redirect"},{"path":"docs/react/:children","component":"./template/Content/index"},{"path":"changelog","component":"./template/Content/index"},{"path":"changelog-cn","component":"./template/Content/index"},{"path":"components/:children/","component":"./template/Content/index"},{"path":"docs/spec/feature","component":"./template/Redirect"},{"path":"docs/spec/feature-cn","component":"./template/Redirect"},{"path":"docs/spec/:children","component":"./template/Content/index"},{"path":"docs/resource/:children","component":"./template/Redirect"}]}');
  var routes = Array.isArray(themeRoutes) ? themeRoutes : [themeRoutes];

  function processRoutes(route) {
    if (Array.isArray(route)) {
      return route.map(processRoutes);
    }

    return Object.assign({}, route, {
      onEnter: function onEnter() {
        if (typeof document !== 'undefined') {
          NProgress.start();
        }
      },
      component: undefined,
      getComponent: templateWrapper(route.component, route.dataPath || route.path),
      indexRoute: route.indexRoute && Object.assign({}, route.indexRoute, {
        component: undefined,
        getComponent: templateWrapper(route.indexRoute.component, route.indexRoute.dataPath || route.indexRoute.path)
      }),
      childRoutes: route.childRoutes && route.childRoutes.map(processRoutes)
    });
  }

  var processedRoutes = processRoutes(routes);
  processedRoutes.push({
    path: '*',
    getComponents: templateWrapper('./template/NotFound')
  });
  return processedRoutes;
};