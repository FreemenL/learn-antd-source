/*!
 * 
 * own-tools v1.0.0
 * 
 * Copyright 2015-present, Alipay, Inc.
 * All rights reserved.
 *       
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["own-tools"] = factory();
	else
		root["own-tools"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./index-with-locales.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./index-with-locales.js":
/*!*******************************!*\
  !*** ./index-with-locales.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

throw new Error("Module build failed (from ./node_modules/_babel-loader@8.0.5@babel-loader/lib/index.js):\nError: Duplicate plugin/preset detected.\nIf you'd like to use two separate instances of a plugin,\nthey need separate names, e.g.\n\n  plugins: [\n    ['some-plugin', {}],\n    ['some-plugin', {}, 'some unique name'],\n  ]\n    at assertNoDuplicates (/Users/jiayali/Desktop/learn-antd-source/own-tool/node_modules/_@babel_core@7.2.0@@babel/core/lib/config/config-descriptors.js:205:13)\n    at createDescriptors (/Users/jiayali/Desktop/learn-antd-source/own-tool/node_modules/_@babel_core@7.2.0@@babel/core/lib/config/config-descriptors.js:114:3)\n    at createPluginDescriptors (/Users/jiayali/Desktop/learn-antd-source/own-tool/node_modules/_@babel_core@7.2.0@@babel/core/lib/config/config-descriptors.js:105:10)\n    at alias (/Users/jiayali/Desktop/learn-antd-source/own-tool/node_modules/_@babel_core@7.2.0@@babel/core/lib/config/config-descriptors.js:63:49)\n    at cachedFunction (/Users/jiayali/Desktop/learn-antd-source/own-tool/node_modules/_@babel_core@7.2.0@@babel/core/lib/config/caching.js:33:19)\n    at plugins.plugins (/Users/jiayali/Desktop/learn-antd-source/own-tool/node_modules/_@babel_core@7.2.0@@babel/core/lib/config/config-descriptors.js:28:77)\n    at mergeChainOpts (/Users/jiayali/Desktop/learn-antd-source/own-tool/node_modules/_@babel_core@7.2.0@@babel/core/lib/config/config-chain.js:319:26)\n    at /Users/jiayali/Desktop/learn-antd-source/own-tool/node_modules/_@babel_core@7.2.0@@babel/core/lib/config/config-chain.js:283:7\n    at buildRootChain (/Users/jiayali/Desktop/learn-antd-source/own-tool/node_modules/_@babel_core@7.2.0@@babel/core/lib/config/config-chain.js:68:29)\n    at loadPrivatePartialConfig (/Users/jiayali/Desktop/learn-antd-source/own-tool/node_modules/_@babel_core@7.2.0@@babel/core/lib/config/partial.js:85:55)\n    at Object.loadPartialConfig (/Users/jiayali/Desktop/learn-antd-source/own-tool/node_modules/_@babel_core@7.2.0@@babel/core/lib/config/partial.js:110:18)\n    at Object.<anonymous> (/Users/jiayali/Desktop/learn-antd-source/own-tool/node_modules/_babel-loader@8.0.5@babel-loader/lib/index.js:140:26)\n    at Generator.next (<anonymous>)\n    at asyncGeneratorStep (/Users/jiayali/Desktop/learn-antd-source/own-tool/node_modules/_babel-loader@8.0.5@babel-loader/lib/index.js:3:103)\n    at _next (/Users/jiayali/Desktop/learn-antd-source/own-tool/node_modules/_babel-loader@8.0.5@babel-loader/lib/index.js:5:194)\n    at /Users/jiayali/Desktop/learn-antd-source/own-tool/node_modules/_babel-loader@8.0.5@babel-loader/lib/index.js:5:364");

/***/ })

/******/ });
});
//# sourceMappingURL=antd-with-locales.js.map