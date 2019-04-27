'use strict';
// 命令行添加色彩
require('colorful').colorful();
// commander.js是TJ所写的一个工具包，其作用是让node命令行程序的制作更加简单
const program = require('commander');
const packageInfo = require('../../package.json');

program
  .version(packageInfo.version)
  .command('run [name]', 'run specified task')
  .parse(process.argv);

// https://github.com/tj/commander.js/pull/260
const proc = program.runningCommand;

//子命令执行实失败的处理
if (proc) {
  proc.on('close', process.exit.bind(process));
  proc.on('error', () => {
    process.exit(1);
  });
}

const subCmd = program.args[0];
if (!subCmd || subCmd !== 'run') {
  program.help();
}