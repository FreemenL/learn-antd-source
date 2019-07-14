"use strict";

var isInitialized = false;

exports.initialize = function (context) {
  if (isInitialized) {
    console.error('`context` had been initialized');
    return;
  } // 通过这种方式直接给 exports 挂载属性
  
  Object.assign(exports, context);
  isInitialized = true;
};

exports.turnOnSSRFlag = function () {
  exports.isSSR = true;
};