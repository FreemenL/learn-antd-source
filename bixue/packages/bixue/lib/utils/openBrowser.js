'use strict';

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var chalk = require('chalk');

var execSync = require('child_process').execSync;

var spawn = require('cross-spawn');

var open = require('open');

var OSX_CHROME = 'google chrome';
var Actions = Object.freeze({
  NONE: 0,
  BROWSER: 1,
  SCRIPT: 2
}); // 根据不同的环境返回相应的信息

function getBrowserEnv() {
  var value = process.env.BROWSER;
  var action;

  if (!value) {
    // Default.
    action = Actions.BROWSER;
  } else if (value.toLowerCase().endsWith('.js')) {
    action = Actions.SCRIPT;
  } else if (value.toLowerCase() === 'none') {
    action = Actions.NONE;
  } else {
    action = Actions.BROWSER;
  }

  return {
    action: action,
    value: value
  };
} //自己写node 脚本实现打开浏览器


function executeNodeScript(scriptPath, url) {
  var extraArgs = process.argv.slice(2);
  var child = spawn('node', [scriptPath].concat(_toConsumableArray(extraArgs), [url]), {
    stdio: 'inherit'
  });
  child.on('close', function (code) {
    if (code !== 0) {
      console.log();
      console.log(chalk.red('The script specified as BROWSER environment variable failed.'));
      console.log(chalk.cyan(scriptPath) + ' exited with code ' + code + '.');
      console.log();
      return;
    }
  });
  return true;
} // 用 appleScript 或者 open 模块打开浏览器


function startBrowserProcess(browser, url) {
  // process.platform 获取当前程序运行的操作系统平台
  var shouldTryOpenChromeWithAppleScript = process.platform === 'darwin' && (typeof browser !== 'string' || browser === OSX_CHROME);

  if (shouldTryOpenChromeWithAppleScript) {
    try {
      // Try our best to reuse existing tab
      // on OS X Google Chrome with AppleScript
      execSync('ps cax | grep "Google Chrome"');
      execSync('osascript openChrome.applescript "' + encodeURI(url) + '"', {
        cwd: __dirname,
        stdio: 'ignore'
      });
      return true;
    } catch (err) {// Ignore errors.
    }
  }

  if (process.platform === 'darwin' && browser === 'open') {
    browser = undefined;
  } // Fallback to open
  // (It will always open new tab)


  try {
    var options = {
      app: browser,
      wait: false
    };
    open(url, options)["catch"](function () {}); // Prevent `unhandledRejection` error.

    return true;
  } catch (err) {
    return false;
  }
} // 根据BROWSER的值决定使用何种方式打开浏览器


function openBrowser(url) {
  var _getBrowserEnv = getBrowserEnv(),
      action = _getBrowserEnv.action,
      value = _getBrowserEnv.value;

  switch (action) {
    case Actions.NONE:
      // Special case: BROWSER="none" will prevent opening completely.
      return false;

    case Actions.SCRIPT:
      return executeNodeScript(value, url);

    case Actions.BROWSER:
      return startBrowserProcess(value, url);

    default:
      throw new Error('Not implemented.');
  }
}

module.exports = openBrowser;