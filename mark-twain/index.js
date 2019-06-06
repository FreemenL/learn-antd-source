const MT = require('mark-twain');
const fs = require('fs');
const jsonML = MT(fs.readFileSync('something.md').toString());
const test = require("./tests");

console.log(test);